const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const partsInfoSchema = new Schema(
    {
        machine:{
            type:Number,
        },
        numberCavities:{
            type:String,
        },
        shotWeight:{
            type:String,
        },
        totalShotWeight:{
            type:String,
        },
        avgPartWeight:{
            type:String,
        },
        cycleTime:{
            type:String,
        },
        partsPerHour:{
            type:String,
        },
        company:[
            {
                ref: "Company",
                type: Schema.Types.ObjectId,
            }
        ],
        partnumber:[
            {
                ref:"Parts",
                type:Schema.Types.ObjectId,
            }
        ],
        cushion:{
            type:String,
        },
        recovery:{
            type:String,
        },
        fillTime:{
            type:String,
        },
        peakPress:{
            type:String,
        },
        status:{
            type:Boolean,
        },


    }
)
export default model("PartsInfo", partsInfoSchema);