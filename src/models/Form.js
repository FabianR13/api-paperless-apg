const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import { Schema, model } from "mongoose";

const formSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,
    imgURL: String,
    description: String
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// export default model("Form", formSchema);
module.exports = mongoose.model("Form", formSchema);