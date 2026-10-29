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
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const MEDICAL_DOCS_FOLDER = "Uploads/MedicalDocs/";

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
      administrationRoute,
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
      administrationRoute,
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
    await consulta.save(); // primero: si falla, el inventario no se toca

    for (const { producto, existenciaId } of vaciar) {
      producto.existencias.pull({ _id: existenciaId });
    }
    for (const key of tocados) {
      const producto = productosCache.get(key);
      producto.modifiedBy = user._id;
      await producto.save();
    }
    if (movimientos.length) await EHSMovimiento.insertMany(movimientos);

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

    if (startDate) filter.consultationDate.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      filter.consultationDate.$lte = end;
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

    const { documents, ...datos } = req.body; // los documentos solo se manejan con sus propios endpoints
    // 1. Guardar/Actualizar Expediente Médico
    const expediente = await ExpedienteMedico.findOneAndUpdate(
      { company: CompanyId, employeeId },
      {
        ...datos,
        company: CompanyId,
        employeeId,
        updatedBy: user._id
      },
      { new: true, upsert: true, runValidators: true }
    );

    // 2. SINCRONIZACIÓN AUTOMÁTICA CON POBLACIÓN VULNERABLE (Crónico Degenerativa)
    if (expediente.hasChronicDisease === "Sí" && expediente.chronicDiseases.length > 0) {
      await CronicoDegenerativo.findOneAndUpdate(
        { company: CompanyId, employeeId },
        {
          $addToSet: { diseaseType: { $each: expediente.chronicDiseases } }, // Agrega enfermedades sin duplicar
          currentTreatment: expediente.continuousMedication || "",           // Sincroniza tratamiento continuo
          createdBy: user._id
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ status: "success", data: expediente });
  } catch (error) {
    console.error("Error en guardarExpediente:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- OBTENER TODOS LOS EXPEDIENTES (para filtros como género) ----------
const getAllExpedientes = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const expedientes = await ExpedienteMedico.find({ company: CompanyId })
      .select("employeeId gender");
    res.status(200).json({ status: "success", data: expedientes });
  } catch (error) {
    console.error("Error en getAllExpedientes:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Deja el Expediente General igual a la lista de enfermedades del registro crónico
const syncEnfermedadesExpediente = async ({ company, employeeId, diseaseType, userId }) => {
  if (!Array.isArray(diseaseType)) return null;
  return ExpedienteMedico.findOneAndUpdate(
    { company: String(company), employeeId },
    {
      $set: {
        chronicDiseases: diseaseType,
        hasChronicDisease: diseaseType.length > 0 ? "Sí" : "No",
        updatedBy: userId,
      },
    },
    { new: true, upsert: true, runValidators: true }
  );
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

    await syncEnfermedadesExpediente({ company: CompanyId, employeeId, diseaseType, userId: user._id });

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

// ---------- CRÓNICO DEGENERATIVO: actualizar / eliminar ----------
const updateCronicoDegenerativo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const {
      diseaseType, diagnosisDate, lastCheckupDate,
      treatingPhysician, nextCheckupDate, currentTreatment, restrictions, notes
    } = req.body;

    const registro = await CronicoDegenerativo.findByIdAndUpdate(
      id,
      { diseaseType, diagnosisDate, lastCheckupDate, treatingPhysician, nextCheckupDate, currentTreatment, restrictions, notes },
      { new: true, runValidators: true }
    );

    if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });

    await syncEnfermedadesExpediente({
      company: registro.company,
      employeeId: registro.employeeId,
      diseaseType: registro.diseaseType,
      userId: user._id,
    });

    res.status(200).json({ status: "success", data: registro });
  } catch (error) {
    console.error("Error en updateCronicoDegenerativo:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const deleteCronicoDegenerativo = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await CronicoDegenerativo.findByIdAndDelete(id);
    if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });
    res.status(200).json({ status: "success", message: "Registro eliminado" });
  } catch (error) {
    console.error("Error en deleteCronicoDegenerativo:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- CRÓNICO: subir documentos ----------
const uploadCronicoDocs = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await CronicoDegenerativo.findById(id);
    if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });

    // Armamos la lista de documentos con la URL pública directa
    const nuevos = (req.files || []).map((f) => {
      const fileName = f.key.split("/").pop();
      return {
        fileName,
        originalName: f.originalname,
        // Construimos la URL fija/pública de Amazon S3
        fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${MEDICAL_DOCS_FOLDER}${fileName}`
      };
    });

    if (nuevos.length === 0) {
      return res.status(400).json({ status: "error", message: "No se recibió ningún archivo" });
    }

    registro.documents.push(...nuevos);
    await registro.save();

    res.status(200).json({ status: "success", data: registro });
  } catch (error) {
    console.error("Error en uploadCronicoDocs:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- CRÓNICO: eliminar un documento ----------
const deleteCronicoDoc = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const registro = await CronicoDegenerativo.findById(id);
    if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });

    const doc = registro.documents.id(docId);
    if (!doc) return res.status(404).json({ status: "error", message: "Documento no encontrado" });

    // Eliminamos el archivo físico del S3
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: MEDICAL_DOCS_FOLDER + doc.fileName,
    }));

    registro.documents.pull({ _id: docId });
    await registro.save();

    res.status(200).json({ status: "success", data: registro });
  } catch (error) {
    console.error("Error en deleteCronicoDoc:", error);
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

// ---------- SEGUIMIENTO MÉDICO GENERAL: actualizar / eliminar ----------
const updateSeguimientoGeneral = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, absenceStartDate, returnDate, nextCheckupDate, restrictions, notes } = req.body;

    const registro = await SeguimientoMedicoGeneral.findByIdAndUpdate(
      id,
      { reason, absenceStartDate, returnDate, nextCheckupDate, restrictions, notes },
      { new: true, runValidators: true }
    );

    if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });
    res.status(200).json({ status: "success", data: registro });
  } catch (error) {
    console.error("Error en updateSeguimientoGeneral:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const deleteSeguimientoGeneral = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await SeguimientoMedicoGeneral.findByIdAndDelete(id);
    if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });
    res.status(200).json({ status: "success", message: "Registro eliminado" });
  } catch (error) {
    console.error("Error en deleteSeguimientoGeneral:", error);
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

// ---------- PERSONAL LACTANTE: actualizar / eliminar ----------
const updateLactante = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, estimatedEndDate, notes } = req.body;

    const registro = await PersonalLactante.findByIdAndUpdate(
      id,
      { startDate, estimatedEndDate, notes },
      { new: true, runValidators: true }
    );

    if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });
    res.status(200).json({ status: "success", data: registro });
  } catch (error) {
    console.error("Error en updateLactante:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const deleteLactante = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await PersonalLactante.findByIdAndDelete(id);
    if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });
    res.status(200).json({ status: "success", message: "Registro eliminado" });
  } catch (error) {
    console.error("Error en deleteLactante:", error);
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

// ---------- CONTROL PRENATAL: actualizar / eliminar ----------
const updatePrenatal = async (req, res) => {
  try {
    const { id } = req.params;
    const { dueDate, gestationWeeks, estimatedLeaveDate, nextAppointmentDate, notes } = req.body;

    const registro = await ControlPrenatal.findByIdAndUpdate(
      id,
      { dueDate, gestationWeeks, estimatedLeaveDate, nextAppointmentDate, notes },
      { new: true, runValidators: true }
    );

    if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });
    res.status(200).json({ status: "success", data: registro });
  } catch (error) {
    console.error("Error en updatePrenatal:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const deletePrenatal = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await ControlPrenatal.findByIdAndDelete(id);
    if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });
    res.status(200).json({ status: "success", message: "Registro eliminado" });
  } catch (error) {
    console.error("Error en deletePrenatal:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Genera subir y eliminar para cualquier modelo con campo "documents"
const buildDocHandlers = (Model) => ({
  upload: async (req, res) => {
    try {
      const registro = await Model.findById(req.params.id);
      if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });

      const nuevos = (req.files || []).map((f) => {
        const fileName = f.key.split("/").pop();
        return {
          fileName,
          originalName: f.originalname,
          // URL pública directa fija de S3
          fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${MEDICAL_DOCS_FOLDER}${fileName}`
        };
      });

      if (nuevos.length === 0) {
        return res.status(400).json({ status: "error", message: "No se recibió ningún archivo" });
      }

      registro.documents.push(...nuevos);
      await registro.save();
      res.status(200).json({ status: "success", data: registro });
    } catch (error) {
      console.error("Error al subir documentos:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  remove: async (req, res) => {
    try {
      const { id, docId } = req.params;
      const registro = await Model.findById(id);
      if (!registro) return res.status(404).json({ status: "error", message: "Registro no encontrado" });

      const doc = registro.documents.id(docId);
      if (!doc) return res.status(404).json({ status: "error", message: "Documento no encontrado" });

      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: MEDICAL_DOCS_FOLDER + doc.fileName,
      }));

      registro.documents.pull({ _id: docId });
      await registro.save();
      res.status(200).json({ status: "success", data: registro });
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
});

