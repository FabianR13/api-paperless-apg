import Router from "express";

const router =  Router();
import * as assemblyStartTechnicalController from "../../controllers/Forms/General/assemblyStartTechnical.controller.js";
import * as validationSettingsController from "../../controllers/Forms/General/validationSettings.controller.js";
import * as assemblyStartQualityController from "../../controllers/Forms/General/assmeblyStartQuality.controller.js";
import * as assemblyStartProductionController from "../../controllers/Forms/General/assemblyStartProduction.controller.js";
import * as temporalStopController from "../../controllers/Forms/General/temporalStop.controller.js";
import * as endRunController from "../../controllers/Forms/General/endRun.controller.js";



//method to post assembly Start
router.post(
    "/newAssemblyStartTechnical", assemblyStartTechnicalController.createAssemblyStartTechnial
);
//methos to post validations settings 
router.post (
    "/newValidationSettings", validationSettingsController.createValidationSettings
);
// method to post assmebly quality
router.post(
    "/newAssemblyStartQuality", assemblyStartQualityController.createAssemblyStartQuality
);
//method to post assembly production 
router.post (
    "/newAssemblyStartProduction", assemblyStartProductionController.createAssemblyStartProduction
);
//methos to post run data 
router.post(
    "/newTemporalStop", temporalStopController.createTemporalStop
);
//method to post change mold
router.post(
    "/newEndRun", endRunController.createEndRun
);


//IN HERE STARTS METHOD PUT 
//method to update change validation setting
router.put(
    "/updateValidationSettings/:validationSettingId", validationSettingsController.updateValidationSetting
);
//method to update assembly start
router.put(
    "/updateAssemblyStartsTechnicals/:assemblyStartTechnicalId", assemblyStartTechnicalController.updateAssemblyStartTechnical
);
//methos to updte assembly quality
router.put(
    "/updateAssemblyStartQualitys/:assemblyStartQualityId", assemblyStartQualityController.updateAssemblyStartQuality
);
//method to update assembly production
router.put(
    "/updateAssemblySP/:assemblyStartProductionId", assemblyStartProductionController.updateAssemblyStartProduction
);
//mehod to update mold reset
router.put(
    "/updateTemporalStops/:temporalStopId", temporalStopController.updateTemporalStop
);
//method to update Change Mold
router.put(
    "/updateEndRuns/:endRunId", endRunController.updateEndRun
);



//IN HERE STARTS METHOD GET
//method to get validation settings 
router.get(
    "/validationSetting", validationSettingsController.getValidationSetting
);
//method to get mold Reset 
router.get(
    "/temporalStop", temporalStopController.getTemporalStop
);
//method to get change mold 
router.get(
    "/endRun", endRunController.getEndRun
);
// method to get assembly quality
router.get(
    "/assemblyStartQuality", assemblyStartQualityController.getAssemblyStartQuality
);
// method to get assembly Start
router.get(
    "/assemblyStartTechnical", assemblyStartTechnicalController.getAssemblyStartTechnical
);
// method to get assembly production
router.get(
    "/assemblyStartProduction", assemblyStartProductionController.getAssemblyStartProduction
);
module.exports = router;