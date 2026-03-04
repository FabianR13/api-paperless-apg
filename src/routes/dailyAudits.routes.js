const { Router } = require("express");
const { verifyToken, isAutorized, isDailyAuditAdministrator, isDailyAuditCreator } = require("../middlewares/auth.Jwt");
const { scheduleAudits, getDailyAudits, updateDailyAuditStatus, updateDailyAuditData } = require("../controllers/dailyAudits.controller");
const router = Router();

// RUTA PARA PROGRAMAR ASIGNAR AUDITORIAS //
router.post("/ScheduleAudits/:CompanyId",
    verifyToken,
    isAutorized,
    isDailyAuditAdministrator,
    scheduleAudits
);

// RUTA PARA OBTENER AUDITORIAS //
router.get("/DailyAudits/:CompanyId",
    verifyToken,
    isAutorized,
    isDailyAuditCreator,
    getDailyAudits
);

// RUTA PARA CAMBIAR ESTADO A RETRAZADA //
router.put("/DailyAudits/UpdateStatus/:CompanyId/:DailyAuditId",
    verifyToken,
    isAutorized,
    isDailyAuditCreator,
    updateDailyAuditStatus
);

// RUTA PARA CAMBIAR DATA DE LA AUDITORIA//
router.put("/DailyAudits/UpdateData/:CompanyId/:DailyAuditId",
    verifyToken,
    isAutorized,
    isDailyAuditCreator,
    updateDailyAuditData
);


module.exports = router;