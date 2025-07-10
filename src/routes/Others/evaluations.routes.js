const { Router } = require("express");
const { verifyToken, isAutorized } = require("../../middlewares/auth.Jwt");
const { getErrorProofings, createNewErrorProofing, updateErrorProofing, createNewChecklist } = require("../../controllers/Forms/General/errorProofing.controller.js");
const { getTrialEvaluations, createNewTrialEvaluation } = require("../../controllers/Forms/Others/evaluations.controller.js");
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

module.exports = router;