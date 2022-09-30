const {Schema, model} = require("mongoose");
// import { Schema, model } from "mongoose";

const positionSchema = new Schema(
  {
    name: String,
    description: String,
  },

  {
    timestamps: true,

    versionKey: false,
  }
);

export default model("Position", positionSchema);