const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const assemblyStartQualitySchema = new Schema(
    {
        sheetVerification:{
            type:String,
        },
        numberDevitaion:[
            {
                ref:"DeviationRequest",
                type:Schema.Types.ObjectId,
            }
        ],
        moldRepairs:{
            type:String,
        },
      
        orderJob:{
            type:String,
        },
        materialVerified:{
            type:String,
        },
        numberDryer:{
            type:String,
        },
        technicalVal:{
            type:String,
        },
        comments:{
            type:String,
        },
        alarms:{
            type:String,
        },
        temperatures:{
            type:String,
        },
     
       
        
       
       employee:[{
        ref:"Users",
        type:Schema.Types.ObjectId,
       }],
        status:{
            type:Boolean,
        },
        noCheckValidation:{
            type:Number,
        },
        company:[
            {
                ref:"Company",
                type:Schema.Types.ObjectId,
            }
        ],
    }
)
export default model("AssemblyStartQuality",assemblyStartQualitySchema);