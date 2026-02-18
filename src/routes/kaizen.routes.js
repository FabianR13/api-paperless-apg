const { Router } = require("express");
const router = Router();
const {
  createKaizen,
  getKaizens,
  getKaizenById,
  getKaizensFiltered,
  updateKaizen,
  updateKaizenStatus,
  modifyKaizenImg,
  deleteKaizen,
  createSuggestion,
  getEmployeePoints,
  getSuggestions,
  getKaizenPoints,
  createNewRegister,
  manualPointsUpdate,
  createNewRedeem,
  getRedemptions,
  completeRedeem,
  createInvestigation
} = require("../controllers/kaizen.controller.js");
const uploadKaizenImgs = require("../middlewares/uploadKaizenImg.js");
const {
  verifyToken,
  isKaizenR,
  isKaizenRW,
  isKaizenAprroval,
  isAutorized,
  isKaizenAdviser
} = require("../middlewares/auth.Jwt.js");
const uploadSuggestionFiles = require("../middlewares/uploadSignatureKaizen.js");
const { getRewards, createReward, updateReward } = require("../controllers/rewardsKaizen.controller.js");
const uploadRewardImg = require("../middlewares/uploadRewardImg.js");
const uploadInvestigationSignatures = require("../middlewares/uploadSignaturesImg.js");

// RUTA PARA GENERAR NUEVA SUGERENCIA //
router.post("/NewSuggestion/:CompanyId",
  uploadSuggestionFiles,
  createSuggestion
);

// RUTA PARA OBTENER LAS SUGERENCIAS //
router.get(
  "/Suggestions/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenR,
  getSuggestions,
);

// RUTA PARA OBTENER PUNTOS DE UN EMPLEADO //
router.get("/KaizenPoints/:employeeId", getEmployeePoints);

// RUTA PARA OBTENER LOS PUNTOS KAIZEN DE TODOS LOS EMPLEADOS //
router.get("/KaizenPointsAll/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenR,
  getKaizenPoints);

// RUTA PARA CREAR UN NUEVO REGISTRO DE PUNTOS //
router.post("/AddNewRegister/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenAdviser,
  createNewRegister
);

// RUTA PARA MODIFICAR REGISTROS DE PUNTOS KAIZEN //
router.put("/ModifyKaizenPoints/:CompanyId/:RegisterId",
  verifyToken,
  isAutorized,
  isKaizenAdviser,
  manualPointsUpdate
);

// RUTA PARA CREAR UN NUEVO CANGE DE PUNTOS//
router.post("/AddNewRedeem/:CompanyId", createNewRedeem);

// RUTA PARA OBTENER LOS CANJES DE PUNTOS EXISTENTES //
router.get("/Redemptions/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenR,
  getRedemptions
);

// RUTA PARA ACTUALIZAR CANJE DE PUNTOS//
router.put("/UpdateRedemption/:CompanyId/:RedemptionId",
  verifyToken,
  isAutorized,
  isKaizenAdviser,
  uploadSuggestionFiles,
  completeRedeem
);

// OBTENER TODOS LOS PREMIOS //
router.get("/rewards", getRewards);

// CREAR UN NUEVO PREMIO KAIZEN //
router.post("/rewards/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenAdviser,
  uploadRewardImg,
  createReward);

// EDITAR UN PREMIO EXISTENTE //
router.put("/rewards/:CompanyId/:RewardId",
  verifyToken,
  isAutorized,
  isKaizenAdviser,
  uploadRewardImg,
  updateReward);

// RUTA PARA CREAR UNA NUEVA IONVESTIGACION DE KAIZEN //
router.post(
  "/CreateInvestigation/:CompanyId/:suggestionId",
  uploadInvestigationSignatures,
  createInvestigation
);










///Route to get All the kaizens///
router.get(
  "/Kaizens/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenR,
  getKaizens,
);
///Route to get a Specific Kaizen by Id///
router.get(
  "/Kaizen/:kaizenId/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenR,
  getKaizenById,
);
///Route to Post a New Kaizen///
router.post("/NewKaizen/:CompanyId",
  uploadKaizenImgs,
  createKaizen
);
///Route to modify all the fields in a specific kaizen///
router.put(
  "/UpdateKaizen/:kaizenId/:CompanyId",
  verifyToken,
  isAutorized,
  // isKaizenRW,
  updateKaizen
);
///Route to modify just the Status of a Kaizen///
router.put(
  "/UpdateKaizen/Status/:kaizenId/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenAprroval,
  updateKaizenStatus
);
///Route to modify Images from the Kaizen///
router.put(
  "/UpdateKaizen/Images/:kaizenId/:CompanyId",
  verifyToken,
  isAutorized,
  // isKaizenRW,
  uploadKaizenImgs,
  modifyKaizenImg
);
///Route to get kaizens filtered///
router.post(
  "/KaizensFiltered/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenR,
  getKaizensFiltered
);
///Route to delete kaizen///
router.delete(
  "/DeleteKaizen/:kaizenId/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenRW,
  deleteKaizen
);


module.exports = router;
