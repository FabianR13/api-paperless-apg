const { Router } = require("express");
const { createQUARequest, getAllRegisters, updateRegisters } = require("../controllers/quarantine.controller");
const { verifyToken, isAutorized} = require("../middlewares/auth.Jwt");

const router = Router();
router.post("/NewRecord/:CompanyId",
    verifyToken,
    isAutorized,
    createQUARequest
);

router.get("/GetRecords/:CompanyId",
    verifyToken,
    isAutorized,
    getAllRegisters
);

router.put("/updateRegisters/:CompanyId/:moveID",
    verifyToken,
    isAutorized,
    updateRegisters
);
module.exports = router;
