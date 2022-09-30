const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const partSchema =new Schema(
 
    {
        partnumber: [{ type: String },],
        partName: { 
            type: String, 
        },
        partEcl: { 
            type: String,
        },
        customer:[
            {
                ref: "Customer",
                type: Schema.Types.ObjectId,
            }
        ],
        company:[
            {
                ref: "Company",
                type: Schema.Types.ObjectId,
            }
        ],
        mould:{ 
            type:String,
        },
        status:{
            type:Boolean,
        },
        documents:{
            type:Array, 
        },

    }
);
export default model ("Parts", partSchema);