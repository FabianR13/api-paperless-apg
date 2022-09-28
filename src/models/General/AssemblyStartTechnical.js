
import {Schema, model} from "mongoose";

const assemblyStartTechnicalSchema = new Schema (
    {
        
        parameterSetting:{
            type:String,
        },
        revisionDate:{
            type:String,
        },
        repairMold:{
            type:String,
        },
        labelColor:{
            type:String,
        },
        ifRepair:{
            type:String,
        },
        orderJob:{
            type:String,
        },
        resinVerifiedDried:{
            type:String,
        },
        numberDryer:{
            tyep:String,
        },
        switchConected:{
            type:String,
        },
        comments:{
            type:String,
        },
        purgeMachine:{
            type:String,
        },
        
        containerRed:{
            type:String,
        },
        alarmsProgramed:{
            type:String,
        },
        
      
        moldWather:{
            type:String,
        },
        
        temperatures:{
            type:String,
        },
      
        transportBand:{
            type:String,
        },
        counterMachine:{
            type:String,
        },
        settingRobot:{
            type:String,
        },
        formatEmp:{
            type:String,
        },
        employee:[{
            ref:"User",
            type:Schema.Types.ObjectId,
        }],
       
        noCheckValidation:{
            type:Number,
        },
        status:{
            type:Boolean,
        },
        company:[{
            ref:"Company",
            type:Schema.Types.ObjectId,
        }],
    }
);
export default model ("assemblyStartTechnical", assemblyStartTechnicalSchema);