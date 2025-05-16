const Items = require("../../models/Logistics/Items.js")
const Company = require("../../models/Company.js")
const Pedido = require("../../models/Logistics/Pedidos.js")
const User = require("../../models/User.js")
const RegistroMovimientos = require("../../models/Logistics/RegistroMovimiento.js")

//Crear nuevos Items//////////////////////////////////////////////////////////////////////////////////////////////////// 
const createItems = async (req, res) => {
    const { materials, user } = req.body;
    const { CompanyId } = req.params;
    let company = "";

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        company = foundCompany.map((company) => company._id);
    }

    // Verificar que materials es un array válido
    if (!Array.isArray(materials)) {
        return res.status(400).json({ message: "Datos inválidos, se esperaba un array de materiales" });
    }

    //Registrar el movimiento en la base de datos
    const nuevoMovimiento = new RegistroMovimientos({
        // usuario: usuarioEncontrado._id,
        tipoAccion: "Modificar Items",
        detalles: `Actualizo la informacion de los Items con excel de PRISM.`
    })

    // Buscar ID del usuario en la base de datos
    if (user) {
        const foundUsers = await User.find({
            username: { $in: user },
        });
        nuevoMovimiento.usuario = foundUsers.map((user) => user._id);
    }

    try {
        for (const group of materials) {
            for (const material of group.materials) {
                const existingMaterial = await Items.findOne({ name: material.name });

                if (existingMaterial) {
                    // Si el material existe, actualizamos la cantidad
                    existingMaterial.qty += material.qty;
                    await existingMaterial.save();
                } else {
                    // Si el material no existe, lo creamos con el objeto valor2
                    const newMaterial = new Items({
                        ...material,
                        itemGroup: {
                            valor: material.itemGroup, // Asignamos el valor
                            descripcion: "Desconocido" // Descripción predeterminada
                        },
                        company: company,
                    });
                    await newMaterial.save();
                }
            }
        }
        await nuevoMovimiento.save();
        res.status(200).json({ status: "200", message: 'Materiales procesados correctamente' });
    } catch (error) {
        console.error('Error al procesar materiales:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//Metodo para obtener todos los items///////////////////////////////////////////////////////////////////////////////////
const getAllItems = async (req, res) => {
    const { CompanyId } = req.params
    if (CompanyId.length !== 24) {
        return;
    }
    const company = await Company.find({
        _id: { $in: CompanyId },
    })

    if (!company) {
        return;
    }
    const items = await Items.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
    res.json({ status: "200", message: "Items Loaded", body: items });
};

//Metodo para guardar los pedidos
// Método para guardar los pedidos
const createPedido = async (req, res) => {
    const formatter = new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const hour = parts.find(p => p.type === "hour").value;
    const minutes = parts.find(p => p.type === "minute").value;

    const time = `${hour}:${minutes}`;

    try {
        const { idPedido, usuario, maquina, materiales } = req.body.pedidos;

        // Validaciones básicas
        if (!idPedido || !usuario || !maquina || !materiales || materiales.length === 0) {
            return res.status(400).json({ status: "error", message: "Datos incompletos" });
        }

        // Crear nuevo pedido
        const nuevoPedido = new Pedido({
            idPedido,
            maquina,
            pStatus: "pending",
            surtidor: null,
            creationTime: time,
        });

        // Crear nuevo registro de movimientos
        const nuevoMovimiento = new RegistroMovimientos({
            tipoAccion: "Crear pedido",
            detalles: `Creó el pedido con id: ${idPedido}.`,
        });

        // Buscar usuario en la base de datos
        if (usuario) {
            const foundUsers = await User.find({ username: usuario });
            if (foundUsers.length === 0) {
                return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
            }
            nuevoPedido.usuario = foundUsers.map(u => u._id);
            nuevoMovimiento.usuario = foundUsers.map(u => u._id);
        }

        // Buscar materiales por nombre
        if (materiales.length > 0) {
            const names = materiales.map(mat => mat.name);
            const foundMaterials = await Items.find({ name: { $in: names } });

            if (!foundMaterials || foundMaterials.length === 0) {
                return res.status(404).json({ status: "error", message: "No se encontraron materiales en la base de datos" });
            }

            // Mapear correctamente los materiales con su ID y cantidad requerida
            nuevoPedido.items = materiales.map(mat => {
                const materialDB = foundMaterials.find(m => m.name === mat.name);
                if (materialDB) {
                    return {
                        id: materialDB._id,
                        serial: [],
                        quantityReq: mat.quantityReq || 1,
                        quantitySur: []
                    };
                }
            }).filter(Boolean); // filtrar nulos
        }

        // Guardar pedido y movimiento
        await nuevoPedido.save();
        await nuevoMovimiento.save();

        res.status(200).json({ status: "success", message: "Pedido guardado exitosamente", pedido: nuevoPedido });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al guardar el pedido", error: error.message });
    }
};


//Metodo para obtener todos los pedidos///////////////////////////////////////////////////////////////////////////////////
const getAllPedidos = async (req, res) => {
    const { CompanyId } = req.params
    if (CompanyId.length !== 24) {
        return;
    }
    const company = await Company.find({
        _id: { $in: CompanyId },
    })

    if (!company) {
        return;
    }

    const pedidos = await Pedido.find({
        company: { $in: CompanyId },
    }).sort({ idPedido: -1 })
        .populate({
            path: "usuario",
            select: "employee",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "surtidor",
            select: "employee",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "items",
            populate: { path: "id", select: "name description" }
        });
    res.json({ status: "200", message: "Pedidos Loaded", body: pedidos });
};

//Metodo para actualizar pedido surtido
// const updatePedido = async (req, res) => {
//     try {
//         const { idPedido } = req.params;
//         const { items, surtidor, pStatus } = req.body.pedido;

//         if (!idPedido || !items || !Array.isArray(items)) {
//             return res.status(400).json({ message: "Datos inválidos." });
//         }

//         // Buscar el pedido actual
//         const pedidoActual = await Pedido.findOne({ idPedido: idPedido });
//         if (!pedidoActual) {
//             return res.status(404).json({ message: "Pedido no encontrado." });
//         }

//         // Registrar el movimiento en la base de datos
//         const nuevoMovimiento = new RegistroMovimientos({
//             tipoAccion: "Surtir pedido",
//             detalles: `Surtió el pedido con id: ${idPedido}.`,
//         });

//         // Buscar el surtidor
//         let surtidorId = null;
//         if (surtidor) {
//             const foundUsers = await User.find({ username: surtidor });
//             surtidorId = foundUsers.map((user) => user._id);
//             nuevoMovimiento.usuario = surtidorId;
//         }

//         // Validar que el serial no esté duplicado dentro del mismo ítem
//         for (const item of items) {
//             const { id, serial } = item; // serial es un array de seriales
//             console.log(`Verificando ID: ${id}, Seriales: ${serial}`);

//             // Buscar si alguno de los seriales ya está registrado en otro pedido
//             const pedidoExistente = await Pedido.findOne({
//                 "items.id": id,
//                 "items.serial": { $in: serial }, // Busca si algún serial ya existe en otro pedido
//                 _id: { $ne: pedidoActual._id }, // Excluir el pedido actual
//             });

//             if (pedidoExistente) {
//                 // Buscar dentro del pedido existente cuál serial está en conflicto
//                 let serialDuplicado = null;

//                 for (const pedidoItem of pedidoExistente.items) {
//                     if (pedidoItem.id.toString() === id.toString()) {
//                         serialDuplicado = pedidoItem.serial.find(s => serial.includes(s));
//                         if (serialDuplicado) break; // Si encontramos un duplicado, salimos del loop
//                     }
//                 }

//                 nuevoMovimiento.tipoAccion = "Ingresar duplicado",
//                     nuevoMovimiento.detalles = `Alguno de estos seriales "${serialDuplicado || serial}" ya está registrado en el pedido con ID "${pedidoExistente.idPedido}".`

//                 await nuevoMovimiento.save();
//                 return res.status(400).json({
//                     message: `Alguno de estos seriales "${serialDuplicado || serial}" ya está registrado en el pedido con ID "${pedidoExistente.idPedido}".`,
//                     pedidoId: pedidoExistente.idPedido,
//                     serialDuplicado: serialDuplicado || serial, // Aseguramos que se muestre el serial correcto
//                 });
//             }
//         }



//         // for (const item of items) {
//         //     pedidoActual.items.serial = item.serial;
//         //     pedidoActual.items.quantitySur = item.quantitySur;
//         // }

//         pedidoActual.items = items.map(material => ({
//             id: material.id,  // Guardar el ID del material
//             serial: material.serial,         // Array vacío
//             quantityReq: 1,
//             quantitySur: material.quantitySur     // Array vacío
//         }));

//         // // Actualizar los ítems en el pedido actual
//         // pedidoActual.items = pedidoActual.items.map((item) => {
//         //     const itemToUpdate = items.find((i) => i.id.toString() === item.id.toString());
//         //     if (itemToUpdate) {
//         //         item.serial = itemToUpdate.serial;
//         //         item.quantityReq = itemToUpdate.quantityReq;
//         //     }
//         //     return item;
//         // });

//         // Actualizar otros datos del pedido
//         if (surtidorId) {
//             pedidoActual.surtidor = surtidorId;
//         }

//         pedidoActual.pStatus = pStatus;

//         // Guardar cambios en el pedido
//         await pedidoActual.save();

//         // Guardar el movimiento registrado
//         await nuevoMovimiento.save();

//         // Enviar respuesta de éxito
//         res.status(200).json({
//             status: "200",
//             message: "Pedido actualizado con éxito.",
//             body: pedidoActual,
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "500",
//             message: "Error en el servidor.",
//             error: error.message,
//         });
//     }
// };
// Metodo para actualizar pedido surtido
const updatePedido = async (req, res) => {
    const formatter = new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const hour = parts.find(p => p.type === "hour").value;
    const minutes = parts.find(p => p.type === "minute").value;

    const time = `${hour}:${minutes}`;

    try {
        const { idPedido } = req.params;
        const { items, surtidor, pStatus } = req.body.pedido;

        if (!idPedido || !items || !Array.isArray(items)) {
            return res.status(400).json({ message: "Datos inválidos." });
        }

        // Buscar el pedido actual
        const pedidoActual = await Pedido.findOne({ idPedido: idPedido });
        if (!pedidoActual) {
            return res.status(404).json({ message: "Pedido no encontrado." });
        }

        // Registrar el movimiento en la base de datos
        const nuevoMovimiento = new RegistroMovimientos({
            tipoAccion: "Surtir pedido",
            detalles: `Surtió el pedido con id: ${idPedido}.`,
        });

        // Buscar el surtidor
        let surtidorId = null;
        if (surtidor) {
            const foundUsers = await User.find({ username: surtidor });
            surtidorId = foundUsers.map((user) => user._id);
            nuevoMovimiento.usuario = surtidorId;
        }

        // Actualizar los ítems del pedido actual
        pedidoActual.items = items.map(material => ({
            id: material.id,                   // Mantener el ID original
            serial: material.serial,            // Actualizar los seriales
            quantityReq: material.quantityReq,  // Mantener el quantityReq original si es necesario
            quantitySur: material.quantitySur   // Actualizar cantidades surtidas
        }));

        // Actualizar otros datos del pedido
        if (surtidorId) {
            pedidoActual.surtidor = surtidorId;
        }

        pedidoActual.surTime = time;
        pedidoActual.pStatus = pStatus;

        // Guardar cambios en el pedido
        await pedidoActual.save();

        // Guardar el movimiento registrado
        await nuevoMovimiento.save();

        // Enviar respuesta de éxito
        res.status(200).json({
            status: "200",
            message: "Pedido actualizado con éxito.",
            body: pedidoActual,
        });
    } catch (error) {
        res.status(500).json({
            status: "500",
            message: "Error en el servidor.",
            error: error.message,
        });
    }
};


module.exports = {
    createItems,
    getAllItems,
    createPedido,
    getAllPedidos,
    updatePedido
}