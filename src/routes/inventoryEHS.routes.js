const { Router } = require("express");
const {
    createUbicacion, getUbicaciones, updateUbicacion, toggleUbicacionStatus,
    createComponente, getComponentes, updateComponente, deleteComponente,
    createProducto, getProductos, updateProducto, toggleProductoStatus,
    registrarIngreso, registrarTraspaso, getMovimientos, getBitacora
} = require("../controllers/inventoryEHS.controller");
const { verifyToken, isAutorized, isEHS } = require("../middlewares/auth.Jwt");
const router = Router();

// Ubicaciones
router.get("/ubicaciones/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getUbicaciones
);
router.post("/ubicaciones/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    createUbicacion
);
router.put("/ubicaciones/:id/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    updateUbicacion
);
router.patch("/ubicaciones/:id/toggle",
    verifyToken,
    toggleUbicacionStatus
);

// Componentes
router.get("/componentes/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getComponentes
);
router.post("/componentes/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    createComponente
);
router.put("/componentes/:id/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    updateComponente
);
router.delete("/componentes/:id/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    deleteComponente
);

// Productos
router.get("/productos/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getProductos
);
router.post("/productos/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    createProducto);
router.put("/productos/:id/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    updateProducto
);
router.patch("/productos/:id/toggle/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    toggleProductoStatus
);

// Movimientos
router.post("/ingreso",
    verifyToken,
    registrarIngreso
);
router.post("/traspaso",
    verifyToken,
    registrarTraspaso
);
router.get("/movimientos/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getMovimientos
);

// Bitácora / Auditoría de Sistema
router.get("/bitacora/:CompanyId",
    verifyToken,
    isAutorized,
    isEHS,
    getBitacora);

module.exports = router;