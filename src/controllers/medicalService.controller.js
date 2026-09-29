const Company = require("../models/Company");
const User = require("../models/User");
const EHSProducto = require("../models/EHSProducto");
const EHSMovimiento = require("../models/EHSMovimiento");
const ConsultaMedica = require("../models/ConsultaMedica");

// Convierte la cantidad capturada a la unidad base del producto
const aUnidadBase = (producto, quantity, uom) => {
  const qty = Number(quantity);
  if (uom && uom === producto.tipoEnvase && uom !== producto.unidad && producto.unidadesPorEnvase) {
    return qty * producto.unidadesPorEnvase;
  }
  return qty;
};

// Existencias disponibles en orden FEFO (primero la que caduca antes)
const existenciasDisponibles = (producto) => {
  const hoy = new Date();
  return [...producto.existencias]
    .filter((ex) => ex.cantidad > 0 && (!ex.fechaCaducidad || new Date(ex.fechaCaducidad) >= hoy))
    .sort((a, b) => {
      if (!a.fechaCaducidad && !b.fechaCaducidad) return 0;
      if (!a.fechaCaducidad) return 1;
      if (!b.fechaCaducidad) return -1;
      return new Date(a.fechaCaducidad) - new Date(b.fechaCaducidad);
    });
};

// ---------- CREAR CONSULTA (descuenta inventario EHS) ----------
const crearConsulta = async (req, res) => {
  try {
    const { CompanyId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "Error al buscar usuario" });
    }

    if (CompanyId) {
      const foundCompany = await Company.findById(CompanyId);
      if (!foundCompany) {
        return res.status(404).json({ status: "error", message: "Company not found" });
      }
    }

    const {
      employeeId,
      consultationDate,
      shift,
      administeredBy,
      attentionType,
      symptoms,
      physicalExam,
      medicalHistory,
      externalMedication,
      diagnosis,
      medicalIndications,
      insumos = []
    } = req.body;

    if (!employeeId) {
      return res.status(400).json({ status: "error", message: "Falta el empleado atendido" });
    }

    // Creación de la consulta en memoria
    const consulta = new ConsultaMedica({
      company: CompanyId,
      employeeId,
      consultationDate: consultationDate || new Date(),
      shift,
      administeredBy,
      attentionType,
      symptoms,
      physicalExam,
      medicalHistory,
      externalMedication,
      diagnosis,
      medicalIndications,
      insumos: [],
      createdBy: user._id
    });

    const productosCache = new Map();
    const tocados = new Set();
    const vaciar = [];
    const movimientos = [];

    // 1) VALIDACIÓN Y CÁLCULO EN MEMORIA
    for (const item of insumos) {
      const cantidad = Number(item.quantity);
      if (!cantidad || cantidad <= 0) {
        return res.status(400).json({ status: "error", message: "Cantidad inválida en un insumo" });
      }

      const key = String(item.productId);
      let producto = productosCache.get(key);
      if (!producto) {
        producto = await EHSProducto.findById(item.productId);
        if (!producto) {
          return res.status(404).json({ status: "error", message: `Producto no encontrado (ID: ${item.productId})` });
        }
        productosCache.set(key, producto);
      }

      const cantidadBase = aUnidadBase(producto, cantidad, item.uom);

      consulta.insumos.push({
        productId: producto._id,
        name: producto.descripcion,
        quantity: cantidad,
        uom: item.uom,
        quantityBase: cantidadBase,
        descontado: !producto.noDescontar
      });

      if (producto.noDescontar) continue;

      let pendiente = cantidadBase;
      for (const ex of existenciasDisponibles(producto)) {
        if (pendiente <= 0) break;
        const tomar = Math.min(ex.cantidad, pendiente);
        ex.cantidad -= tomar;
        pendiente -= tomar;

        movimientos.push({
          producto: producto._id,
          tipo: "Consumo médico",
          lote: ex.lote,
          fechaCaducidad: ex.fechaCaducidad,
          cantidad: tomar,
          ubicacionOrigen: ex.ubicacion,
          factura: ex.factura,
          consulta: consulta._id,
          createdBy: user._id
        });

        if (ex.cantidad === 0) vaciar.push({ producto, existenciaId: ex._id });
      }

      if (pendiente > 0) {
        return res.status(400).json({
          status: "error",
          message: `Stock insuficiente de "${producto.descripcion}" (faltan ${pendiente} ${producto.unidad})`
        });
      }
      tocados.add(key);
    }

    // 2) PERSISTENCIA EN BASE DE DATOS
    for (const { producto, existenciaId } of vaciar) {
      producto.existencias.pull({ _id: existenciaId });
    }
    for (const key of tocados) {
      const producto = productosCache.get(key);
      producto.modifiedBy = user._id;
      await producto.save();
    }
    if (movimientos.length) await EHSMovimiento.insertMany(movimientos);
    await consulta.save();

    res.status(201).json({ status: "201", message: "Consulta médica creada con éxito", body: consulta });
  } catch (error) {
    console.error("Error en crearConsulta:", error);
    res.status(500).json({ status: "500", message: "Internal Server Error", error: error.message });
  }
};

module.exports = { crearConsulta };