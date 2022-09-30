const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const endRunSchema = new Schema(
    {
        verWatherMold:{
            type:String,
        },
        temperatures:{
            type:String,
        },
        lastPieces:{
            type:String,
        },
        cleanMold:{
            type:String,
        },
        watherConection:{
            type:String,
        },
        machinePurge:{
            type:String,
        },
        labelEnclosed:{
            type:String,
        },
        numberOrder:{
            type:String,
        },
        shootCounter:{
            type:String,
        },
        employeeT:[
            {
                ref:"User",
                type:Schema.Types.ObjectId,
            }
        ],
        dateT:{
            type:Date,
        },
        hours:{
            type:String,
        },


        lastPiecesTaken:{
            type:String,
        },
        removeDocument:{
            type:String,
        },
        motiveStopMachine:{
            type:String,
        },
        employeeQ:[{
            ref:"User",
            type:Schema.Types.ObjectId,
        }],
        dateQ:{
            type:Date,
        },

        tools:{
            type:String,
        },
        workStationClean:{
            type:String,
        },
        formatAcumulation:{
            type:String,
        },
        aditionalComments:{
            type:String,
        },
       
       
        employeeP:[{
            ref:"User",
            type:Schema.Types.ObjectId,
        }],
        
       
        dateP:{
            type:Date,
        },
       
      
   
        status:{
            type:Boolean,
        },
        company:[
            {
                ref:"Company",
                type:Schema.Types.ObjectId,
            }
        ],
        noCheckValidation:{
            type:Number,
        },
    }
)
export default model("EndRun", endRunSchema);