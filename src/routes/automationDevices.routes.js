const { Router } = require("express");
const { getAutomationDevices, createAutomationDevice, updateAutomationDevice } = require("../controllers/automationDevices.controller");
const { verifyToken, isAutorized, isDeviceAdministrator } = require("../middlewares/auth.Jwt");
const router = Router();

//Ruta para obtenes dispositivos existentes
router.get(
    "/AutomationDevices/:CompanyId",
    verifyToken,
    isAutorized,
    getAutomationDevices
);
//Ruta para crear dispositivos
router.post(
    "/AutomationDevices/:CompanyId",
    verifyToken,
    isAutorized,
    isDeviceAdministrator,
    createAutomationDevice
);

//Ruta para actualizar dispositivos
router.put(
    "/AutomationDevices/:automationDeviceId/:CompanyId",
    verifyToken,
    isAutorized,
    isDeviceAdministrator,
    updateAutomationDevice
);

module.exports = router;