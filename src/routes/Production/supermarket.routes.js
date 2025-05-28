const { Router } = require("express");
const { isAdmin, isAutorized, verifyToken, isSMReader, isSMAdministrator, isSMCreator, isSMSupplier } = require("../../middlewares/auth.Jwt.js");
const {
    createItems,
    getAllItems,
    createPedido,
    getAllPedidos,
    updatePedido,
    getRecentPedidos
} = require("../../controllers/Production/supermarket.controller.js");
const router = Router();

// Route to save new items///
router.post(
    "/AddMaterials/:CompanyId",
    verifyToken,
    isAutorized,
    isSMAdministrator,
    createItems
);

//route to get all items
router.get(
    "/Items/:CompanyId",
    verifyToken,
    isAutorized,
    isSMReader,
    getAllItems
);

// Route to save new pedido///
router.post(
    "/CrearPedido/:CompanyId",
    verifyToken,
    isAutorized,
    isSMCreator,
    createPedido
);

//route to get all pedidos
router.get(
    "/Pedidos/:CompanyId",
    verifyToken,
    isAutorized,
    isSMReader,
    getAllPedidos
);

//route to update pedido
router.put(
    "/UpdatePedido/:idPedido/:CompanyId",
    verifyToken,
    isAutorized,
    isSMSupplier,
    updatePedido
);

//route to get 24h pedidos
router.get(
    "/RecentPedidos/:CompanyId",
    verifyToken,
    isAutorized,
    isSMReader,
    getRecentPedidos
);

module.exports = router;