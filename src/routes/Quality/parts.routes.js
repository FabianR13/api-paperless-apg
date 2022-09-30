import Router from "express";

const router = Router();

import * as partsController from "../../controllers/Quality/parts.controller.js";
import { authJwt } from "../../middlewares/index.js";
import * as partsInfoController from "../../controllers/Quality/partsInfo.controller.js";

router.post(
    "/newpartesInfo", partsInfoController.signPartsInfo
);

router.put(
    "/actualizarPartInfo/:partInfoId", partsInfoController.updatePartInfo
);

router.post(
    "/NewPart/:CompanyId",
    authJwt.verifyToken,
    authJwt.isAutorized,
    authJwt.isQualityRW,
    partsController.createPart
    );
    
router.get("/Parts/:CompanyId",
    authJwt.verifyToken,
    authJwt.isAutorized,
    authJwt.isQualityR,
    partsController.getParts
);
router.put("/UpdatePart/:partId/:CompanyId",
authJwt.verifyToken,
    authJwt.isAutorized,
    authJwt.isQualityRW,
partsController.udpateParts);

export default router; 