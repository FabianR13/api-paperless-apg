const { Router } = require("express");
const {
    crearConsulta,
    getConsultas,
    getExpediente,
    guardarExpediente,
    crearCronicoDegenerativo, getCronicoDegenerativo, getDetectadosCronicos,
    crearSeguimientoGeneral, getSeguimientoGeneral, getDetectadosSeguimiento,
    crearLactante, getLactantes,
    crearPrenatal, getPrenatales,
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

// Crónico Degenerativo
router.post("/cronicos/:CompanyId", verifyToken, crearCronicoDegenerativo);
router.get("/cronicos/:CompanyId", verifyToken, getCronicoDegenerativo);
router.get("/cronicos/:CompanyId/detectados", verifyToken, getDetectadosCronicos);

// Seguimiento Médico General
router.post("/seguimiento/:CompanyId", verifyToken, crearSeguimientoGeneral);
router.get("/seguimiento/:CompanyId", verifyToken, getSeguimientoGeneral);
router.get("/seguimiento/:CompanyId/detectados", verifyToken, getDetectadosSeguimiento);

// Personal Lactante
router.post("/lactantes/:CompanyId", verifyToken, crearLactante);
router.get("/lactantes/:CompanyId", verifyToken, getLactantes);

// Control Prenatal
router.post("/prenatales/:CompanyId", verifyToken, crearPrenatal);
router.get("/prenatales/:CompanyId", verifyToken, getPrenatales);

router.get("/female-employees/:company", verifyToken, async (req, res) => {
    try {
        const { company } = req.params;

        // Buscar expedientes femeninos en la BD
        const expedientesFemeninos = await ExpedienteMedico.find({
            company,
            gender: { $in: ["Femenino", "femenino", "F", "f"] }
        }).select("employeeId");

        const employeeIds = expedientesFemeninos.map(e => e.employeeId);

        // Traer únicamente los datos de esas empleadas
        const femaleEmployees = await Employee.find({
            _id: { $in: employeeIds },
            company
        }).sort({ name: 1 });

        res.json({ status: "200", data: femaleEmployees });
    } catch (error) {
        console.error("Error al obtener colaboradoras:", error);
        res.status(500).json({ message: "Error al obtener colaboradoras" });
    }
});

module.exports = router;