const { Router } = require("express");
const {
    createUbicacion, getUbicaciones, updateUbicacion, toggleUbicacionStatus,
    createComponente, getComponentes, updateComponente, deleteComponente,
    createProducto, getProductos, updateProducto, toggleProductoStatus,
    registrarIngreso, registrarTraspaso, getMovimientos
} = require("../controllers/inventoryEHS.controller");
const { verifyToken, isAutorized } = require("../middlewares/auth.Jwt");
const router = Router();

// Ubicaciones
router.get("/ubicaciones/:CompanyId?", verifyToken, getUbicaciones);
router.post("/ubicaciones", verifyToken, createUbicacion);
router.put("/ubicaciones/:id", verifyToken, updateUbicacion);
router.patch("/ubicaciones/:id/toggle", verifyToken, toggleUbicacionStatus);

// Componentes
router.get("/componentes/:CompanyId?", verifyToken, getComponentes);
router.post("/componentes", verifyToken, createComponente);
router.put("/componentes/:id", verifyToken, updateComponente);
router.delete("/componentes/:id", verifyToken, deleteComponente);

// Productos
router.get("/productos/:CompanyId?", verifyToken, getProductos);
router.post("/productos", verifyToken, createProducto);
router.put("/productos/:id", verifyToken, updateProducto);
router.patch("/productos/:id/toggle", verifyToken, toggleProductoStatus);

// Movimientos
router.post("/ingreso", verifyToken, registrarIngreso);
router.post("/traspaso", verifyToken, registrarTraspaso);
router.get("/movimientos/:CompanyId?", verifyToken, getMovimientos);

module.exports = router;