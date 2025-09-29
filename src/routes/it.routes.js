const { Router } = require("express");
const { isAdmin, isAutorized, verifyToken } = require("../middlewares/auth.Jwt");
const {
    createNewLaptop,
    getAllLaptops,
    updateLaptop,
    uploadLaptopLetter,
    createNewGenericAccount,
    getAllGenericAccounts,
    updateGenericAccount,
    createNewLine,
    getAllLines,
    updateLine,
    createNewCellphone,
    getAllCellphones,
    updateCellphone,
    uploadCellphoneLetter,
    createNewAccounts,
    getAllAccounts,
    updateAccounts,
    uploadAccountsLetter,
    getDirectory,
    createNewMonitor,
    getAllMonitors,
    updateMonitor,
    createNewLabelPrinter,
    getAllLabelPrinters,
    updateLabelPrinter,
    createNewChromebook,
    getAllChromebooks,
    updateChromebook,
    createNewScanner,
    getAllScanners,
    updateScanner,
    createNewServiceDay,
    getScheduledService,
    updateServiceDay
} = require("../controllers/it.controler");
const uploadLaptopFile = require("../middlewares/uploadLaptopFile.js");
const uploadCellphoneFile = require("../middlewares/uploadCellphoneFile.js");
const uploadAccountsFile = require("../middlewares/uploadAccountsFile.js");
const uploadFaqImages = require("../middlewares/uploadFaqImg.js");
const { createFaq, getAllFaqs } = require("../controllers/faq.controller.js");
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

// Route to save new line///
router.post(
    "/NewLine/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    createNewLine
);

// Route to get All the lines///
router.get(
    "/Lines/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getAllLines
);

// Route to update generic account///
router.put(
    "/UpdateLine/:lineId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateLine
);

// Route to save new cellphone///
router.post(
    "/NewCellphone/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    createNewCellphone
);

// Route to get All the cellphones///
router.get(
    "/Cellphones/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getAllCellphones
);

// Route to update cellphone///
router.put(
    "/UpdateCellphone/:cellphoneId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateCellphone
);

//upload cellphone responsibe letter///
router.put(
    "/UploadCellphoneLetter/:cellphoneId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    uploadCellphoneFile,
    uploadCellphoneLetter
);

// Route to save new accounts///
router.post(
    "/NewAccounts/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    createNewAccounts
);

// Route to get All the accounts///
router.get(
    "/Accounts/:accountStatus/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getAllAccounts
);

// Route to update accounts///
router.put(
    "/UpdateAccounts/:accountsId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateAccounts
);

//upload cellphone responsibe letter///
router.put(
    "/UploadAccountsLetter/:accountsId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    uploadAccountsFile,
    uploadAccountsLetter
);

// Route to get All the accounts///
router.get(
    "/Directory/:CompanyId",
    getDirectory
);

// Route to save new monitor///
router.post(
    "/NewMonitor/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    createNewMonitor
);

// Route to get All the Monitors///
router.get(
    "/Monitors/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getAllMonitors
);

// Route to update cellphone///
router.put(
    "/UpdateMonitor/:monitorId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateMonitor
);

//////    RUTAS PARA IMPRESORAS DE ETIQUETAS    ///////////////////////////////////////

// Route to save new label printer///
router.post(
    "/NewLabelPrinter/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    createNewLabelPrinter
);

// Route to get All the LABEL PRINTERS///
router.get(
    "/LabelPrinters/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getAllLabelPrinters
);

// Route to update label printer///
router.put(
    "/UpdateLabelPrinter/:labelPrinterId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateLabelPrinter
);

//////    RUTAS PARA Chromebooks   ///////////////////////////////////////

// Route to save new chromebook///
router.post(
    "/NewChromebook/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    createNewChromebook
);

// Route to get All the chromebooks///
router.get(
    "/Chromebooks/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getAllChromebooks
);

// Route to update chromebook///
router.put(
    "/UpdateChromebook/:chromebookId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateChromebook
);

//////    RUTAS PARA Scanner   ///////////////////////////////////////

// Route to save new scanner///
router.post(
    "/NewScanner/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    createNewScanner
);

// Route to get All the scanner///
router.get(
    "/Scanners/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    getAllScanners
);

// Route to update scanner///
router.put(
    "/UpdateScanner/:scannerId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateScanner
);

///Route to Post a New Kaizen///
router.post("/NewFaq/:CompanyId",
    uploadFaqImages,
    createFaq
);

// Route to get All the scanner///
router.get(
    "/Faqs/:CompanyId",
    getAllFaqs
);

// Route to save new service day///
router.post(
    "/NewServiceDay/:CompanyId",
    createNewServiceDay
);

// Route to get All the service days///
router.get(
    "/ServiceDays/:CompanyId",
    getScheduledService
);

router.put(
    "/UpdateServiceDay/:ServiceDayId/:CompanyId",
    verifyToken,
    isAutorized,
    isAdmin,
    updateServiceDay
);

module.exports = router;