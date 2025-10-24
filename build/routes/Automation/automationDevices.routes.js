const {
  Router
} = require("express");

const {
  getAutomationDevices
} = require("../../controllers/Automation/automationDevices.controller");

const {
  verifyToken,
  isAutorized
} = require("../../middlewares/auth.Jwt");

const router = Router();
router.get("/AutomationDevices/:CompanyId", verifyToken, isAutorized, getAutomationDevices);
module.exports = router;