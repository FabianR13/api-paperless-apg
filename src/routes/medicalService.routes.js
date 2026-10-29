const { Router } = require("express");
const {
    crearConsulta, getConsultas,
    getExpediente, guardarExpediente, getAllExpedientes, uploadExpedienteDocs, deleteExpedienteDoc,
    crearCronicoDegenerativo, getCronicoDegenerativo, updateCronicoDegenerativo, deleteCronicoDegenerativo, getDetectadosCronicos, uploadCronicoDocs, deleteCronicoDoc,
    crearSeguimientoGeneral, getSeguimientoGeneral, getDetectadosSeguimiento, updateSeguimientoGeneral, deleteSeguimientoGeneral,
    crearLactante, getLactantes, updateLactante, deleteLactante,
    crearPrenatal, getPrenatales, updatePrenatal, deletePrenatal, getAlertasCitas,
    seguimientoDocs, lactanteDocs, prenatalDocs
} = require("../controllers/medicalService.controller");

const { verifyToken } = require("../middlewares/auth.Jwt");
const uploadMedicalFiles = require("../middlewares/uploadMedicalFile");
const router = Router();

// Consultas
router.post("/consultas/:CompanyId", verifyToken, crearConsulta);
router.get("/consultas/:CompanyId", verifyToken, getConsultas);

// Expediente
router.get("/expediente/:CompanyId/:employeeId", verifyToken, getExpediente);
router.put("/expediente/:CompanyId/:employeeId", verifyToken, guardarExpediente);
router.get("/expedientes/:CompanyId", verifyToken, getAllExpedientes);
// Documentos: Expediente
router.put("/expediente/:CompanyId/:employeeId/documentos", verifyToken, uploadMedicalFiles, uploadExpedienteDocs);
router.delete("/expediente/:CompanyId/:employeeId/documentos/:docId", verifyToken, deleteExpedienteDoc);

// Crónico Degenerativo
router.post("/cronicos/:CompanyId", verifyToken, crearCronicoDegenerativo);
router.get("/cronicos/:CompanyId", verifyToken, getCronicoDegenerativo);
router.get("/cronicos/:CompanyId/detectados", verifyToken, getDetectadosCronicos);
router.put("/cronicos/registro/:id", verifyToken, updateCronicoDegenerativo);
router.delete("/cronicos/registro/:id", verifyToken, deleteCronicoDegenerativo);
// 1. Subir archivos
router.put("/cronicos/registro/:id/documentos", verifyToken, uploadMedicalFiles, uploadCronicoDocs);
// 2. Eliminar archivo
router.delete("/cronicos/registro/:id/documentos/:docId", verifyToken, deleteCronicoDoc);

// Seguimiento Médico General
router.post("/seguimiento/:CompanyId", verifyToken, crearSeguimientoGeneral);
router.get("/seguimiento/:CompanyId", verifyToken, getSeguimientoGeneral);
router.get("/seguimiento/:CompanyId/detectados", verifyToken, getDetectadosSeguimiento);
router.put("/seguimiento/registro/:id", verifyToken, updateSeguimientoGeneral);
router.delete("/seguimiento/registro/:id", verifyToken, deleteSeguimientoGeneral);
// Documentos: Seguimiento general
router.put("/seguimiento/registro/:id/documentos", verifyToken, uploadMedicalFiles, seguimientoDocs.upload);
router.delete("/seguimiento/registro/:id/documentos/:docId", verifyToken, seguimientoDocs.remove);

// Personal Lactante
router.post("/lactantes/:CompanyId", verifyToken, crearLactante);
router.get("/lactantes/:CompanyId", verifyToken, getLactantes);
router.put("/lactantes/registro/:id", verifyToken, updateLactante);
router.delete("/lactantes/registro/:id", verifyToken, deleteLactante);
// Documentos: Lactancia
router.put("/lactantes/registro/:id/documentos", verifyToken, uploadMedicalFiles, lactanteDocs.upload);
router.delete("/lactantes/registro/:id/documentos/:docId", verifyToken, lactanteDocs.remove);

// Control Prenatal
router.post("/prenatales/:CompanyId", verifyToken, crearPrenatal);
router.get("/prenatales/:CompanyId", verifyToken, getPrenatales);
router.put("/prenatales/registro/:id", verifyToken, updatePrenatal);
router.delete("/prenatales/registro/:id", verifyToken, deletePrenatal);
// Documentos: Prenatal
router.put("/prenatales/registro/:id/documentos", verifyToken, uploadMedicalFiles, prenatalDocs.upload);
router.delete("/prenatales/registro/:id/documentos/:docId", verifyToken, prenatalDocs.remove);

// Alertas
router.get("/alertas/:CompanyId", verifyToken, getAlertasCitas);

module.exports = router;