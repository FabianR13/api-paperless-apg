const { Router } = require("express");
const { verifyToken, isAutorized, isAdmin } = require("../middlewares/auth.Jwt");
const { getptInspections, createptInspection, updatePhysicalQty, addRow, updateRow, completeInspection } = require("../controllers/ptInspection.controller");
const router = Router();

router.get('/PTInspection/:CompanyId',
    verifyToken,
    isAutorized,
    isAdmin,
    getptInspections
);
router.post('/NewPTInspection/:CompanyId',
    verifyToken,
    isAutorized,
    isAdmin,
    createptInspection
);
router.put('/UpdateQty/:id/:CompanyId',
    verifyToken,
    isAutorized,
    isAdmin,
    updatePhysicalQty
);
router.put('/AddRow/:id/:CompanyId',
    verifyToken,
    isAutorized,
    isAdmin,
    addRow
);
router.put('/UpdateRow/:id/:rowIndex/:CompanyId',
    verifyToken,
    isAutorized,
    isAdmin,
    updateRow
);
router.put('/Complete/:id/:CompanyId',
    verifyToken,
    isAutorized,
    isAdmin,
    completeInspection
);

module.exports = router;