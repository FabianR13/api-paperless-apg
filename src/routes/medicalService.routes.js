const { Router } = require("express");
const {
    crearConsulta, getConsultas,
    getExpediente, guardarExpediente, getAllExpedientes,
    crearCronicoDegenerativo, getCronicoDegenerativo, updateCronicoDegenerativo, deleteCronicoDegenerativo, getDetectadosCronicos,
    crearSeguimientoGeneral, getSeguimientoGeneral, getDetectadosSeguimiento, updateSeguimientoGeneral, deleteSeguimientoGeneral,
    crearLactante, getLactantes, updateLactante, deleteLactante,
    crearPrenatal, getPrenatales, updatePrenatal, deletePrenatal,
} = require("../controllers/medicalService.controller");

const { verifyToken } = require("../middlewares/auth.Jwt");
const router = Router();

// Consultas
router.post("/consultas/:CompanyId", verifyToken, crearConsulta);
router.get("/consultas/:CompanyId", verifyToken, getConsultas);

// Expediente
router.get("/expediente/:CompanyId/:employeeId", verifyToken, getExpediente);
router.put("/expediente/:CompanyId/:employeeId", verifyToken, guardarExpediente);
router.get("/expedientes/:CompanyId", verifyToken, getAllExpedientes);

// Crónico Degenerativo
router.post("/cronicos/:CompanyId", verifyToken, crearCronicoDegenerativo);
router.get("/cronicos/:CompanyId", verifyToken, getCronicoDegenerativo);
router.get("/cronicos/:CompanyId/detectados", verifyToken, getDetectadosCronicos);
router.put("/cronicos/registro/:id", verifyToken, updateCronicoDegenerativo);
router.delete("/cronicos/registro/:id", verifyToken, deleteCronicoDegenerativo);

// Seguimiento Médico General
router.post("/seguimiento/:CompanyId", verifyToken, crearSeguimientoGeneral);
router.get("/seguimiento/:CompanyId", verifyToken, getSeguimientoGeneral);
router.get("/seguimiento/:CompanyId/detectados", verifyToken, getDetectadosSeguimiento);
router.put("/seguimiento/registro/:id", verifyToken, updateSeguimientoGeneral);
router.delete("/seguimiento/registro/:id", verifyToken, deleteSeguimientoGeneral);

// Personal Lactante
router.post("/lactantes/:CompanyId", verifyToken, crearLactante);
router.get("/lactantes/:CompanyId", verifyToken, getLactantes);
router.put("/lactantes/registro/:id", verifyToken, updateLactante);
router.delete("/lactantes/registro/:id", verifyToken, deleteLactante);

// Control Prenatal
router.post("/prenatales/:CompanyId", verifyToken, crearPrenatal);
router.get("/prenatales/:CompanyId", verifyToken, getPrenatales);
router.put("/prenatales/registro/:id", verifyToken, updatePrenatal);
router.delete("/prenatales/registro/:id", verifyToken, deletePrenatal);

module.exports = router;