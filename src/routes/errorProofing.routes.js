const { Router } = require("express");
const { verifyToken, isAutorized, isEPReader, isEPCreator } = require("../middlewares/auth.Jwt");
const { getErrorProofings, createNewErrorProofing, updateErrorProofing, createNewChecklist, validateChecklist } = require("../controllers/errorProofing.controller.js");
const router = Router();

// RUTA PARA OBTENER TODOS LOS ERROR PROOFINGS //
router.get(
    "/ErrorProofing/:CompanyId",
    verifyToken,
    isAutorized,
    isEPReader,
    getErrorProofings
);

// RUTA PARA SUBIR UN NUEVO ERROR PROOFING //
router.post(
    "/NewErrorproofing/:CompanyId",
    verifyToken,
    isAutorized,
    isEPCreator,
    createNewErrorProofing
);

// RUTA PARA CERRAR UN ERROR PROOFING //
router.put(
    "/UpdateErrorProofing/:ErrorProofingId/:CompanyId",
    verifyToken,
    isAutorized,
    isEPCreator,
    updateErrorProofing
);
// RUTA PARA AGREGAR UN CHECKLIST A UN ERROR PROOFING //
router.post(
    "/NewCheckList/:ErrorProofingId/:CompanyId",
    verifyToken,
    isAutorized,
    isEPCreator,
    createNewChecklist
);

// RUTA PARA AGREGAR OBSERVACIONES A UN CHECKLIST //
router.put(
    "/ValidateChecklist/:ChecklistId/:CompanyId",
    verifyToken,
    isAutorized,
    isEPCreator,
    validateChecklist
);

module.exports = router;