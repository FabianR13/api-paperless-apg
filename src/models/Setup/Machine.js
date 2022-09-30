const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const machineSchema = new Schema (
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
                type:Schema.Types.ObjectId,
            }
        ], 
        company:[
            {
                ref: "Company",
                type: Schema.Types.ObjectId,
            }
        ],

    }
)
export default model("Machine", machineSchema);