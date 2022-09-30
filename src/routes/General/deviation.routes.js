const {Router} = require("express");
const router = Router();
const {
  createDeviationRequest,
  getDeviationRequest,
  getDeviationById,
  updateDeviation,
  updateDeviationReq,
  updateRiskStatus,
  updateDeviationStatus
} = require("../../controllers/Forms/General/deviationReq.controller.js");
const {
  createDeviationRisk,
  updateDeviationRisk,
  getDeviationRiskById
} = require("../../controllers/Forms/General/deviationRisk.controller.js");
const uploadDeviationFile = require("../../middlewares/uploadDeviationFile.js");
const {
  verifyToken,
  isAutorized,
  isDeviationR
} = require("../../middlewares/auth.Jwt.js");
// import Router from "express";
// import * as deviationRequestController from "../../controllers/Forms/General/deviationReq.controller.js";
// import * as deviationRiskController from "../../controllers/Forms/General/deviationRisk.controller.js";
// import uploadDeviationFile from "../../middlewares/uploadDeviationFile.js";
// import { authJwt } from "../../middlewares/index.js";

//Deviation request

//Route to post new Deviation Request
router.post("/NewDeviation/:CompanyId", 
verifyToken,
isAutorized,
isDeviationR,
createDeviationRequest
);

//Route to update Deviation Request
router.put("/UpdateDeviation/:deviationId/:CompanyId",
verifyToken,
isAutorized,
isDeviationR,
updateDeviationReq);

// Route to get All the deviations
router.get(
    "/Deviations/:CompanyId",
    verifyToken,
    isAutorized,
    isDeviationR,
    getDeviationRequest
  );
  
  // Route to get a Specific deviation by Id
router.get(
    "/Deviation/:deviationId/:CompanyId",
    verifyToken,
    isAutorized,
    isDeviationR,
    getDeviationById
  );

  //Route to modify just the Status de firma en desviacion rerquest
router.put(
  "/UpdateDeviation/Signature/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  updateDeviation
);
//route to update risk status
router.put(
  "/UpdateDeviation/RiskStatus/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  updateRiskStatus,
);
//close deviation
router.put(
  "/CloseDeviation/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  uploadDeviationFile,
  updateDeviationStatus
);


//Deviation Risk Assessment

//Route to post a new Deviation Risk Assesment 
router.post("/NewDeviationRisk/:CompanyId",
verifyToken,
isAutorized,
isDeviationR,
createDeviationRisk,
);

//Route to update a new Deviation Risk Assesment 
router.put("/UpdateDeviationRisk/:deviationRiskId/:CompanyId",
verifyToken,
isAutorized,
isDeviationR,
updateDeviationRisk);
//Route to get a Deviation Risk Assesment by Id 
router.get("/DeviationRisk/:deviationRiskId/:CompanyId",
verifyToken,
isAutorized,
isDeviationR,
getDeviationRiskById);

module.exports = router;