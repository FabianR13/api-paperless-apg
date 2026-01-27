const Items = require("../../models/Logistics/Items.js")
const Company = require("../../models/Company.js")
const Pedido = require("../../models/Logistics/Pedidos.js")
const Devolucion = require("../../models/Logistics/Devoluciones.js")
const User = require("../../models/User.js")
const RegistroMovimientos = require("../../models/Logistics/RegistroMovimiento.js")

//Crear nuevos Items//////////////////////////////////////////////////////////////////////////////////////////////////// 
const createItems = async (req, res) => {
    const { materials, user } = req.body; // 'materials' es el array que proporcionaste
    const { CompanyId } = req.params;
    let companyObjectId = null; // Usaremos null o el ObjectId directamente

    if (CompanyId) {
        try {
            const foundCompany = await Company.findById(CompanyId);
            if (foundCompany) {
                companyObjectId = foundCompany._id;
            } else {
                return res.status(404).json({ message: "Compañía no encontrada con el ID proporcionado" });
            }
        } catch (error) {
            console.error("Error al buscar compañía:", error);
            return res.status(500).json({ message: "Error al buscar la compañía" });
        }
    }

    // Verificar que materials es un array válido
    if (!Array.isArray(materials)) {
        return res.status(400).json({ message: "Datos inválidos, se esperaba un array de materiales" });
    }

    // Registrar el movimiento en la base de datos
    const nuevoMovimiento = new RegistroMovimientos({
        tipoAccion: "Modificar Items",
        detalles: `Actualizo la informacion de los Items con excel de PRISM.`
    });

    // Buscar ID del usuario en la base de datos
    if (user) { // 'user' probablemente sea el username
        try {
            const foundUser = await User.findOne({ username: user }); // findOne si esperas un solo usuario
            if (foundUser) {
                nuevoMovimiento.usuario = foundUser._id;
            } else {
                console.warn(`Usuario "${user}" no encontrado para el registro de movimiento.`);
                // Decide si esto es un error o si el movimiento puede guardarse sin usuario.
            }
        } catch (error) {
            console.error("Error al buscar usuario:", error);
            // Considera cómo manejar este error.
        }
    }

    try {
        // Iterar directamente sobre el array de materiales, ya que cada elemento es un material
        for (const material of materials) {
            // Validar que el objeto material tenga las propiedades necesarias (ej. name, qty)
            if (!material || typeof material.name !== 'string' || typeof material.qty !== 'number') {
                console.warn('Item de material inválido o incompleto, omitiendo:', material);
                continue; // Saltar al siguiente material
            }

            const existingMaterial = await Items.findOne({ name: material.name, company: companyObjectId }); // Opcional: buscar también por compañía si es relevante

            if (existingMaterial) {
                // Si el material existe, actualizamos la cantidad
                existingMaterial.qty = (existingMaterial.qty || 0) + material.qty; // Manejo de qty undefined o null
                // También puedes querer actualizar otros campos si vienen en 'material'
                existingMaterial.image = material.image || existingMaterial.image;
                existingMaterial.vendorItemNo = material.vendorItemNo || existingMaterial.vendorItemNo;
                existingMaterial.description = material.description || existingMaterial.description;
                existingMaterial.class = material.class || existingMaterial.class;
                existingMaterial.uom = material.uom || existingMaterial.uom;
                if (material.itemGroup) { // Solo actualizar si se proporciona
                    existingMaterial.itemGroup.valor = material.itemGroup;
                    // existingMaterial.itemGroup.descripcion = "Actualizado"; // O alguna lógica para la descripción
                }
                // No actualices selectedBy aquí a menos que sea intencional desde esta carga masiva

                await existingMaterial.save();
            } else {
                // Si el material no existe, lo creamos
                const newMaterialData = {
                    ...material, // Copia todas las propiedades del material de entrada
                    qty: material.qty || 0, // Asegurar que qty tenga un valor numérico
                    itemGroup: {
                        valor: material.itemGroup || "Desconocido", // Valor predeterminado si no viene
                        descripcion: "Desconocido" // Descripción predeterminada
                    },
                    selectedBy: [], // Inicializar como vacío por defecto si no viene
                };
                if (companyObjectId) {
                    newMaterialData.company = companyObjectId;
                }

                const newMaterialInstance = new Items(newMaterialData);
                await newMaterialInstance.save();
            }
        }

        await nuevoMovimiento.save();
        res.status(200).json({ status: "200", message: 'Materiales procesados correctamente' });
    } catch (error) {
        console.error('Error al procesar materiales:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar materiales', details: error.message });
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
// const createPedido = async (req, res) => {
//     const formatter = new Intl.DateTimeFormat("es-MX", {
//         timeZone: "America/Mexico_City",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//     });

//     const parts = formatter.formatToParts(new Date());
//     const hour = parts.find(p => p.type === "hour").value;
//     const minutes = parts.find(p => p.type === "minute").value;

//     const time = `${hour}:${minutes}`;

//     try {
//         const { usuario, maquina, materiales } = req.body.pedidos;

//         Validaciones básicas
//         if (!usuario || !maquina || !materiales || materiales.length === 0) {
//             return res.status(400).json({ status: "error", message: "Datos incompletos" });
//         }

//         Crear nuevo pedido
//         const nuevoPedido = new Pedido({
//             idPedido,
//             maquina,
//             pStatus: "pending",
//             surtidor: null,
//             creationTime: time,
//         });

//         Crear nuevo registro de movimientos
//         const nuevoMovimiento = new RegistroMovimientos({
//             tipoAccion: "Crear pedido",
//             detalles: `Creó el pedido con id: ${idPedido}.`,
//         });

//         Buscar usuario en la base de datos
//         if (usuario) {
//             const foundUsers = await User.find({ username: usuario });
//             if (foundUsers.length === 0) {
//                 return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
//             }
//             nuevoPedido.usuario = foundUsers.map(u => u._id);
//             nuevoMovimiento.usuario = foundUsers.map(u => u._id);
//         }

//         Buscar materiales por nombre
//         if (materiales.length > 0) {
//             const names = materiales.map(mat => mat.name);
//             const foundMaterials = await Items.find({ name: { $in: names } });

//             if (!foundMaterials || foundMaterials.length === 0) {
//                 return res.status(404).json({ status: "error", message: "No se encontraron materiales en la base de datos" });
//             }

//             Mapear correctamente los materiales con su ID y cantidad requerida
//             nuevoPedido.items = materiales.map(mat => {
//                 const materialDB = foundMaterials.find(m => m.name === mat.name);
//                 if (materialDB) {
//                     return {
//                         id: materialDB._id,
//                         serial: [],
//                         quantityReq: mat.quantityReq || 1,
//                         quantitySur: [],
//                         comment: mat.comment
//                     };
//                 }
//             }).filter(Boolean); // filtrar nulos
//         }

//         Guardar pedido y movimiento
//         await nuevoPedido.save();
//         await nuevoMovimiento.save();

//         res.status(200).json({ status: "success", message: "Pedido guardado exitosamente", pedido: nuevoPedido });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: "error", message: "Error al guardar el pedido", error: error.message });
//     }
// };

const createPedido = async (req, res) => {
    // --- 1. CONFIGURACIÓN DE FECHA Y HORA EN ZONA HORARIA ---
    const options = {
        timeZone: "America/Mexico_City",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };
    // Obtener la fecha y hora actual en la zona horaria de México
    const dateMX = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));

    const year = dateMX.getFullYear();
    const month = String(dateMX.getMonth() + 1).padStart(2, '0');
    const day = String(dateMX.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`; // Fecha actual para el ID

    const hourMX = dateMX.getHours();
    const minutesMX = dateMX.getMinutes();
    const time = `${String(hourMX).padStart(2, '0')}:${String(minutesMX).padStart(2, '0')}`;
    // -----------------------------------------------------------

    // --- 2. DETERMINAR TURNO ACTUAL (D, A, N) ---
    let turno;
    // D: 7:00 a 12:59 hrs
    if (hourMX >= 7 && hourMX < 15) {
        turno = 'D';
    }
    // A: 13:00 a 22:59 hrs
    else if (hourMX >= 15 && hourMX < 23) {
        turno = 'A';
    }
    // N: 23:00 a 06:59 hrs
    else {
        turno = 'N';
    }
    // -----------------------------------------------------------

    // --- 3. ENCONTRAR ÚLTIMO PEDIDO Y CALCULAR CONSECUTIVO ---

    // 1. Generamos el prefijo actual con la fecha de HOY
    const idPedidoPrefix = `PED-${newDate}-${turno}`;

    // 2. Buscar el último pedido creado
    const lastPedido = await Pedido.findOne().sort({ createdAt: -1 });

    let consecutivo = 1;

    if (lastPedido && lastPedido.idPedido) {
        const lastId = lastPedido.idPedido;

        // --- EXPRESIÓN REGULAR MEJORADA ---
        // (?:-\d+)? permite ignorar el "-1" si existe, capturando el número base en el grupo 2.
        // Ejemplo: Si lastId es "PED-...-N001-1", captura "N" y "001".
        const idMatch = lastId.match(/PED-\d{4}-\d{2}-\d{2}-([DAN])(\d+)(?:-\d+)?$/);

        if (idMatch && idMatch.length >= 3) {
            const lastTurno = idMatch[1]; // La letra del turno anterior (ej: 'N')
            const lastNumber = parseInt(idMatch[2], 10); // El número base (ej: 1)

            if (lastTurno === turno) {
                // Si seguimos en el mismo turno, sumamos.
                consecutivo = lastNumber + 1;
            }
            // Si el turno es diferente, consecutivo se queda en 1 (reinicio).
        }
    }

    const paddedConsecutivo = String(consecutivo).padStart(3, '0');
    let idPedido = `${idPedidoPrefix}${paddedConsecutivo}`; // Usamos 'let' para modificarlo si es necesario

    // --- VALIDACIÓN DE DUPLICADOS (SOLO TURNO N) ---
    if (turno === 'N') {
        // Verificamos si este ID base ya existe (conflicto madrugada vs noche)
        const existe = await Pedido.findOne({ idPedido: idPedido });

        if (existe) {
            // Si existe, simplemente agregamos "-1" para diferenciarlo.
            // No buscamos -2, -3, etc. Siempre será -1 como indicador de duplicado de turno.
            idPedido = `${idPedido}-1`;
        }
    }
    // -----------------------------------------------------------

    try {
        const { usuario, maquina, materiales } = req.body.pedidos;

        // Validaciones básicas
        if (!usuario || !maquina || !materiales || materiales.length === 0) {
            return res.status(400).json({ status: "error", message: "Datos incompletos" });
        }

        // Crear nuevo pedido
        const nuevoPedido = new Pedido({
            idPedido: idPedido,
            maquina,
            pStatus: "pending",
            surtidor: null,
            creationTime: time,
        });

        // Buscar usuario en la base de datos
        if (usuario) {
            const foundUsers = await User.find({ username: usuario });
            if (foundUsers.length === 0) {
                return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
            }
            nuevoPedido.usuario = foundUsers.map(u => u._id);
        }

        // Buscar materiales por nombre
        if (materiales.length > 0) {
            const names = materiales.map(mat => mat.name);
            const foundMaterials = await Items.find({ name: { $in: names } });

            if (!foundMaterials || foundMaterials.length === 0) {
                return res.status(404).json({ status: "error", message: "No se encontraron materiales en la base de datos" });
            }

            // Mapear correctamente los materiales
            nuevoPedido.items = materiales.map(mat => {
                const materialDB = foundMaterials.find(m => m.name === mat.name);
                if (materialDB) {
                    return {
                        id: materialDB._id,
                        serial: [],
                        quantityReq: mat.quantityReq || 1,
                        quantitySur: [],
                        comment: mat.comment
                    };
                }
            }).filter(Boolean);
        }

        // Guardar pedido
        await nuevoPedido.save();

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
    }).sort({ createdAt: 1 })
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
            populate: { path: "id", select: "name description vendorItemNo" }
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
            quantitySur: material.quantitySur, // Actualizar cantidades surtidas
            comment: material.comment
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

const getRecentPedidos = async (req, res) => {
    const { CompanyId } = req.params;

    // Valida la longitud del CompanyId (asumiendo que es un ObjectId de MongoDB)
    if (CompanyId.length !== 24) {
        // Es mejor enviar una respuesta en lugar de solo retornar
        return res.status(400).json({ status: "400", message: "Formato de CompanyId inválido." });
    }

    try {
        // Primero, verificamos si la compañía existe.
        // Si CompanyId es siempre un único ID, findOne es más apropiado.
        // El uso de $in con un solo valor funciona, pero findOne({_id: CompanyId}) es más directo.
        const company = await Company.findOne({ _id: CompanyId });

        if (!company) {
            // Si la compañía no existe, envía una respuesta apropiada.
            return res.status(404).json({ status: "404", message: "Compañía no encontrada." });
        }

        // Calcula la fecha y hora de hace 24 horas desde el momento actual.
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        // Busca los pedidos
        const pedidos = await Pedido.find({
            company: CompanyId, // Asumo que 'company' en Pedido es el ObjectId de la compañía.
            // Si CompanyId pudiera ser un array, { $in: CompanyId } sería correcto.
            createdAt: { $gte: twentyFourHoursAgo } // Filtra los pedidos creados desde hace 24 horas hasta ahora.
        })
            .sort({ createdAt: -1 }) // Ordena los más recientes primero
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

        res.json({ status: "200", message: "Pedidos cargados", body: pedidos });

    } catch (error) {
        // Manejo de errores generales (e.g., problemas de conexión con la BD)
        console.error("Error al obtener pedidos:", error);
        res.status(500).json({ status: "500", message: "Error interno del servidor al cargar los pedidos." });
    }
};

// Metodo para actualizar pedido cancelado
const cancelPedido = async (req, res) => {
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
        const { surtidor, pStatus, cancelReason } = req.body.pedido;

        // Buscar el pedido actual
        const pedidoActual = await Pedido.findOne({ idPedido: idPedido });
        if (!pedidoActual) {
            return res.status(404).json({ message: "Pedido no encontrado." });
        }

        // Registrar el movimiento en la base de datos
        const nuevoMovimiento = new RegistroMovimientos({
            tipoAccion: "Cancelar pedido",
            detalles: `Cancelo el pedido con id: ${idPedido}.`,
        });

        // Buscar el surtidor
        let surtidorId = null;
        if (surtidor) {
            const foundUsers = await User.find({ username: surtidor });
            surtidorId = foundUsers.map((user) => user._id);

        }

        // Actualizar otros datos del pedido
        if (surtidorId) {
            pedidoActual.surtidor = surtidorId;
            nuevoMovimiento.usuario = surtidorId;
        }

        pedidoActual.surTime = time;
        pedidoActual.pStatus = pStatus;
        pedidoActual.cancelReason = cancelReason

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

// Metodo para actualizar pedido cancelado
const confirmPedido = async (req, res) => {
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
        const { confirmed, pStatus } = req.body.pedido;

        // Buscar el pedido actual
        const pedidoActual = await Pedido.findOne({ idPedido: idPedido });
        if (!pedidoActual) {
            return res.status(404).json({ message: "Pedido no encontrado." });
        }

        // Registrar el movimiento en la base de datos
        const nuevoMovimiento = new RegistroMovimientos({
            tipoAccion: "Cancelar pedido",
            detalles: `Confirmo el pedido con id: ${idPedido}.`,
        });

        // Buscar el surtidor
        let confirmedId = null;
        if (confirmed) {
            const foundUsers = await User.find({ username: confirmed });
            confirmedId = foundUsers.map((user) => user._id);

        }

        // Actualizar otros datos del pedido
        if (confirmedId) {
            pedidoActual.confirmed = confirmedId;
            nuevoMovimiento.usuario = confirmedId;
        }

        pedidoActual.confirmTime = time;
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

// ==========================================
const createDevolucion = async (req, res) => {
    // 1. Configuración de Fecha/Hora (Igual que antes)
    const options = { timeZone: "America/Mexico_City", hour: "2-digit", minute: "2-digit", hour12: false };
    const dateMX = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));

    const year = dateMX.getFullYear();
    const month = String(dateMX.getMonth() + 1).padStart(2, '0');
    const day = String(dateMX.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`;

    const hourMX = dateMX.getHours();
    const minutesMX = dateMX.getMinutes();
    const time = `${String(hourMX).padStart(2, '0')}:${String(minutesMX).padStart(2, '0')}`;

    // 2. Determinar Turno
    let turno;
    if (hourMX >= 7 && hourMX < 15) turno = 'D';
    else if (hourMX >= 15 && hourMX < 23) turno = 'A';
    else turno = 'N';

    // 3. Generar ID Único para Devolución
    const idPrefix = `DEV-${newDate}-${turno}`;

    // --- CAMBIO: Buscamos en el modelo Devolucion, no en Pedido ---
    const lastDevolucion = await Devolucion.findOne({
        idDevolucion: { $regex: new RegExp(`^${idPrefix}`) }
    }).sort({ createdAt: -1 });

    let consecutivo = 1;

    if (lastDevolucion && lastDevolucion.idDevolucion) {
        // Extraemos el último número. Ej: DEV-2026-01-09-D005 -> 005
        const parts = lastDevolucion.idDevolucion.split(turno); // Separar por la letra del turno
        if (parts.length > 1) {
            // parts[1] sería "005" o "005-1"
            const numberPart = parts[parts.length - 1].split('-')[0]; // Tomar solo el numero antes del guion si existe
            consecutivo = parseInt(numberPart, 10) + 1;
        }
    }

    const paddedConsecutivo = String(consecutivo).padStart(3, '0');
    let idDevolucion = `${idPrefix}${paddedConsecutivo}`;

    // Validación duplicados turno N (lógica de seguridad)
    if (turno === 'N') {
        const existe = await Devolucion.findOne({ idDevolucion: idDevolucion });
        if (existe) {
            idDevolucion = `${idDevolucion}-1`;
        }
    }

    try {
        const { usuario, items } = req.body.devolucion;
        const { CompanyId } = req.params; // Necesitamos el ID de la empresa

        if (!usuario || !items || items.length === 0) {
            return res.status(400).json({ status: "error", message: "Datos incompletos" });
        }

        // Buscar usuario
        const foundUser = await User.findOne({ username: usuario });
        if (!foundUser) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }

        // Buscar Materiales para obtener sus ObjectIds
        const names = items.map(mat => mat.name);
        const foundMaterials = await Items.find({ name: { $in: names } });

        // Mapear items al esquema del modelo Devolucion
        const mappedItems = items.map(itemInput => {
            const materialDB = foundMaterials.find(m => m.name === itemInput.name);
            if (materialDB) {
                // Calcular total sumando el array de cantidades individuales
                const total = itemInput.quantities.reduce((a, b) => a + Number(b), 0);

                return {
                    id: materialDB._id,
                    serial: itemInput.serials,      // Array de strings
                    quantities: itemInput.quantities, // Array de números
                    totalQuantity: total,
                    comment: "Devolución generada"
                };
            }
        }).filter(Boolean);

        // --- CAMBIO: Instanciar nuevo modelo Devolucion ---
        const nuevaDevolucion = new Devolucion({
            idDevolucion: idDevolucion,
            usuario: foundUser._id,
            company: CompanyId,
            items: mappedItems,
            dStatus: 'started',
            creationTime: time
        });

        await nuevaDevolucion.save();

        res.status(200).json({
            status: "200",
            message: "Devolución guardada exitosamente",
            body: nuevaDevolucion
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al guardar devolución", error: error.message });
    }
};

// ==========================================
const getDevoluciones = async (req, res) => {
    const { CompanyId } = req.params;

    if (!CompanyId || CompanyId.length !== 24) {
        return res.status(400).json({ status: "error", message: "ID inválido" });
    }

    try {
        // --- CAMBIO: Consulta directa a Devolucion, sin regex de ID ---
        const devoluciones = await Devolucion.find({ company: CompanyId })
            .sort({ createdAt: -1 }) // Más recientes primero
            .limit(100)
            .populate({
                path: "usuario",
                select: "employee",
                populate: { path: "employee", select: "name lastName" }
            })
            .populate({
                path: "confirmedBy",
                select: "employee",
                populate: { path: "employee", select: "name lastName" }
            })
            .populate({
                path: "rejectedBy",
                select: "employee",
                populate: { path: "employee", select: "name lastName" }
            })
            .populate({
                path: "validatedBy",
                select: "employee",
                populate: { path: "employee", select: "name lastName" }
            })
            .populate({
                path: "items.id", // Nota: en el esquema items -> id es la ref
                select: "name description vendorItemNo"
            });

        // Nota: Mapeamos un poco la respuesta si quieres que el frontend reciba 
        // exactamente la misma estructura de nombres que en 'Pedido' 
        // (ej. item.id.name), el populate ya lo hace.

        res.json({ status: "200", message: "Devoluciones Loaded", body: devoluciones });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al obtener devoluciones" });
    }
};

// ==========================================
const updateDevolucionStatus = async (req, res) => {
    const { idDevolucion } = req.params;
    const { status, usuario, reason } = req.body; // status: 'confirmed', 'validated', 'rejected'

    // Configuración de hora
    const dateMX = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
    const hourMX = dateMX.getHours();
    const minutesMX = dateMX.getMinutes();
    const time = `${String(hourMX).padStart(2, '0')}:${String(minutesMX).padStart(2, '0')}`;

    try {
        const devolucion = await Devolucion.findOne({ idDevolucion });
        if (!devolucion) return res.status(404).json({ status: "error", message: "Devolución no encontrada" });

        // Buscar ID del usuario que ejecuta la acción
        const actionUser = await User.findOne({ username: usuario });
        if (!actionUser) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

        // Lógica de transición de estados
        switch (status) {
            case 'confirmed':
                // Solo se puede confirmar si está 'started' o 'rejected'
                if (devolucion.dStatus !== 'started' && devolucion.dStatus !== 'rejected') {
                    return res.status(400).json({ status: "error", message: "No se puede confirmar en el estado actual." });
                }
                devolucion.dStatus = 'confirmed';
                devolucion.confirmedBy = actionUser._id;
                // Si venía de rechazo, limpiamos el motivo anterior para indicar que se corrigió
                if (devolucion.dStatus === 'rejected') {
                    // Opcional: Podrías mantener el historial, pero aquí limpiamos para "nueva confirmación"
                    // devolucion.rejectionReason = null; 
                }
                break;

            case 'validated':
                if (devolucion.dStatus !== 'confirmed') {
                    return res.status(400).json({ status: "error", message: "Solo se pueden validar devoluciones confirmadas." });
                }
                devolucion.dStatus = 'validated';
                devolucion.validatedBy = actionUser._id;
                devolucion.actionTime = time;
                break;

            case 'rejected':
                if (devolucion.dStatus !== 'confirmed') {
                    return res.status(400).json({ status: "error", message: "Solo se pueden rechazar devoluciones confirmadas." });
                }
                if (!reason) {
                    return res.status(400).json({ status: "error", message: "Se requiere un motivo para rechazar." });
                }
                devolucion.dStatus = 'rejected';
                devolucion.rejectedBy = actionUser._id;
                devolucion.rejectionReason = reason;
                devolucion.actionTime = time;
                break;

            default:
                return res.status(400).json({ status: "error", message: "Estatus inválido." });
        }

        await devolucion.save();

        res.status(200).json({
            status: "200",
            message: `Devolución actualizada a: ${status}`,
            body: devolucion
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error actualizando estatus", error: error.message });
    }
};

// ==========================================
const updateDevolucionContent = async (req, res) => {
    const { idDevolucion } = req.params;
    // Recibimos: usuario (quien edita) y items (la nueva lista corregida)
    const { usuario, items } = req.body; 

    try {
        const devolucion = await Devolucion.findOne({ idDevolucion });
        if (!devolucion) return res.status(404).json({ status: "error", message: "Devolución no encontrada" });

        // Solo permitir editar si está rechazada o iniciada (started)
        if (devolucion.dStatus !== 'rejected' && devolucion.dStatus !== 'started') {
            return res.status(400).json({ status: "error", message: "No se puede editar una devolución en este estado." });
        }

        // Buscar Materiales para obtener sus ObjectIds nuevamente (validación)
        const names = items.map(mat => mat.name);
        const foundMaterials = await Items.find({ name: { $in: names } });

        // Mapear items al esquema del modelo
        const mappedItems = items.map(itemInput => {
            const materialDB = foundMaterials.find(m => m.name === itemInput.name);
            if (materialDB) {
                const total = itemInput.quantities.reduce((a, b) => a + Number(b), 0);
                return {
                    id: materialDB._id,
                    serial: itemInput.serials,
                    quantities: itemInput.quantities,
                    totalQuantity: total,
                    comment: "Corregido por usuario"
                };
            }
        }).filter(Boolean);

        // Actualizar datos
        devolucion.items = mappedItems;
        // Opcional: Si quieres que al editar se pase automáticamente a 'started' o se quede en 'rejected'
        // Lo dejaremos igual para que el usuario tenga que dar clic en "Re-Confirmar" explícitamente, 
        // o podemos cambiarlo aquí. Por ahora solo actualizamos contenido.
        
        await devolucion.save();

        res.status(200).json({ 
            status: "200", 
            message: "Devolución corregida exitosamente", 
            body: devolucion 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al actualizar contenido", error: error.message });
    }
};

module.exports = {
    createItems,
    getAllItems,
    createPedido,
    getAllPedidos,
    updatePedido,
    getRecentPedidos,
    cancelPedido,
    confirmPedido,
    createDevolucion,
    getDevoluciones,
    updateDevolucionStatus,
    updateDevolucionContent
}