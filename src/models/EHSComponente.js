const mongoose = require("mongoose");

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
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("EHSComponente", EHSComponenteSchema);