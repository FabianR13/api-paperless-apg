const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import { Schema, model } from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
  },

  {
    timestamps: true,

    versionKey: false,
  }
);

// export default model("Department", departmentSchema);
module.exports = mongoose.model("Department", departmentSchema);