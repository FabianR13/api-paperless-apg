const {
  Router
} = require("express");

const router = Router();

const {
  verifyToken,
  isAutorized
} = require("../../middlewares/auth.Jwt.js");

const {
  getEvaluation1Template
} = require("../../controllers/Forms/Setup/process.controller.js"); ///Route to get evaluation 1///


router.get("/ProcessEvaluation1/Template/:CompanyId", verifyToken, isAutorized, getEvaluation1Template);
module.exports = router;