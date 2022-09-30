const ValidationSettings = require( "../../../models/General/ValidationSettings.js");
const Machine = require( "../../../models/Setup/Machine.js");
const User = require( "../../../models/User.js");
const Company = require( "../../../models/Company.js");
const AssemblyStartTechnical = require( "../../../models/General/AssemblyStartTechnical.js");
const AssemblyStartProduction = require( "../../../models/General/AssemblyStartProduction.js");
const AssemblyStartQuality = require( "../../../models/General/AssemblyStartQuality.js");
const TemporalStop = require( "../../../models/General/TemporalStop.js");
const EndRun = require( "../../../models/General/EndRun.js");
// import ValidationSettings from "../../../models/General/ValidationSettings.js";
// import Machine from "../../../models/Setup/Machine.js";
// import User from "../../../models/User.js";
// import Company from "../../../models/Company.js";
// import AssemblyStartTechnical from "../../../models/General/AssemblyStartTechnical.js";
// import AssemblyStartProduction from "../../../models/General/AssemblyStartProduction.js";
// import AssemblyStartQuality from "../../../models/General/AssemblyStartQuality.js";
// import TemporalStop from "../../../models/General/TemporalStop.js";
// import EndRun from "../../../models/General/EndRun.js";

//method to post 
const createValidationSettings = async (req, res) => {
    const {
        
        machine,
        assemblyPartNumber,
        date,
        timeStart,
        turn,
        moldInstalledBy,
        resin,
        timePrism,
        consecutive,
        assemblyStartTechnical,
        assemblyStartQuality,
        assmeblyStartProduction,
        temporalStop,
        company,
        status,
        endRun,  
        
    }= req.body;
    const newValidationSettings = new ValidationSettings({
        
        assemblyPartNumber,
        date,
        timeStart,
        turn,
        resin,
        timePrism,
        consecutive,
        temporalStop,
        status,
        
    });
    if (machine) {
        const foundMachines = await Machine.find({
            machineNumber: { $in: machine },
        });
        newValidationSettings.machine = foundMachines.map((machine) => machine._id);
      }
    if (moldInstalledBy) {
        const foundMoldInstalledBy = await User.find({
          username: { $in: moldInstalledBy },
        });
        newValidationSettings.moldInstalledBy = foundMoldInstalledBy.map((moldInstalledBy) => moldInstalledBy._id);
      }
      if (assemblyStartTechnical) {
        const foundAssemblyStarTechnical = await AssemblyStartTechnical.find({
            noCheckValidation: { $in: assemblyStartTechnical },
        });
        newValidationSettings.assemblyStartTechnical = foundAssemblyStarTechnical.map((assemblyStartTechnical) => assemblyStartTechnical._id);
      }

      if (assemblyStartQuality) {
        const foundAssemblyStartQuality = await AssemblyStartQuality.find({
            noCheckValidation: { $in: assemblyStartQuality },
        });
        newValidationSettings.assemblyStartQuality = foundAssemblyStartQuality.map((assemblyStartQuality) => assemblyStartQuality._id);
      }

      if (assmeblyStartProduction) {
        const foundAssemblyStartProduction= await AssemblyStartProduction.find({
            noCheckValidation: { $in: assmeblyStartProduction },
        });
        newValidationSettings.assmeblyStartProduction = foundAssemblyStartProduction.map((assmeblyStartProduction) => assmeblyStartProduction._id);
      }
      if (temporalStop) {
        const foundAssemblyTemporalStop= await TemporalStop.find({
            noCheckValidation: { $in: temporalStop },
        });
        newValidationSettings.temporalStop = foundAssemblyTemporalStop.map((temporalStop) => temporalStop._id);
      }

      if (company) {
        const foundCompany = await Company.find({
          _id: { $in: company },
        });
        newValidationSettings.company = foundCompany.map((company) => company._id);
      }

      if (endRun) {
        const foundEndRun= await EndRun.find({
            noCheckValidation: { $in: endRun },
        });
        newValidationSettings.endRun = foundEndRun.map((endRun) => endRun._id);
      }
      





    const savedValidationSettings = await newValidationSettings.save();
    console.log(savedValidationSettings);
    res.json({status:"200", message:"validation settings created", savedValidationSettings});
}
//method to update 
const updateValidationSetting = async (req,res) => {
    const {validationSettingId} = req.params;


    if(!req.body.machine) {
        return res.json({status:"403", message:"the machine is empty", body:""});
      }
     
      const foundMachine = await Machine.find({
        machineNumber:{$in: req.body.machine},
      });
    //   console.log(foundMachine.length);
      if(foundMachine.length === 0){
          return res.json({status:"403", message:"not machine founded", body:""});
      }
    const machine = foundMachine.map((machine) => machine._id);

    
    if(!req.body.moldInstalledBy) {
        return res.json({status:"403", message:"the machine is empty", body:""});
      }
     
      const foundMoldInstalledBy = await User.find({
        username:{$in: req.body.moldInstalledBy},
      });
    //   console.log(foundMoldInstalledBy.length);
      if(foundMoldInstalledBy.length === 0){
          return res.json({status:"403", message:"not machine founded", body:""});
      }
    const moldInstalledBy = foundMoldInstalledBy.map((moldInstalledBy) => moldInstalledBy._id);



    
    if(!req.body.assemblyStartTechnical) {
        return res.json({status:"403", message:"the machine is empty", body:""});
      }
     
      const foundAssemblyStartTechnical = await AssemblyStartTechnical.find({
        noCheckValidation:{$in: req.body.assemblyStartTechnical},
      });
    //   console.log(foundAssemblyStartTechnical.length);
      if(foundAssemblyStartTechnical.length === 0){
          return res.json({status:"403", message:"not machine founded", body:""});
      }
    const assemblyStartTechnical = foundAssemblyStartTechnical.map((assemblyStartTechnical) => assemblyStartTechnical._id);


    if(!req.body.assemblyStartQuality) {
        return res.json({status:"403", message:"the machine is empty", body:""});
      }
     
      const foundAssemblyStartQuality = await AssemblyStartQuality.find({
        noCheckValidation:{$in: req.body.assemblyStartQuality},
      });
    //   console.log(assemblyStartQuality.length);
      if(foundAssemblyStartQuality.length === 0){
          return res.json({status:"403", message:"not machine founded", body:""});
      }
    const assemblyStartQuality = foundAssemblyStartQuality.map((assemblyStartQuality) => assemblyStartQuality._id);



    if(!req.body.assmeblyStartProduction) {
        return res.json({status:"403", message:"the machine is empty", body:""});
      }
     
      const foundAssemblyStartProduction = await AssemblyStartProduction.find({
        noCheckValidation:{$in: req.body.assmeblyStartProduction},
      });
    //   console.log(assmeblyStartProduction.length);
      if(foundAssemblyStartProduction.length === 0){
          return res.json({status:"403", message:"not machine founded", body:""});
      }
    const assmeblyStartProduction = foundAssemblyStartProduction.map((assmeblyStartProduction) => assmeblyStartProduction._id);


    if(!req.body.temporalStop) {
        return res.json({status:"403", message:"the machine is empty", body:""});
      }
     
      const foundTemporalStop = await TemporalStop.find({
        noCheckValidation:{$in: req.body.temporalStop},
      });
    //   console.log(temporalStop.length);
      if(foundTemporalStop.length === 0){
          return res.json({status:"403", message:"not machine founded", body:""});
      }
    const temporalStop = foundTemporalStop.map((temporalStop) => temporalStop._id);



    if(!req.body.endRun) {
        return res.json({status:"403", message:"the machine is empty", body:""});
      }
     
      const foundEndRun = await EndRun.find({
        noCheckValidation:{$in: req.body.endRun},
      });
    //   console.log(endRun.length);
      if(foundEndRun.length === 0){
          return res.json({status:"403", message:"not machine founded", body:""});
      }
    const endRun = foundEndRun.map((endRun) => endRun._id);



    const {
        
        assemblyPartNumber,
        date,
        timeStart,
        turn,        
        resin,
        timePrism,
        consecutive,
        status,
        
    } = req.body;
    const updatedValidationSetting = await ValidationSettings.updateOne(
        {_id: validationSettingId},
        {$set:{
            machine,
            assemblyPartNumber,
            date,
            timeStart,
            turn,
            moldInstalledBy,
            resin,
            timePrism,
            consecutive,
            assemblyStartTechnical,
            assemblyStartQuality,
            assmeblyStartProduction,
            temporalStop,
            
            status,
            endRun,  
        },
    }
    );
    if(!updatedValidationSetting){
        res.status(403).json({status:"403",message:"validqation settings not updated", body:""});
    }
    res.status(200).json({status:"200", message:"validation settings updated", body:updatedValidationSetting});
}
//mthod to get
const getValidationSetting = async (req, res) =>{
    const validationSetting = await ValidationSettings.find().sort({
        number:1,
      
    });
    res.json({status:"200", message:"validationSetting loaded", body: validationSetting});
}

module.exports = {
  createValidationSettings,
  updateValidationSetting,
  getValidationSetting
};