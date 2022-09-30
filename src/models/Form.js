const {Schema, model} = require("mongoose");
// import { Schema, model } from "mongoose";

const formSchema = new Schema(
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

export default model("Form", formSchema);
