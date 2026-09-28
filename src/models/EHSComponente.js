const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EHSComponenteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },

    concentracion: {
        type: String,
        trim: true
    },

    createdBy: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },

    modifiedBy: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    company: { type: Schema.Types.ObjectId, ref: "Company" },

}, {
    timestamps: true
});

module.exports = mongoose.model("EHSComponente", EHSComponenteSchema);