const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import { Schema, model } from "mongoose";


const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    direction: {
      type: String,
    },
    location: {
      type: String,
    },
   
  }
);

// export default model("Company", companySchema);
module.exports = mongoose.model("Company", companySchema);