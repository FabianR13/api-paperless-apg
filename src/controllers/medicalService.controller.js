const Company = require("../models/Company");
const User = require("../models/User");
const EHSProducto = require("../models/EHSProducto");
const EHSMovimiento = require("../models/EHSMovimiento");
const ConsultaMedica = require("../models/ConsultaMedica");
const Employees = require("../models/Employees.js");
const ExpedienteMedico = require("../models/ExpedienteMedico");
const CronicoDegenerativo = require("../models/CronicoDegenerativo");
const SeguimientoMedicoGeneral = require("../models/SeguimientoMedicoGeneral");
const PersonalLactante = require("../models/PersonalLactante");
const ControlPrenatal = require("../models/ControlPrenatal");

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
      externalMedicationPrescribed,
      bloodPressure,                // <-- Nuevos
      temperature,                  // <-- Signos
      heartRate,                    // <-- Vitales
      weight,
      diagnosis,
      medicalIndications,
      insumos = []
    } = req.body;

    if (!employeeId) {
      return res.status(400).json({ status: "error", message: "Falta el empleado atendido" });
    }

    const totalConsultas = await ConsultaMedica.countDocuments({ company: CompanyId });
    const folio = `ATT-${1001 + totalConsultas}`;

    // Creación de la consulta en memoria
    const consulta = new ConsultaMedica({
      company: CompanyId,
      folio,
      employeeId,
      consultationDate: consultationDate || new Date(),
      shift,
      administeredBy,
      attentionType,
      symptoms,
      physicalExam,
      medicalHistory,
      externalMedicationPrescribed,
      bloodPressure,
      temperature,
      heartRate,
      weight,
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
        descontado: !producto.noDescontar,
        indication: item.indication || "",

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

// ---------- OBTENER TODAS LAS CONSULTAS (Bitácora General) ----------
const getConsultas = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const { startDate, endDate, employeeId, attentionType } = req.query;

    const filter = { company: CompanyId };

    if (employeeId) filter.employeeId = employeeId;
    if (attentionType && attentionType !== "ALL") filter.attentionType = attentionType;

    if (startDate || endDate) {
      filter.consultationDate = {};
      if (startDate) filter.consultationDate.$gte = new Date(startDate);
      if (endDate) filter.consultationDate.$lte = new Date(endDate);
    }

    const consultas = await ConsultaMedica.find(filter)
      .sort({ consultationDate: -1 })
      .populate({
        path: "employeeId",
        select: "name lastName numberEmployee department",
        populate: { path: "department", select: "name" }
      })
      .populate("createdBy", "name email");

    // DESACTIVAR CACHÉ HTTP PARA EVITAR EL 304 NOT MODIFIED
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.status(200).json({ status: "success", data: consultas });
  } catch (error) {
    console.error("Error en getConsultas:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- OBTENER EXPEDIENTE DE UN EMPLEADO ----------
const getExpediente = async (req, res) => {
  try {
    const { CompanyId, employeeId } = req.params;
    const expediente = await ExpedienteMedico.findOne({ company: CompanyId, employeeId });
    res.status(200).json({ status: "success", data: expediente || null });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- CREAR O ACTUALIZAR EXPEDIENTE ---------
const guardarExpediente = async (req, res) => {
  try {
    const { CompanyId, employeeId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    // Pasamos req.body completo para que Mongoose guarde todos los campos válidos del Schema
    const expediente = await ExpedienteMedico.findOneAndUpdate(
      { company: CompanyId, employeeId },
      {
        ...req.body,
        company: CompanyId,
        employeeId,
        updatedBy: user._id
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ status: "success", data: expediente });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- CREAR REGISTRO DE SEGUIMIENTO CRÓNICO ----------
const crearCronicoDegenerativo = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const {
      employeeId, diseaseType, diagnosisDate, lastCheckupDate,
      treatingPhysician, nextCheckupDate, currentTreatment, restrictions, notes
    } = req.body;

    if (!employeeId) {
      return res.status(400).json({ status: "error", message: "Falta el colaborador" });
    }

    const registro = await CronicoDegenerativo.create({
      company: CompanyId,
      employeeId,
      diseaseType,
      diagnosisDate,
      lastCheckupDate,
      treatingPhysician,
      nextCheckupDate,
      currentTreatment,
      restrictions,
      notes,
      createdBy: user._id,
    });

    res.status(201).json({ status: "success", data: registro });
  } catch (error) {
    console.error("Error en crearCronicoDegenerativo:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- OBTENER REGISTROS (tabla "Registro de seguimiento") ----------
const getCronicoDegenerativo = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const registros = await CronicoDegenerativo.find({ company: CompanyId })
      .sort({ createdAt: -1 })
      .populate({
        path: "employeeId",
        select: "name lastName numberEmployee department",
        populate: { path: "department", select: "name" }
      });

    res.status(200).json({ status: "success", data: registros });
  } catch (error) {
    console.error("Error en getCronicoDegenerativo:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- DETECTADOS AUTOMÁTICAMENTE (desde Expediente) ----------
const getDetectadosCronicos = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const detectados = await ExpedienteMedico.find({
      company: CompanyId,
      hasChronicDisease: "Sí",
    })
      .select("employeeId chronicDiseases")
      .populate({
        path: "employeeId",
        select: "name lastName numberEmployee department",
        populate: { path: "department", select: "name" }
      });

    res.status(200).json({ status: "success", data: detectados });
  } catch (error) {
    console.error("Error en getDetectadosCronicos:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- SEGUIMIENTO MÉDICO GENERAL ----------
const crearSeguimientoGeneral = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const { employeeId, reason, absenceStartDate, returnDate, nextCheckupDate, restrictions, notes } = req.body;
    if (!employeeId) return res.status(400).json({ status: "error", message: "Falta el colaborador" });

    const registro = await SeguimientoMedicoGeneral.create({
      company: CompanyId, employeeId, reason, absenceStartDate, returnDate,
      nextCheckupDate, restrictions, notes, createdBy: user._id,
    });

    res.status(201).json({ status: "success", data: registro });
  } catch (error) {
    console.error("Error en crearSeguimientoGeneral:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getSeguimientoGeneral = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const registros = await SeguimientoMedicoGeneral.find({ company: CompanyId })
      .sort({ createdAt: -1 })
      .populate({ path: "employeeId", select: "name lastName numberEmployee department", populate: { path: "department", select: "name" } });
    res.status(200).json({ status: "success", data: registros });
  } catch (error) {
    console.error("Error en getSeguimientoGeneral:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Detectados: consultas con attentionType = Seguimiento médico (reincorporación...)
const getDetectadosSeguimiento = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const detectados = await ConsultaMedica.find({
      company: CompanyId,
      attentionType: "Seguimiento médico (reincorporación laboral tras incapacidad o ausencia)",
    })
      .select("employeeId consultationDate diagnosis")
      .sort({ consultationDate: -1 })
      .populate({ path: "employeeId", select: "name lastName numberEmployee department", populate: { path: "department", select: "name" } });
    res.status(200).json({ status: "success", data: detectados });
  } catch (error) {
    console.error("Error en getDetectadosSeguimiento:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- PERSONAL LACTANTE ----------
const crearLactante = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const { employeeId, startDate, estimatedEndDate, notes } = req.body;
    if (!employeeId) return res.status(400).json({ status: "error", message: "Falta el colaborador" });

    const registro = await PersonalLactante.create({
      company: CompanyId, employeeId, startDate, estimatedEndDate, notes, createdBy: user._id,
    });

    res.status(201).json({ status: "success", data: registro });
  } catch (error) {
    console.error("Error en crearLactante:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getLactantes = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const registros = await PersonalLactante.find({ company: CompanyId })
      .sort({ createdAt: -1 })
      .populate({ path: "employeeId", select: "name lastName numberEmployee department", populate: { path: "department", select: "name" } });
    res.status(200).json({ status: "success", data: registros });
  } catch (error) {
    console.error("Error en getLactantes:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- CONTROL PRENATAL ----------
const crearPrenatal = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const { employeeId, dueDate, gestationWeeks, estimatedLeaveDate, nextAppointmentDate, notes } = req.body;
    if (!employeeId) return res.status(400).json({ status: "error", message: "Falta el colaborador" });

    const registro = await ControlPrenatal.create({
      company: CompanyId, employeeId, dueDate, gestationWeeks, estimatedLeaveDate,
      nextAppointmentDate, notes, createdBy: user._id,
    });

    res.status(201).json({ status: "success", data: registro });
  } catch (error) {
    console.error("Error en crearPrenatal:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getPrenatales = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const registros = await ControlPrenatal.find({ company: CompanyId })
      .sort({ createdAt: -1 })
      .populate({ path: "employeeId", select: "name lastName numberEmployee department", populate: { path: "department", select: "name" } });
    res.status(200).json({ status: "success", data: registros });
  } catch (error) {
    console.error("Error en getPrenatales:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  crearConsulta, getConsultas, getExpediente, guardarExpediente,
  crearCronicoDegenerativo, getCronicoDegenerativo, getDetectadosCronicos,
  crearSeguimientoGeneral, getSeguimientoGeneral, getDetectadosSeguimiento,
  crearLactante, getLactantes,
  crearPrenatal, getPrenatales,
};