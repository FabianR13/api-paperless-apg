import { Router } from "express";
import * as kaizenController from "../../controllers/Forms/Others/kaizen.controller.js";
const router = Router();
import { uploadKaizenImgs } from "../../middlewares/uploadKaizenImg.js";
import { authJwt } from "../../middlewares.js";

// Route to get All the kaizens
router.get(
  "/Kaizens/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isKaizenR,
  kaizenController.getKaizens,
);

// Route to get a Specific Kaizen by Id
router.get(
  "/Kaizen/:kaizenId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isKaizenR,
  kaizenController.getKaizenById,
);

// Route to Post a New Kaizen
router.post("/NewKaizen/:CompanyId", 
uploadKaizenImgs, 
kaizenController.createKaizen);

// Route to modify all the fields in a specific kaizen
router.put(
  "/UpdateKaizen/:kaizenId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isKaizenRW,
  kaizenController.updateKaizen
);

//Route to modify just the Status of a Kaizen
router.put(
  "/UpdateKaizen/Status/:kaizenId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isKaizenAprroval,
  kaizenController.updateKaizenStatus
);

//Route to modify Images from the Kaizen
router.put(
  "/UpdateKaizen/Images/:kaizenId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isKaizenRW,
  uploadKaizenImgs,
  kaizenController.modifyKaizenImg
);

router.post(
  "/KaizensFiltered/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isKaizenR,
  kaizenController.getKaizensFiltered
);
// Route to delete kaizen
router.delete(
  "/DeleteKaizen/:kaizenId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isKaizenRW,
  kaizenController.deleteKaizen
);

export default router;
