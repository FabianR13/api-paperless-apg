const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const customerSchema = new Schema(
    {
        name:{
            type:String,
        },
    },
);
export default model ("Customer", customerSchema);
