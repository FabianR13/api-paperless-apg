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
  deleteKaizen
} = require("../../controllers/Forms/Others/kaizen.controller.js");
const uploadKaizenImgs = require("../../middlewares/uploadKaizenImg.js");
const {
  verifyToken,
  isKaizenR,
  isKaizenRW,
  isKaizenAprroval,
  isAutorized
} = require("../../middlewares/auth.Jwt.js");

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
  isKaizenRW,
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
  isKaizenRW,
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
