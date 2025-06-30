const { Router } = require("express");
const { verifyToken, isAutorized } = require("../../middlewares/auth.Jwt");
const { getErrorProofings, createNewErrorProofing, updateErrorProofing, createNewChecklist } = require("../../controllers/Forms/General/errorProofing.controller.js");
const router = Router();

// Route to get All the deviations///
router.get(
    "/ErrorProofing/:CompanyId",
    verifyToken,
    isAutorized,
    getErrorProofings
);

//Ruta para subir nueva minuta
router.post(
    "/NewErrorproofing/:CompanyId",
    verifyToken,
    isAutorized,
    createNewErrorProofing
);

//Ruta para editar un error proofing
router.put(
    "/UpdateErrorProofing/:ErrorProofingId/:CompanyId",
    verifyToken,
    isAutorized,
    updateErrorProofing
);
//Ruta para guardar un checklist en un error proofing
router.post(
    "/NewCheckList/:ErrorProofingId/:CompanyId",
    verifyToken,
    isAutorized,
    createNewChecklist
);

module.exports = router;