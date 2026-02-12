const { Router } = require("express");
const { getAutomationDevices, createAutomationDevice, updateAutomationDevice } = require("../controllers/automationDevices.controller");
const { verifyToken, isAutorized, isDeviceAdministrator, isEPReader } = require("../middlewares/auth.Jwt");
const router = Router();

// RUTA PARA OBTENER DISPOSITIVOS EXISTENTES //
router.get(
    "/AutomationDevices/:CompanyId",
    verifyToken,
    isAutorized,
    isEPReader,
    getAutomationDevices
);

// RUTA PARA CREAR UN DISPOSITIVO NUEVO //
router.post(
    "/AutomationDevices/:CompanyId",
    verifyToken,
    isAutorized,
    isDeviceAdministrator,
    createAutomationDevice
);

// RUTA PARA MODIFICAR DISPOSITIVO EXISTENTE //
router.put(
    "/AutomationDevices/:automationDeviceId/:CompanyId",
    verifyToken,
    isAutorized,
    isDeviceAdministrator,
    updateAutomationDevice
);

module.exports = router;