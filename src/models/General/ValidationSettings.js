
import {Schema, model} from "mongoose";


const validationSettingsSchema = new Schema(
    {
     
       
        machine:[
            {
                ref:"Machine",
                type:Schema.Types.ObjectId,
            }
        ],
        assemblyPartNumber:{
            type: String,
        },
        date:{
            type:Date,
        },
        timeStart:{
            type:String,
        },
        turn:{
            type:String,
        },
       
       
        moldInstalledBy:[
            {
            ref:"User",
            type:Schema.Types.ObjectId
        }
            ],
        resin:{
            type:String,
        },
        timePrism:{
            type:String,
        },
      
        consecutive:{
            type:Number,
        },
        assemblyStartTechnical:[
            {
                ref:"AssemblyStarTechnical",
                type:Schema.Types.ObjectId,
            }
        ],
        assemblyStartQuality:[
            {
                ref:"AssemblyStartQuality",
                type:Schema.Types.ObjectId,
            }
        ],

        assmeblyStartProduction:[
            {
                ref:"AssemblyStartProduction",
                type:Schema.Types.ObjectId,
            }
        ],
        temporalStop:[
            {
                ref:"TemporalStop",
                type:Schema.Types.ObjectId,
            }
        ],
        company:[
            {
                ref:"Company",
                type:Schema.Types.ObjectId,
            }
        ],
        status:{
            type:String,
        },
        endRun:[
            {
                ref:"EndRun",
                type:Schema.Types.ObjectId,
            }
        ],
    }
)
export default model("ValidationSettings", validationSettingsSchema);