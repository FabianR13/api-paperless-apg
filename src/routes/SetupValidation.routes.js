const { Router } = require("express");
const { verifyToken, isAutorized, isAdmin } = require("../middlewares/auth.Jwt");
const { getSetupValidations, createSetupValidation, updateQualityValidation, updateLeadHandValidation, updateRestartValidation, updateEndRunValidation } = require("../controllers/setupValidation.controller");
const router = Router();

// RUTA PARA OBTENER TODOS LOS SETUP VALIDATION CHECKLIST //
router.get(
    "/SetupValidations/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getSetupValidations
)

//RUTA PARA GENERAR UNA NUEVA VALIDACION //
router.post(
    "/CreateNewValidation/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    createSetupValidation
)

//RUTA PARA GUARDAR APARTADO INCIAL CALIDAD VALIDACION //
router.put(
    "/QualityValidation/:ValidationId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateQualityValidation
)

//RUTA PARA GUARDAR APARTADO INCIAL PRODUCCION VALIDACION //
router.put(
    "/LeadHandValidation/:ValidationId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateLeadHandValidation
)

//RUTA PARA GUARDAR REINICIOS VALIDACION //
router.put(
    "/Restart/:ValidationId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateRestartValidation
)

//RUTA PARA GUARDAR END RUN VALIDACION //
router.put(
    "/EndRun/:ValidationId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateEndRunValidation
)

module.exports = router;