const seguimientoDocs = buildDocHandlers(SeguimientoMedicoGeneral);
const lactanteDocs = buildDocHandlers(PersonalLactante);
const prenatalDocs = buildDocHandlers(ControlPrenatal);

// ---------- EXPEDIENTE: subir documentos (crea el expediente si no existe) ----------
const uploadExpedienteDocs = async (req, res) => {
  try {
    const { CompanyId, employeeId } = req.params;

    const nuevos = (req.files || []).map((f) => {
      const fileName = f.key.split("/").pop();
      return {
        fileName,
        originalName: f.originalname,
        // URL pública fija de Amazon S3
        fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${MEDICAL_DOCS_FOLDER}${fileName}`
      };
    });

    if (nuevos.length === 0) {
      return res.status(400).json({ status: "error", message: "No se recibió ningún archivo" });
    }

    const expediente = await ExpedienteMedico.findOneAndUpdate(
      { company: CompanyId, employeeId },
      { $push: { documents: { $each: nuevos } } },
      { new: true, upsert: true }
    );

    res.status(200).json({ status: "success", data: expediente });
  } catch (error) {
    console.error("Error en uploadExpedienteDocs:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- EXPEDIENTE: eliminar un documento ----------
const deleteExpedienteDoc = async (req, res) => {
  try {
    const { CompanyId, employeeId, docId } = req.params;
    const expediente = await ExpedienteMedico.findOne({ company: CompanyId, employeeId });
    if (!expediente) return res.status(404).json({ status: "error", message: "Expediente no encontrado" });

    const doc = expediente.documents.id(docId);
    if (!doc) return res.status(404).json({ status: "error", message: "Documento no encontrado" });

    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: MEDICAL_DOCS_FOLDER + doc.fileName,
    }));

    expediente.documents.pull({ _id: docId });
    await expediente.save();

    res.status(200).json({ status: "success", data: expediente });
  } catch (error) {
    console.error("Error en deleteExpedienteDoc:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------- ALERTAS DE CITAS / REVISIONES ----------
const getAlertasCitas = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 60);
    const DAY = 24 * 60 * 60 * 1000;
    const limite = new Date(Date.now() + (days + 2) * DAY); // margen: el front afina con la fecha local
    const desde30 = new Date(Date.now() - 32 * DAY);

    const enVentana = (d) => d && new Date(d) < limite;
    const reciente = (d) => d && new Date(d) >= desde30 && new Date(d) < limite;

    const sort = { createdAt: -1 };
    const emp = { path: "employeeId", select: "name lastName numberEmployee" };

    const [cronicos, seguimientos, prenatales, lactancias] = await Promise.all([
      CronicoDegenerativo.find({ company: CompanyId }).sort(sort).populate(emp),
      SeguimientoMedicoGeneral.find({ company: CompanyId, returnDate: null }).sort(sort).populate(emp),
      ControlPrenatal.find({ company: CompanyId }).sort(sort).populate(emp),
      PersonalLactante.find({ company: CompanyId }).sort(sort).populate(emp),
    ]);

    // Solo el registro más reciente por empleado (los ya ordenados por createdAt desc)
    const ultimoPorEmpleado = (docs) => {
      const vistos = new Set();
      return docs.filter((r) => {
        if (!r.employeeId) return false;
        const id = String(r.employeeId._id);
        if (vistos.has(id)) return false;
        vistos.add(id);
        return true;
      });
    };

    const item = (r, type, label, date) => ({
      _id: `${r._id}-${type}`, type, label, date, employee: r.employeeId,
    });

    const prenatalesUlt = ultimoPorEmpleado(prenatales);

    const alertas = [
      ...ultimoPorEmpleado(cronicos)
        .filter((r) => enVentana(r.nextCheckupDate))
        .map((r) => item(r, "cronico", "Próxima revisión", r.nextCheckupDate)),
      ...seguimientos
        .filter((r) => r.employeeId && enVentana(r.nextCheckupDate))
        .map((r) => item(r, "seguimiento", "Próxima revisión", r.nextCheckupDate)),
      ...prenatalesUlt
        .filter((r) => reciente(r.nextAppointmentDate))
        .map((r) => item(r, "prenatal", "Próxima consulta prenatal", r.nextAppointmentDate)),
      ...prenatalesUlt
        .filter((r) => reciente(r.estimatedLeaveDate))
        .map((r) => item(r, "prenatal", "Inicio de incapacidad prenatal", r.estimatedLeaveDate)),
      ...ultimoPorEmpleado(lactancias)
        .filter((r) => reciente(r.estimatedEndDate))
        .map((r) => item(r, "lactancia", "Término del periodo de lactancia", r.estimatedEndDate)),
    ];

    res.status(200).json({ status: "success", data: alertas });
  } catch (error) {
    console.error("Error en getAlertasCitas:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  crearConsulta, getConsultas, getExpediente, guardarExpediente, getAllExpedientes,
  crearCronicoDegenerativo, getCronicoDegenerativo, updateCronicoDegenerativo, deleteCronicoDegenerativo, getDetectadosCronicos, uploadCronicoDocs,
  deleteCronicoDoc,
  crearSeguimientoGeneral, getSeguimientoGeneral, getDetectadosSeguimiento, updateSeguimientoGeneral, deleteSeguimientoGeneral,
  crearLactante, getLactantes, updateLactante, deleteLactante,
  crearPrenatal, getPrenatales, updatePrenatal, deletePrenatal,
  uploadExpedienteDocs, deleteExpedienteDoc,
  getAlertasCitas,
  seguimientoDocs, lactanteDocs, prenatalDocs
};