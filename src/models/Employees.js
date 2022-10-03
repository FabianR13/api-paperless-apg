const mongoose = require('mongoose')
// const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const employeesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        numberEmployee: {
            type: String,
            required: true,
            unique: true,
        },
        department: [
            {
                ref: "Department",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        position: [
            {
                ref: "Position",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        active:{
            type: Boolean,

        },
        picture:{
            type:String
        },
        user:{
            type: Boolean
        },
        company:[
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        
    }
);
    // export default model ("Employees", employeesSchema);
    module.exports = mongoose.model("Employees", employeesSchema);