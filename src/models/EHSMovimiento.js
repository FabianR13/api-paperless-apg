const mongoose = require("mongoose");

const EHSMovimientoSchema = new mongoose.Schema({
    producto: {
        ref: "EHSProducto",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    tipo: {
        type: String,
        enum: ["Ingreso", "Traspaso", "Consumo médico"],
        required: true
    },

    lote: {
        type: String,
        trim: true
    },

    fechaCaducidad: {
        type: Date
    },

    cantidad: {
        type: Number,
        required: true
    },

    // Solo aplica para Ingreso
    ubicacionDestino: {
        ref: "EHSUbicacion",
        type: mongoose.Schema.Types.ObjectId
    },

    // Solo aplica para Traspaso
    ubicacionOrigen: {
        ref: "EHSUbicacion",
        type: mongoose.Schema.Types.ObjectId
    },

    factura: {
        type: String,
        trim: true
    },

    consulta: {
        ref: "ConsultaMedica",
        type: mongoose.Schema.Types.ObjectId
    },
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("EHSMovimiento", EHSMovimientoSchema);