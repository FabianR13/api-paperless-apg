const { Router } = require("express");
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

///Route to create part info///
router.post(
    "/newpartesInfo",
    signPartsInfo
);
///Route to update part info///
router.put(
    "/actualizarPartInfo/:partInfoId",
    updatePartInfo
);
///Route to create new part///
router.post(
    "/NewPart/:CompanyId",
    verifyToken,
    isAutorized,
    isQualityRW,
    createPart
);
///Route to get all part by company///
router.get("/Parts/:CompanyId",
    verifyToken,
    isAutorized,
    isQualityR,
    getParts
);
///Route to update part number///
router.put("/UpdatePart/:partId/:CompanyId",
    verifyToken,
    isAutorized,
    isQualityRW,
    udpateParts);

module.exports = router;