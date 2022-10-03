const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import { Schema, model } from "mongoose";

const dashboardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    back: {
      type: String,
    },
    pos: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

// export default model("Dashboard", dashboardSchema);
module.exports = mongoose.model("Dashboard", dashboardSchema);