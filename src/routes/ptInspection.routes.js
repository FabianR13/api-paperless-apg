const { Router } = require("express");
const { verifyToken, isAutorized, isAdmin } = require("../middlewares/auth.Jwt");
const { getptInspections, createptInspection } = require("../controllers/ptInspection.controller");
const router = Router();

router.get('/PTInspection/:CompanyId',
    verifyToken,
    isAutorized,
    isAdmin,
    getptInspections
)

router.post('/NewPTInspection/:CompanyId',
    verifyToken,
    isAutorized,
    isAdmin,
    createptInspection
)



module.exports = router;