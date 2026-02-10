const { Router } = require("express");
const router = Router();
const {
  verifyToken,
  isAutorized,
  isDeviationR,
  isDeviationValidator,
  isDeviationManager
} = require("../middlewares/auth.Jwt.js");
const { sendEmailMiddlewareNext } = require("../middlewares/mailer.js");
const { createDeviation, getDeviations, updateDeviation, rejectDeviation, signDeviation, } = require("../controllers/deviations.controller.js");
const uploadDeviationImgs = require("../middlewares/uploadDeviationImgs.js");

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

module.exports = router;