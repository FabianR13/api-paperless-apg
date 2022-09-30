import { Router } from "express";
const router = Router();

import * as formsController from "../controllers/forms.controller.js";
import { authJwt } from "../middlewares";

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isAdmin],
  formsController.createForms
);

router.get("/", 
authJwt.verifyToken, 
formsController.getForms);

// router.get(
//   "/list/general",
//   authJwt.verifyToken,
//   authJwt.isAdmin,
//   formsController.getFormsbyGeneral
// );

router.get(
  "/General/:formsId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isGeneralR,
  formsController.getDashboardById
);

router.get(
  "/Setup/:formsId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isSetupR,
  formsController.getDashboardById
);

router.get(
  "/Other/:formsId/:CompanyId",
  authJwt.verifyToken, 
  authJwt.isAutorized,
  authJwt.isOtherR,
  formsController.getDashboardById
);

router.get(
  "/Quality/:formsId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
   authJwt.isQualityR,
  formsController.getDashboardById
);

router.get(
  "/Production/:formsId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
   authJwt.isProductionR,
  formsController.getDashboardById
);

// router.get("/:formId", authJwt.verifyToken, formsController.getFormById);

// router.put("/:formId", [authJwt.verifyToken, authJwt.isModerator], formsController.updateFormById);

// router.delete("/:formId", [authJwt.verifyToken, authJwt.isAdmin], formsController.deleteFormById);

export default router;
