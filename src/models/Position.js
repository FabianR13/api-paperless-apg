const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import { Schema, model } from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
  },

  {
    timestamps: true,

    versionKey: false,
  }
);

// export default model("Position", positionSchema);
module.exports = mongoose.model("Position", positionSchema);