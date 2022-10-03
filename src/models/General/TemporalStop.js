const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const temnporalStopSchema = new mongoose.Schema(
    {
        date1:{
            type:Date,
        },
        date2:{
            type:Date,
        },
        date3:{
            type:Date,
        },
        timeStart:{
            type:String,
        },
        turn:{
            type:String,
        },
        initalValidation:{
            type:String,
        },
       
        newSendPart:{
            type:String,
        },
        workStation:{
            type:String,
        },
      
        noCheckValidation:{
            type:Number,
        },
        company:[{
            ref:"Company",
            type: mongoose.Schema.Types.ObjectId,
        }],
        employeeT:{
            type:String,
        },
        employeeQ:{
            type:String,
        },
        employeeP:{
            type:String,
        },
     
        status:{
            type:Boolean,
        },
        
    }
)
// export default model("TemporalStop", temnporalStopSchema);
module.exports = mongoose.model("TemporalStop", temnporalStopSchema);