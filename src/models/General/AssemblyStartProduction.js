import {Schema, model} from "mongoose";
const assemblyStartProductionSchema = new Schema(
    {
        trainOperator:{
            type:String,
        },
        materialsRemoved:{
            type:String,
        },
        comments:{
            type:String,
        },
        packingComponents:{
            type:String,
        },
        workStation:{
            type:String,
        },
        containerScrap:{
            type:String,
        },
        docEstation:{
            type:String,
        },
        correctComponent:{
            type:String,
        },
        workCell:{
            type:String,
        },
        aditionalComments:{
            type:String,
        },
      
       
        employee:[
            {
                ref:"User",
                type:Schema.Types.ObjectId,
            }
        ],
       
        status:{
            type:Boolean,
        },
        noCheckValidation:{
            type:Number,
        },
        company:[{
            ref:"Company",
            type:Schema.Types.ObjectId,
        }],

    }
)
export default model ("AssemblyStartProduction", assemblyStartProductionSchema);