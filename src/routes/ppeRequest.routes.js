const { Router } = require("express");
const { verifyToken, isAutorized } = require("../middlewares/auth.Jwt");
const { getPPERequest, createPPERequest, updatePPERequest } = require("../controllers/ppeRequest.controller");
const uploadPPEImage = require("../middlewares/uploadImagesPPER");
const router = Router();

// RUTA PARA OBTENER LAS SOLICITUDES DE EPP //
router.get(
    "/PPERequest/:CompanyId",
    verifyToken,
    isAutorized,
    getPPERequest
);

// RUTA PARA GUARDAR SOLICITUD DE EPP //
router.post(
    "/NewPPERequest/:CompanyId",
    verifyToken,
    isAutorized,
    uploadPPEImage,
    createPPERequest
);

//RUTA PARA ENTREGAR EPP //
router.put(
    "/UpdatePPERequest/:CompanyId/:ppeRequestId",
    verifyToken,
    isAutorized,
    uploadPPEImage,
    updatePPERequest
);

module.exports = router;