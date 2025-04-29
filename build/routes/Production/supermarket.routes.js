const {
  Router
} = require("express");

const {
  isAdmin,
  isAutorized,
  verifyToken
} = require("../../middlewares/auth.Jwt.js");

const {
  createItems,
  getAllItems,
  createPedido,
  getAllPedidos,
  updatePedido
} = require("../../controllers/Production/supermarket.controller.js");

const router = Router(); // Route to save new items///

router.post("/AddMaterials/:CompanyId", verifyToken, // isAutorized,
// isAdmin,
createItems); //route to get all items

router.get("/Items/:CompanyId", verifyToken, // isAutorized,
// isAdmin,
getAllItems); // Route to save new pedido///

router.post("/CrearPedido/:CompanyId", verifyToken, // isAutorized,
// isAdmin,
createPedido); //route to get all pedidos

router.get("/Pedidos/:CompanyId", verifyToken, // isAutorized,
// isAdmin,
getAllPedidos); //route to update pedido

router.put("/UpdatePedido/:idPedido/:CompanyId", verifyToken, // isAutorized,
// isAdmin,
updatePedido);
module.exports = router;