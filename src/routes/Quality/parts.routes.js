const {Router} = require("express");
const router = Router();
const {
    createPart,
    udpateParts,
    getParts
  } = require("../../controllers/Quality/parts.controller.js");
const {
    verifyToken,
    isQualityR,
    isQualityRW,
    isAutorized
} = require("../../middlewares/auth.Jwt.js");
const {
    signPartsInfo,
    updatePartInfo
} = require("../../controllers/Quality/partsInfo.controller.js");
// import Router from "express";
// import * as partsController from "../../controllers/Quality/parts.controller.js";
// import { authJwt } from "../../middlewares/index.js";
// import * as partsInfoController from "../../controllers/Quality/partsInfo.controller.js";

router.post(
    "/newpartesInfo", 
    signPartsInfo
);

router.put(
    "/actualizarPartInfo/:partInfoId", 
    updatePartInfo
);

router.post(
    "/NewPart/:CompanyId",
    verifyToken,
    isAutorized,
    isQualityRW,
    createPart
    );
    
router.get("/Parts/:CompanyId",
    verifyToken,
    isAutorized,
    isQualityR,
    getParts
);
router.put("/UpdatePart/:partId/:CompanyId",
    verifyToken,
    isAutorized,
    isQualityRW,
    udpateParts);

module.exports = router;