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
  getSuggestions
} = require("../../controllers/Forms/Others/kaizen.controller.js");
const uploadKaizenImgs = require("../../middlewares/uploadKaizenImg.js");
const {
  verifyToken,
  isKaizenR,
  isKaizenRW,
  isKaizenAprroval,
  isAutorized
} = require("../../middlewares/auth.Jwt.js");
const uploadSuggestionFiles = require("../../middlewares/uploadSignatureKaizen.js");
const { getRewards, createReward, updateReward } = require("../../controllers/Others/rewardsKaizen.controller.js");
const uploadRewardImg = require("../../middlewares/uploadRewardImg.js");

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
///Route to Post a New Suggestion///
router.post("/NewSuggestion/:CompanyId",
  uploadSuggestionFiles,
  createSuggestion
);
//Ruta para obtener puntos
router.get("/KaizenPoints/:employeeId", getEmployeePoints);
//Ruta para obtener sugerencias
router.get(
  "/Suggestions/:CompanyId",
  verifyToken,
  isAutorized,
  isKaizenR,
  getSuggestions,
);

//Rutas de rewards
// 1. Obtener todos los premios
router.get("/rewards", getRewards);

// 2. Crear un nuevo premio (Usa el middleware para la imagen)
router.post("/rewards", uploadRewardImg, createReward);

// 3. Editar un premio existente (Recibe ID por params)
router.put("/rewards/:id", uploadRewardImg, updateReward);

module.exports = router;
