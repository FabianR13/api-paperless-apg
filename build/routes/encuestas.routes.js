const {
  Router
} = require("express");

const {
  createNewEncuestaComedor
} = require("../controllers/encuestas.controller");

const router = Router(); // Route to save new encuesta comedor///

router.post("/NewEncuestaComedor/:CompanyId", createNewEncuestaComedor);
module.exports = router;