const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const machineSchema = new mongoose.Schema (
    {
        machineNumber:{
            type:Number,
        },
        machineZise:{
            type:String,
        },
        nozzleOrifice:{
            type:String,
        },
       
        nozzleRadius:{
            type:String,
        },
        nozzleType:{
            type:String,
        },
        partInfo:[
            {
                ref:"PartsInfo",
                type: mongoose.Schema.Types.ObjectId,
            }
        ], 
        company:[
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],

    }
)
// export default model("Machine", machineSchema);
module.exports = mongoose.model("Machine", machineSchema);