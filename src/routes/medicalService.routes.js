const { Router } = require("express");
const { crearConsulta } = require("../controllers/medicalService.controller");
const { verifyToken } = require("../middlewares/auth.Jwt");
const router = Router();

// Consultas
router.post("/consultas/:CompanyId", 
    verifyToken, 
    crearConsulta);

module.exports = router;