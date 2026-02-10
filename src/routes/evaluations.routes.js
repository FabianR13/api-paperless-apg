const { Router } = require("express");
const { verifyToken, isAutorized } = require("../middlewares/auth.Jwt");
const { getErrorProofings, createNewErrorProofing, updateErrorProofing, createNewChecklist } = require("../controllers/errorProofing.controller.js");
const { getTrialEvaluations, createNewTrialEvaluation, updateTrialEvaluation, updateEmployeeSignature } = require("../controllers/evaluations.controller.js");
const uploadSignature = require("../middlewares/uploadEmployeeSign.js");
const router = Router();

// Route to get All the deviations///
router.get(
    "/TrialEvaluations/:CompanyId",
    verifyToken,
    isAutorized,
    getTrialEvaluations
);

router.post(
    "/NewTrialEvaluation/:CompanyId",
    verifyToken,
    isAutorized,
    createNewTrialEvaluation
);

router.put(
    "/UpdateTrialEvaluation/:TrialEvaluationID/:CompanyId",
    verifyToken,
    isAutorized,
    updateTrialEvaluation
);

router.put(
    "/EmployeeSignature/:TrialEvaluationID/:CompanyId",
    verifyToken,
    isAutorized,
    uploadSignature,
    updateEmployeeSignature
);

module.exports = router;