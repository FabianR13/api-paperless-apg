const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const assemblyStartQualitySchema = new mongoose.Schema(
    {
        sheetVerification:{
            type:String,
        },
        numberDevitaion:[
            {
                ref:"DeviationRequest",
                type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
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
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
    }
)
// export default model("AssemblyStartQuality",assemblyStartQualitySchema);
module.exports = mongoose.model("AssemblyStartQuality",assemblyStartQualitySchema);