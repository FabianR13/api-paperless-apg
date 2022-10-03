// const {Schema,} = require("mongoose");
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
// import { Schema, model } from "mongoose";
// import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    signature:{
      type:String,
    },
    roles: [
      {
        ref: "Role",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    rolesAxiom: [
      {
        ref: "Role",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    employee: [
      {
        ref: "Employees",
        type: mongoose.Schema.Types.ObjectId,
      },
      
    ],
    companyAccess:[
      {
          ref: "Company",
          type: mongoose.Schema.Types.ObjectId,
      }
  ],
    company:[
      {
          ref: "Company",
          type: mongoose.Schema.Types.ObjectId,
      }
  ],
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//Metodo para cifrar el dato y comparar contraseñas encryptPassword y Compare Password son nombre que asignamos manualmente
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};



userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

// export default model("User",userSchema);
module.exports = mongoose.model("User",userSchema);
