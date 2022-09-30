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
  isAutorized
}= require("../middlewares/auth.Jwt.js");
const {
  createForms,
  getForms,
  getDashboardById
} = require("../controllers/forms.controller.js")
// import * as formsController from "../controllers/forms.controller.js";
// import { authJwt } from "../middlewares/index.js";

router.post(
  "/",
  [verifyToken, isAdmin],
  createForms
);

router.get("/", 
verifyToken, 
getForms);

// router.get(
//   "/list/general",
//   authJwt.verifyToken,
//   authJwt.isAdmin,
//   formsController.getFormsbyGeneral
// );

router.get(
  "/General/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isGeneralR,
  getDashboardById
);

router.get(
  "/Setup/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isSetupR,
  getDashboardById
);

router.get(
  "/Other/:formsId/:CompanyId",
  verifyToken, 
  isAutorized,
  isOtherR,
  getDashboardById
);

router.get(
  "/Quality/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isQualityR,
  getDashboardById
);

router.get(
  "/Production/:formsId/:CompanyId",
  verifyToken,
  isAutorized,
  isProductionR,
  getDashboardById
);

// router.get("/:formId", authJwt.verifyToken, formsController.getFormById);

// router.put("/:formId", [authJwt.verifyToken, authJwt.isModerator], formsController.updateFormById);

// router.delete("/:formId", [authJwt.verifyToken, authJwt.isAdmin], formsController.deleteFormById);

module.exports = router;
