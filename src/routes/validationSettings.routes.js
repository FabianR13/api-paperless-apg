const { Router } = require("express");
const router = Router();
const {
    createAssemblyStartTechnial,
    updateAssemblyStartTechnical,
    getAssemblyStartTechnical
} = require("../controllers/assemblyStartTechnical.controller.js");
const {
    createAssemblyStartProduction,
    updateAssemblyStartProduction,
    getAssemblyStartProduction
} = require("../controllers/assemblyStartProduction.controller.js");
const {
    createAssemblyStartQuality,
    updateAssemblyStartQuality,
    getAssemblyStartQuality
} = require("../controllers/assmeblyStartQuality.controller.js");
const {
    createValidationSettings,
    updateValidationSetting,
    getValidationSetting
} = require("../controllers/validationSettings.controller.js");
const {
    createTemporalStop,
    updateTemporalStop,
    getTemporalStop
} = require("../controllers/temporalStop.controller.js");
const {
    createEndRun,
    updateEndRun,
    getEndRun
} = require("../controllers/endRun.controller.js");

///method to post assembly Start///
router.post(
    "/newAssemblyStartTechnical", 
    createAssemblyStartTechnial
);
///methos to post validations settings ///
router.post(
    "/newValidationSettings",
    createValidationSettings
);
///method to post assmebly quality///
router.post(
    "/newAssemblyStartQuality",
    createAssemblyStartQuality
);
//method to post assembly production ///
router.post(
    "/newAssemblyStartProduction",
    createAssemblyStartProduction
);
//methos to post run data ///
router.post(
    "/newTemporalStop",
    createTemporalStop
);
//method to post change mold///
router.post(
    "/newEndRun",
    createEndRun
);
//IN HERE STARTS METHOD PUT 
//method to update change validation setting///
router.put(
    "/updateValidationSettings/:validationSettingId",
    updateValidationSetting
);
//method to update assembly start///
router.put(
    "/updateAssemblyStartsTechnicals/:assemblyStartTechnicalId", 
    updateAssemblyStartTechnical
);
//methos to updte assembly quality///
router.put(
    "/updateAssemblyStartQualitys/:assemblyStartQualityId",
    updateAssemblyStartQuality
);
//method to update assembly production///
router.put(
    "/updateAssemblySP/:assemblyStartProductionId",
    updateAssemblyStartProduction
);
//mehod to update mold reset///
router.put(
    "/updateTemporalStops/:temporalStopId",
    updateTemporalStop
);
//method to update Change Mold///
router.put(
    "/updateEndRuns/:endRunId",
    updateEndRun
);
//IN HERE STARTS METHOD GET
//method to get validation settings ///
router.get(
    "/validationSetting",
    getValidationSetting
);
//method to get mold Reset ///
router.get(
    "/temporalStop",
    getTemporalStop
);
//method to get change mold ////
router.get(
    "/endRun",
    getEndRun
);
// method to get assembly quality////
router.get(
    "/assemblyStartQuality",
    getAssemblyStartQuality
);
// method to get assembly Start///
router.get(
    "/assemblyStartTechnical", 
    getAssemblyStartTechnical
);
// method to get assembly production///
router.get(
    "/assemblyStartProduction",
    getAssemblyStartProduction
);

module.exports = router;