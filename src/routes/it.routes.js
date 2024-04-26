const { Router } = require("express");
const { isAdmin, isAutorized, verifyToken } = require("../middlewares/auth.Jwt");
const { createNewLaptop,
    getAllLaptops,
    updateLaptop,
    uploadLaptopLetter,
    createNewGenericAccount,
    getAllGenericAccounts,
    updateGenericAccount
} = require("../controllers/it.controler");
const uploadLaptopFile = require("../middlewares/uploadLaptopFile.js");
const router = Router();

// Route to save new laptop///
router.post(
    "/NewLaptop/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    createNewLaptop
);

// Route to get All the requisitions///
router.get(
    "/Laptops/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getAllLaptops
);

// Route to update laptop///
router.put(
    "/UpdateLaptop/:laptopId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateLaptop
);

//upload laptop responsibe letter///
router.put(
    "/UploadLaptopLetter/:laptopId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    uploadLaptopFile,
    uploadLaptopLetter
);

// Route to save new generic accounts///
router.post(
    "/NewGenericAccount/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    createNewGenericAccount
);

// Route to get All the generic accounts///
router.get(
    "/GenericAccounts/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getAllGenericAccounts
);

// Route to update generic account///
router.put(
    "/UpdateGenericAccount/:accountId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateGenericAccount
);
module.exports = router;