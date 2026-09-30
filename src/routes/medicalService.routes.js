const { Router } = require("express");
const {
    crearConsulta,
    getConsultas,
    getExpediente,
    guardarExpediente
} = require("../controllers/medicalService.controller");

const { verifyToken } = require("../middlewares/auth.Jwt");
const router = Router();

// Consultas
router.post("/consultas/:CompanyId",
    verifyToken,
    crearConsulta);

router.get("/consultas/:CompanyId",
    verifyToken,
    getConsultas);

// Expediente
router.get("/expediente/:CompanyId/:employeeId",
    verifyToken, getExpediente);

router.put("/expediente/:CompanyId/:employeeId",
    verifyToken, guardarExpediente);

module.exports = router;