const { Router } = require("express");
const router = Router();
const {
  verifyToken,
  isAutorized,
  isPersonalReqC,
  isPersonalReqR,
  isPersonalReqS,
  isPersonalReqE,
  isPersonalReqReclu
} = require("../middlewares/auth.Jwt.js");
const { sendEmailMiddlewareResponse } = require("../middlewares/mailer.js");
const { createPersonalRequisition,
  getAllPersonalRequisitions,
  getRequisitionById,
  UpdateRequisitionSignature,
  UpdatePersonalRequisition,
  UpdatePersonalRequisitionAllData
} = require("../controllers/personalRequisition.controller.js");

//Ruta para postear una nueva requisicion
router.post("/NewPersonalRequisition/:CompanyId",
  verifyToken,
  isAutorized,
  isPersonalReqC,
  createPersonalRequisition,
  sendEmailMiddlewareResponse
);

// Route to get All the requisitions///
router.get(
  "/PersonalRequisitions/:CompanyId",
  verifyToken,
  isAutorized,
  isPersonalReqR,
  getAllPersonalRequisitions
);

// Route to get requisition by ID///
router.get(
  "/PersonalRequisition/:CompanyId/:requisitionId",
  verifyToken,
  isAutorized,
  isPersonalReqR,
  getRequisitionById
);

// Ruta para firmas de aprovado o denegado en una requisicion
router.put(
  "/PersonalRequisitionSignature/:requisitionId/:CompanyId",
  verifyToken,
  isAutorized,
  isPersonalReqS,
  UpdateRequisitionSignature,
  sendEmailMiddlewareResponse
);

// Ruta para actualizar datos con notificacion de correo
router.put(
  "/UpdatePersonalRequisition/:requisitionId/:CompanyId",
  verifyToken,
  isAutorized,
  isPersonalReqReclu,
  UpdatePersonalRequisition,
  sendEmailMiddlewareResponse
);

// Ruta para actualizar datos con notificacion de correo
router.put(
  "/UpdatePersonalRequisitionAllData/:requisitionId/:CompanyId",
  verifyToken,
  isAutorized,
  isPersonalReqE,
  UpdatePersonalRequisitionAllData,
  sendEmailMiddlewareResponse
);

module.exports = router;