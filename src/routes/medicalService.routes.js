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

const { verifyToken, isAutorized, isEHS } = require("../middlewares/auth.Jwt");
const uploadMedicalFiles = require("../middlewares/uploadMedicalFile");
const router = Router();

// Consultas
router.post("/consultas/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    crearConsulta
);
router.get("/consultas/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getConsultas
);

// Expediente
router.get("/expediente/:CompanyId/:employeeId",
    verifyToken,
    isAutorized,
    isEHS,
    getExpediente
);
router.put("/expediente/:CompanyId/:employeeId",
    verifyToken,
    isAutorized,
    isEHS,
    guardarExpediente
);
router.get("/expedientes/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getAllExpedientes
);
// Documentos: Expediente
router.put("/expediente/:CompanyId/:employeeId/documentos",
    verifyToken,
    isAutorized,
    isEHS,
    uploadMedicalFiles,
    uploadExpedienteDocs
);
router.delete("/expediente/:CompanyId/:employeeId/documentos/:docId",
    verifyToken,
    isAutorized,
    isEHS,
    deleteExpedienteDoc
);

// Crónico Degenerativo
router.post("/cronicos/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    crearCronicoDegenerativo
);
router.get("/cronicos/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getCronicoDegenerativo
);
router.get("/cronicos/:CompanyId/detectados",
    verifyToken,
    isAutorized,
    isEHS,
    getDetectadosCronicos
);
router.put("/cronicos/registro/:id",
    verifyToken,
    isAutorized,
    isEHS,
    updateCronicoDegenerativo
);
router.delete("/cronicos/registro/:id",
    verifyToken,
    isAutorized,
    isEHS,
    deleteCronicoDegenerativo
);
// 1. Subir archivos
router.put("/cronicos/registro/:id/documentos",
    verifyToken,
    isAutorized,
    isEHS,
    uploadMedicalFiles,
    uploadCronicoDocs
);
// 2. Eliminar archivo
router.delete("/cronicos/registro/:id/documentos/:docId",
    verifyToken,
    isAutorized,
    isEHS,
    deleteCronicoDoc
);

// Seguimiento Médico General
router.post("/seguimiento/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    crearSeguimientoGeneral
);
router.get("/seguimiento/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getSeguimientoGeneral
);
router.get("/seguimiento/:CompanyId/detectados",
    verifyToken,
    isAutorized,
    isEHS,
    getDetectadosSeguimiento
);
router.put("/seguimiento/registro/:id",
    verifyToken,
    isAutorized,
    isEHS,
    updateSeguimientoGeneral
);
router.delete("/seguimiento/registro/:id",
    verifyToken,
    isAutorized,
    isEHS,
    deleteSeguimientoGeneral
);
// Documentos: Seguimiento general
router.put("/seguimiento/registro/:id/documentos",
    verifyToken,
    isAutorized,
    isEHS,
    uploadMedicalFiles,
    seguimientoDocs.upload
);
router.delete("/seguimiento/registro/:id/documentos/:docId",
    verifyToken,
    isAutorized,
    isEHS,
    seguimientoDocs.remove
);

// Personal Lactante
router.post("/lactantes/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    crearLactante
);
router.get("/lactantes/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getLactantes
);
router.put("/lactantes/registro/:id",
    verifyToken,
    isAutorized,
    isEHS,
    updateLactante
);
router.delete("/lactantes/registro/:id",
    verifyToken,
    isAutorized,
    isEHS,
    deleteLactante
);
// Documentos: Lactancia
router.put("/lactantes/registro/:id/documentos",
    verifyToken,
    isAutorized,
    isEHS,
    uploadMedicalFiles,
    lactanteDocs.upload
);
router.delete("/lactantes/registro/:id/documentos/:docId",
    verifyToken,
    isAutorized,
    isEHS,
    lactanteDocs.remove
);

// Control Prenatal
router.post("/prenatales/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    crearPrenatal
);
router.get("/prenatales/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getPrenatales
);
router.put("/prenatales/registro/:id",
    verifyToken,
    isAutorized,
    isEHS,
    updatePrenatal
);
router.delete("/prenatales/registro/:id",
    verifyToken,
    isAutorized,
    isEHS,
    deletePrenatal
);
// Documentos: Prenatal
router.put("/prenatales/registro/:id/documentos",
    verifyToken,
    isAutorized,
    isEHS,
    uploadMedicalFiles,
    prenatalDocs.upload
);
router.delete("/prenatales/registro/:id/documentos/:docId",
    verifyToken,
    isAutorized,
    isEHS,
    prenatalDocs.remove
);

// Alertas
router.get("/alertas/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getAlertasCitas
);

module.exports = router;