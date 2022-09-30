import Router from "express";

const router = Router();

import * as deviationRequestController from "../../controllers/Forms/General/deviationReq.controller.js";
import * as deviationRiskController from "../../controllers/Forms/General/deviationRisk.controller.js";
import uploadDeviationFile from "../../middlewares/uploadDeviationFile.js";
import { authJwt } from "../../middlewares/index.js";
//Deviation request

//Route to post new Deviation Request
router.post("/NewDeviation/:CompanyId", 
authJwt.verifyToken,
authJwt.isAutorized,
authJwt.isDeviationR,
deviationRequestController.createDeviationRequest
);

//Route to update Deviation Request
router.put("/UpdateDeviation/:deviationId/:CompanyId",
authJwt.verifyToken,
authJwt.isAutorized,
authJwt.isDeviationR,
deviationRequestController.updateDeviationReq);

// Route to get All the deviations
router.get(
    "/Deviations/:CompanyId",
    authJwt.verifyToken,
    authJwt.isAutorized,
    authJwt.isDeviationR,
    deviationRequestController.getDeviationRequest
  );
  
  // Route to get a Specific deviation by Id
router.get(
    "/Deviation/:deviationId/:CompanyId",
    authJwt.verifyToken,
    authJwt.isAutorized,
    authJwt.isDeviationR,
    deviationRequestController.getDeviationById
  );

  //Route to modify just the Status de firma en desviacion rerquest
router.put(
  "/UpdateDeviation/Signature/:deviationId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isDeviationR,
  deviationRequestController.updateDeviation
);
//route to update risk status
router.put(
  "/UpdateDeviation/RiskStatus/:deviationId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isDeviationR,
  deviationRequestController.updateRiskStatus,
);
//close deviation
router.put(
  "/CloseDeviation/:deviationId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isDeviationR,
  uploadDeviationFile,
  deviationRequestController.updateDeviationStatus
);


//Deviation Risk Assessment

//Route to post a new Deviation Risk Assesment 
router.post("/NewDeviationRisk/:CompanyId",
authJwt.verifyToken,
authJwt.isAutorized,
authJwt.isDeviationR,
deviationRiskController.createDeviationRisk,
);

//Route to update a new Deviation Risk Assesment 
router.put("/UpdateDeviationRisk/:deviationRiskId/:CompanyId",
authJwt.verifyToken,
authJwt.isAutorized,
authJwt.isDeviationR,
deviationRiskController.updateDeviationRisk);
//Route to get a Deviation Risk Assesment by Id 
router.get("/DeviationRisk/:deviationRiskId/:CompanyId",
authJwt.verifyToken,
authJwt.isAutorized,
authJwt.isDeviationR,
deviationRiskController.getDeviationRiskById);

export default router;