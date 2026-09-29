const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const EHSUbicacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    status: {
        type: String,
        enum: ["Activo", "Inactivo"],
        default: "Activo"
    },

    createdBy: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },

    company: { type: Schema.Types.ObjectId, ref: "Company" },

    modifiedBy: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("EHSUbicacion", EHSUbicacionSchema);