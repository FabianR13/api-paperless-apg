const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import { Schema, model } from "mongoose";

const formsSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    back: String,
    dashboard: [
      {
        ref: "Dashboard",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// export default model("Forms", formsSchema);
module.exports = mongoose.model("Forms", formsSchema);
