const User = require("../models/User");
const EHSUbicacion = require("../models/EHSUbicacion");
const EHSComponente = require("../models/EHSComponente");
const EHSProducto = require("../models/EHSProducto");
const EHSMovimiento = require("../models/EHSMovimiento");

// ---------- UBICACIONES ----------
const createUbicacion = async (req, res) => {
    try {
        const { nombre } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        const newUbicacion = new EHSUbicacion({ nombre, createdBy: user._id, modifiedBy: user._id });
        await newUbicacion.save();
        res.status(201).json({ status: "success", data: newUbicacion });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const getUbicaciones = async (req, res) => {
    try {
        const { all } = req.query;
        const filter = all === "true" ? {} : { status: "Activo" };
        const ubicaciones = await EHSUbicacion.find(filter).sort({ nombre: 1 });
        res.status(200).json({ status: "success", data: ubicaciones });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const updateUbicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        const updated = await EHSUbicacion.findByIdAndUpdate(id, { nombre, modifiedBy: user._id }, { new: true });
        if (!updated) return res.status(404).json({ status: "error", message: "Ubicación no encontrada" });
        res.status(200).json({ status: "success", data: updated });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const toggleUbicacionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        const ubicacion = await EHSUbicacion.findById(id);
        if (!ubicacion) return res.status(404).json({ status: "error", message: "Ubicación no encontrada" });

        ubicacion.status = ubicacion.status === "Activo" ? "Inactivo" : "Activo";
        ubicacion.modifiedBy = user._id;
        await ubicacion.save();
        res.status(200).json({ status: "success", data: ubicacion });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ---------- COMPONENTES ----------
const createComponente = async (req, res) => {
    try {
        const nombre = (req.body.nombre || "").trim().toUpperCase();
        if (!nombre) return res.status(400).json({ status: "error", message: "El nombre es obligatorio" });

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        const existente = await EHSComponente.findOne({ nombre });
        if (existente) return res.status(409).json({ status: "error", message: "Ese componente ya existe" });

        const newComponente = new EHSComponente({ nombre, createdBy: user._id, modifiedBy: user._id });
        await newComponente.save();
        res.status(201).json({ status: "success", data: newComponente });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const updateComponente = async (req, res) => {
    try {
        const { id } = req.params;
        const nombre = (req.body.nombre || "").trim().toUpperCase();
        if (!nombre) return res.status(400).json({ status: "error", message: "El nombre es obligatorio" });

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        const duplicado = await EHSComponente.findOne({ nombre, _id: { $ne: id } });
        if (duplicado) return res.status(409).json({ status: "error", message: "Ese componente ya existe" });

        const updated = await EHSComponente.findByIdAndUpdate(id, { nombre, modifiedBy: user._id }, { new: true });
        if (!updated) return res.status(404).json({ status: "error", message: "Componente no encontrado" });
        res.status(200).json({ status: "success", data: updated });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const getComponentes = async (req, res) => {
    try {
        const componentes = await EHSComponente.find().sort({ nombre: 1 });
        res.status(200).json({ status: "success", data: componentes });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const deleteComponente = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await EHSComponente.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ status: "error", message: "Componente no encontrado" });
        res.status(200).json({ status: "success", message: "Componente eliminado" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ---------- PRODUCTOS ----------
const createProducto = async (req, res) => {
    try {
        const {
            descripcion, componentes, funcionPrincipal, unidad, unidadesPorEnvase, tipoEnvase,
            categoria, viaAdministracion, noDescontar, foto, stockMinimo, existencias
        } = req.body;
        const descripcionNormalizada = (descripcion || "").trim().toUpperCase();
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        const newProducto = new EHSProducto({
            descripcion: descripcionNormalizada,
            componentes, // [{ componente, concentracion }]
            funcionPrincipal,
            unidad,
            unidadesPorEnvase,
            tipoEnvase,
            categoria,
            viaAdministracion,
            noDescontar,
            foto,
            stockMinimo,
            existencias,
            createdBy: user._id,
            modifiedBy: user._id
        });

        await newProducto.save();
        res.status(201).json({ status: "success", data: newProducto });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const getProductos = async (req, res) => {
    try {
        const { all } = req.query;
        const filter = all === "true" ? {} : { status: "Activo" };

        const productos = await EHSProducto.find(filter)
            .populate("componentes.componente", "nombre")
            .populate("existencias.ubicacion", "nombre")
            .sort({ descripcion: 1 });

        res.status(200).json({ status: "success", data: productos });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        const {
            descripcion, componentes, funcionPrincipal, unidad, unidadesPorEnvase, tipoEnvase,
            categoria, viaAdministracion, noDescontar, foto, stockMinimo
        } = req.body;
        // "existencias" no se toca aquí, se maneja con ingreso/transferencia aparte
        const descripcionNormalizada = (descripcion || "").trim().toUpperCase();
        const updated = await EHSProducto.findByIdAndUpdate(
            id,
            {
                descripcion: descripcionNormalizada, componentes, funcionPrincipal, unidad, unidadesPorEnvase, tipoEnvase,
                categoria, viaAdministracion, noDescontar, foto, stockMinimo,
                modifiedBy: user._id
            },
            { new: true }
        );

        if (!updated) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.status(200).json({ status: "success", data: updated });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

const toggleProductoStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        const producto = await EHSProducto.findById(id);
        if (!producto) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        producto.status = producto.status === "Activo" ? "Inactivo" : "Activo";
        producto.modifiedBy = user._id;
        await producto.save();
        res.status(200).json({ status: "success", data: producto });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ---------- INGRESO A INVENTARIO (nuevo lote a una o varias ubicaciones) ----------
const registrarIngreso = async (req, res) => {
    try {
        const { productoId, lote, fechaCaducidad, factura, distribuciones } = req.body;

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        if (!Array.isArray(distribuciones) || distribuciones.length === 0) {
            return res.status(400).json({ status: "error", message: "Debes indicar al menos una distribución" });
        }

        const producto = await EHSProducto.findById(productoId);
        if (!producto) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        const movimientos = [];

        distribuciones.forEach((dist) => {
            producto.existencias.push({
                ubicacion: dist.ubicacion,
                cantidad: Number(dist.cantidad),
                lote,
                fechaCaducidad,
                factura
            });

            movimientos.push({
                producto: producto._id,
                tipo: "Ingreso",
                lote,
                fechaCaducidad,
                cantidad: Number(dist.cantidad),
                ubicacionDestino: dist.ubicacion,
                factura,
                createdBy: user._id
            });
        });

        producto.modifiedBy = user._id;
        await producto.save();
        await EHSMovimiento.insertMany(movimientos);

        res.status(200).json({ status: "success", data: producto });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ---------- TRASPASO ENTRE UBICACIONES ----------
const registrarTraspaso = async (req, res) => {
    try {
        const { productoId, ubicacionOrigen, ubicacionDestino, lote, fechaCaducidad, cantidad } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        const cantidadMover = Number(cantidad);
        if (!cantidadMover || cantidadMover <= 0) {
            return res.status(400).json({ status: "error", message: "Cantidad inválida" });
        }

        const producto = await EHSProducto.findById(productoId);
        if (!producto) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        const caducidadKey = fechaCaducidad ? new Date(fechaCaducidad).toISOString() : null;

        const origen = producto.existencias.find(
            (ex) => ex.ubicacion.toString() === ubicacionOrigen &&
                ex.lote === lote &&
                (ex.fechaCaducidad ? ex.fechaCaducidad.toISOString() : null) === caducidadKey
        );

        if (!origen) return res.status(404).json({ status: "error", message: "Existencia de origen no encontrada" });
        if (origen.cantidad < cantidadMover) {
            return res.status(400).json({ status: "error", message: "No hay suficiente cantidad en esa ubicación" });
        }

        origen.cantidad -= cantidadMover;
        const origenFactura = origen.factura;

        if (origen.cantidad === 0) {
            producto.existencias.pull({ _id: origen._id });
        }

        const destinoExistente = producto.existencias.find(
            (ex) => ex.ubicacion.toString() === ubicacionDestino &&
                ex.lote === lote &&
                (ex.fechaCaducidad ? ex.fechaCaducidad.toISOString() : null) === caducidadKey
        );

        if (destinoExistente) {
            destinoExistente.cantidad += cantidadMover;
        } else {
            producto.existencias.push({
                ubicacion: ubicacionDestino,
                cantidad: cantidadMover,
                lote,
                fechaCaducidad,
                factura: origenFactura
            });
        }

        producto.modifiedBy = user._id;
        await producto.save();

        await EHSMovimiento.create({
            producto: producto._id,
            tipo: "Traspaso",
            lote,
            fechaCaducidad,
            cantidad: cantidadMover,
            ubicacionOrigen,
            ubicacionDestino,
            factura: origenFactura,
            createdBy: user._id
        });

        res.status(200).json({ status: "success", data: producto });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
const getMovimientos = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [movimientos, total] = await Promise.all([
            EHSMovimiento.find()
                .populate("producto", "descripcion")
                .populate("ubicacionOrigen", "nombre")
                .populate("ubicacionDestino", "nombre")
                .populate("createdBy", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            EHSMovimiento.countDocuments()
        ]);

        res.status(200).json({
            status: "success",
            data: movimientos,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                hasMore: skip + movimientos.length < total
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
module.exports = {
    createUbicacion, getUbicaciones, updateUbicacion, toggleUbicacionStatus,
    createComponente, getComponentes, updateComponente, deleteComponente,
    createProducto, getProductos, updateProducto, toggleProductoStatus,
    registrarIngreso, registrarTraspaso, getMovimientos
};