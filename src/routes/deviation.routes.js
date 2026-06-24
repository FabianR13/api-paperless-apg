const { Router } = require("express");
const router = Router();
const {
  verifyToken,
  isAutorized,
  isDeviationR,
  isDeviationValidator,
  isDeviationManager,
  isDeviationCreator
} = require("../middlewares/auth.Jwt.js");
const { sendEmailMiddlewareNext } = require("../middlewares/mailer.js");
const { createDeviation, getDeviations, updateDeviation, rejectDeviation, signDeviation, closeDeviation, createDeviationRequest, getDeviationsRequests, validationDeviationRequest, getNewDeviations, updateDeviationNewRisk, updateClosureEvidence, updateStatus, } = require("../controllers/deviations.controller.js");
const uploadDeviationImgs = require("../middlewares/uploadDeviationImgs.js");
const uploadClosingFile = require("../middlewares/uploadClosingFile.js");
const uploadClosureEvidence = require("../middlewares/uploadClosureEvidence.js");

// RUTA PARA CREAR UNA REQUISICION DE DESVIACION ///
router.post("/NewDeviationRequest/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationCreator,
  uploadDeviationImgs,
  sendEmailMiddlewareNext,
  createDeviationRequest,
);

// RUTA PARA OBTENER REQUISICIONES DE EDESVIACIONES ///
router.get(
  "/DeviationsRequests/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  getDeviationsRequests
);

// RUTA PARA VALIDAR UNA REQUISICION DE DESVIACION ///
router.put("/UpdateDeviationRequest/:DeviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationValidator,
  uploadDeviationImgs,
  (req, res, next) => {
    if (req.body.resolution === "Approved") {
      sendEmailMiddlewareNext(req, res, next);
    } else {
      next();
    }
  },
  validationDeviationRequest,
);

// RUTA PARA OBTENER NUEVAS DESVIACIONES ///
router.get(
  "/NewDeviations/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  getNewDeviations
);

// RUTA PARA ACTUALIZAR RISK DE UNA DESVIACION ///
router.put("/UpdateDeviationNewRisk/:DeviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationValidator,
  // uploadDeviationImgs,
  // sendEmailMiddlewareNext,
  updateDeviationNewRisk,
);

// RUTA PARA ACTUALIZAR RISK DE UNA DESVIACION ///
router.put("/UpdateClosureEvidence/:DeviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationValidator,
  uploadClosureEvidence,
  updateClosureEvidence
);

// RUTA PARA CERRAR UNA DESVIACION ///
router.put("/UpdateStatus/:DeviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationValidator,
  updateStatus
);








// Route to get All the deviations///
router.get(
  "/Deviations/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  getDeviations
);

//Route to post new Deviation ///
router.post("/NewDeviation/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationR,
  uploadDeviationImgs,
  sendEmailMiddlewareNext,
  createDeviation,
);

//Route to reject Deviation por parte de Calidad ///
router.put("/RejectDeviation/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationValidator,
  sendEmailMiddlewareNext,
  rejectDeviation);

//Route to update Deviation Risk Assessment y Validacion Calidad ///
router.put("/UpdateDeviation/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationValidator,
  uploadDeviationImgs,
  updateDeviation);

//Ruta para firmar desviacion Gerentes y Senior///
router.put("/SignDeviation/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  isDeviationManager,
  signDeviation);

//RUTA PARA CERRAR DESVIACION //
router.put(
  "/CloseDeviation/:deviationId/:CompanyId",
  verifyToken,
  isAutorized,
  uploadClosingFile, // Pasamos por Multer primero
  closeDeviation     // Luego vamos al controlador
);

module.exports = router;