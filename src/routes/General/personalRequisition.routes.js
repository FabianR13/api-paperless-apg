const { Router } = require("express");
const router = Router();
const {
    verifyToken,
    isAutorized,
    isPersonalReqC
} = require("../../middlewares/auth.Jwt.js");
const {sendEmailMiddlewareResponse} = require("../../middlewares/mailer.js");
const { createPersonalRequisition } = require("../../controllers/Forms/General/personalRequisition.controller.js");

//Ruta para postear una nueva requisicion
router.post("/NewPersonalRequisition/:CompanyId",
    verifyToken,
    isAutorized,
    isPersonalReqC,
    createPersonalRequisition
);

module.exports = router;