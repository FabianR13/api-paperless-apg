const { Router } = require("express");
const router = Router();
const {
  createDeviationRequest,
  getDeviationRequest,
  getDeviationById,
  updateDeviation,
  updateDeviationReq,
  updateRiskStatus,
  updateDeviationStatus,
  deleteDeviation
} = require("../../controllers/Forms/General/deviationReq.controller.js");
const {
  createDeviationRisk,
  updateDeviationRisk,
  updateDeviationRiskSignature,
  getDeviationRiskById
} = require("../../controllers/Forms/General/deviationRisk.controller.js");
const uploadDeviationFile = require("../../middlewares/uploadDeviationFile.js");
const {
  verifyToken,
  isAutorized,
  isDeviationR
} = require("../../middlewares/auth.Jwt.js");
const {sendEmailMiddlewareResponse} = require("../../middlewares/mailer.js");

//Deviation request/////////////////////////////////
//Route to post new Deviation Request///
router.post("/NewDeviation/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  createDeviationRequest,
  sendEmailMiddlewareResponse
);
//Route to update Deviation Request///
router.put("/UpdateDeviation/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  updateDeviationReq);
// Route to get All the deviations///
router.get(
  "/Deviations/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  getDeviationRequest
);
// Route to get a Specific deviation by Id///
router.get(
  "/Deviation/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  getDeviationById
);
//Route to modify just the Status de firma en desviacion rerquest///
router.put(
  "/UpdateDeviation/Signature/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  updateDeviation
);
//route to update risk status///
router.put(
  "/UpdateDeviation/RiskStatus/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  updateRiskStatus,
);
//close deviation///
router.put(
  "/CloseDeviation/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  uploadDeviationFile,
  updateDeviationStatus
);

//delete deviation///
router.delete(
  "/DeleteDeviation/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  deleteDeviation
);


//Deviation Risk Assessment////////////////////////////////////////
//Route to post a new Deviation Risk Assesment ///
router.post("/NewDeviationRisk/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  createDeviationRisk,
  sendEmailMiddlewareResponse
);
//Route to update a new Deviation Risk Assesment ///
router.put("/UpdateDeviationRisk/:deviationRiskId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  updateDeviationRisk);
//Route to update Deviation Risk Assesment Signature///
router.put("/UpdateDeviationRisk/Signature/:deviationRiskId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  updateDeviationRiskSignature);
//Route to get a Deviation Risk Assesment by Id ///
router.get("/DeviationRisk/:deviationRiskId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  getDeviationRiskById);

module.exports = router;