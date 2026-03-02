const { Router } = require("express");
const { verifyToken, isAutorized, isAdmin } = require("../middlewares/auth.Jwt");
const { scheduleAudits, getDailyAudits, updateDailyAuditStatus } = require("../controllers/dailyAudits.controller");
const router = Router();

// RUTA PARA PROGRAMAR ASIGNAR AUDITORIAS //
router.post("/ScheduleAudits/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    scheduleAudits
);

// RUTA PARA PROGRAMAR ASIGNAR AUDITORIAS //
router.get("/DailyAudits/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getDailyAudits
);

// RUTA PARA CAMBIAR ESTADO A RETRAZADA //
router.put("/DailyAudits/UpdateStatus/:CompanyId/:DailyAuditId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateDailyAuditStatus
);


module.exports = router;