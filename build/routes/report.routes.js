const {
  Router
} = require("express");

const {
  verifyToken,
  isAutorized,
  isAdmin
} = require("../middlewares/auth.Jwt");

const {
  saveTemplate,
  getReports
} = require("../controllers/reports.controller");

const router = Router(); //Route to post new Report Template ///

router.post("/NewReportTemplate/:CompanyId", verifyToken, isAutorized, isAdmin, saveTemplate); //Route to post new Report Template ///

router.get("/GetReportTemplates/:CompanyId", verifyToken, isAutorized, isAdmin, getReports);
module.exports = router;