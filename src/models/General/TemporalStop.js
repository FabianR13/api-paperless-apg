const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const temnporalStopSchema = new Schema(
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
            type:Schema.Types.ObjectId,
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
export default model("TemporalStop", temnporalStopSchema);