const { Router } = require("express");
const router = Router();
const {
    verifyToken,
    isAutorized,
    isTrainingT,
    isTrainingR,
    isTrainingL
} = require("../../middlewares/auth.Jwt.js");
const { createTrainingEvaluation, getEvaluations, getEvaluationById, updateTrainingEvaluation, deleteTrainingEvaluation, updateEvaluationRegister, countEvaluations, getEvaluationsFiltered } = require("../../controllers/Forms/Others/training.controller.js");
const { sendEmailMiddlewareResponse } = require("../../middlewares/mailer.js");

//Route to post new Training Evaluation///
router.post("/NewEvaluation/:CompanyId",
    verifyToken,
    isAutorized,
    isTrainingT,
    createTrainingEvaluation
);

///Route to get All the evaluations///
router.post(
    "/TrainingEvaluations/:CompanyId",
    getEvaluations,
);

///Route to get All the evaluations count///
router.get(
    "/TrainingEvaluations/:CompanyId",
    countEvaluations,
);

///Route to get especific evaluation//
router.get(
    "/TrainingEvaluations/:evaluationId/:CompanyId",
    verifyToken,
    isAutorized,
    isTrainingR,
    getEvaluationById,
);

///Ruta para guardar calificacion de evaluacion
router.put(
    "/RateTrainingEvaluation/:evaluationId/:CompanyId",
    verifyToken,
    isAutorized,
    isTrainingL,
    updateTrainingEvaluation,
);

///Ruta para enviar correo de notificacion a lider de entrenamiento
router.post(
    "/NotifyTrainerLead/:CompanyId",
    verifyToken,
    isAutorized,
    isTrainingT,
    sendEmailMiddlewareResponse,
);

///Route to delete evaluation///
router.delete(
    "/DeleteTrainingEvaluation/:evaluationId/:CompanyId",
    verifyToken,
    isAutorized,
    isTrainingL,
    deleteTrainingEvaluation
);


///Ruta para actualizar rewgistro de evaluaciones
router.put(
    "/UpdateEvaluationRegister/:evaluationId/:CompanyId",
    verifyToken,
    isAutorized,
    isTrainingT,
    updateEvaluationRegister,
);

///Route to get evaluations filtered///
router.post(
    "/TrainingEvaluationsFiltered/:CompanyId",
    verifyToken,
    isAutorized,
    isTrainingR,
    getEvaluationsFiltered
  );

module.exports = router;