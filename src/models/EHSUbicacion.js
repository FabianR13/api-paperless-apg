const mongoose = require("mongoose");

const EHSUbicacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
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

    modifiedBy: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("EHSUbicacion", EHSUbicacionSchema);