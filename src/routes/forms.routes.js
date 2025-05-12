const Router = require("express");
const router = Router();
const {
  verifyToken,
  isAdmin,
  isGeneralR,
  isOtherR,
  isSetupR,
  isQualityR,
  isProductionR,
  isAutorized,
  isLogisticR,
  isManagementR
} = require("../middlewares/auth.Jwt.js");
const {
  getForms,
  getDashboardById,
  getFormsbyGeneral
} = require("../controllers/forms.controller.js")
///Principal route///
router.get("/",
  verifyToken,
  getForms);
///
router.get(
  "/list/general",
  verifyToken,
  isAdmin,
  getFormsbyGeneral
);
///Route forms in General dashboard///
router.get(
  "/General/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isGeneralR,
  getDashboardById
);
///Route forms in Setup dashboard///
router.get(
  "/Setup/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isSetupR,
  getDashboardById
);
///Route forms in Other dashboard///
router.get(
  "/Other/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isOtherR,
  getDashboardById
);
///Route forms in Quality dashboard///
router.get(
  "/Quality/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isQualityR,
  getDashboardById
);
///Route forms in Production dashboard///
router.get(
  "/Production/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isProductionR,
  getDashboardById
);
///Route forms in Logistics dashboard///
router.get(
  "/Logistics/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isLogisticR,
  getDashboardById
);
///Route forms in IT dashboard///
router.get(
  "/IT/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isAdmin,
  getDashboardById
);
///Route forms in IT dashboard///
router.get(
  "/Management/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isManagementR,
  getDashboardById
);

module.exports = router;
