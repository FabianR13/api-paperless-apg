const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import { Schema, model } from "mongoose";

// export const ROLES = [
//   "user",
//   "admin",
//   "moderador",
//   "GeneralR",
//   "GeneralRW",
//   "SetupR",
//   "SetupRW",
//   "QualityR",
//   "QualityRW",
//   "ProductionR",
//   "ProductionRW",
//   "OtherR",
//   "OtherRW",
//   "KaizenR",
//   "KaizenRW",
//   "KaizenApproval",
// ];

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },

  {
    versionKey: false,
  }
);

// export default model("Role", roleSchema);
module.exports = mongoose.model("Role", roleSchema);
