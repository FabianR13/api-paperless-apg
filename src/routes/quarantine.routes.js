const { Router } = require("express");
const { createQUARequest, getAllRegisters, updateRegisters, releaseFromQuarantine } = require("../controllers/quarantine.controller");
const { verifyToken, isAutorized, isQuarantineC, isQuarantineR} = require("../middlewares/auth.Jwt");

const router = Router();
router.post("/NewRecord/:CompanyId",
    verifyToken,
    isAutorized,
    isQuarantineC,
    createQUARequest
);

router.get("/GetRecords/:CompanyId",
    verifyToken,
    isAutorized,
    isQuarantineR,
    getAllRegisters
);

router.put("/updateRegisters/:CompanyId/:moveID",
    verifyToken,
    isAutorized,
    isQuarantineC,
    updateRegisters
);

router.put("/release/:CompanyId",
    verifyToken,
    isAutorized,
    isQuarantineC,
    releaseFromQuarantine
);

module.exports = router;
