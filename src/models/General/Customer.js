const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name:{
            type:String,
        },
    },
);
// export default model ("Customer", customerSchema);
module.exports = mongoose.model ("Customer", customerSchema);