const mongoose = require("mongoose");

const DevolucionSchema = new mongoose.Schema({
    idDevolucion: { type: String, required: true, unique: true },
    usuario: { // El Creador (SMCreator)
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    company: {
        ref: "Company",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "Items", required: true },
            serial: { type: [String], default: [] },
            quantities: { type: [Number], default: [] },
            totalQuantity: { type: Number, required: true },
            comment: { type: String, default: "" }
        }
    ],
    // --- NUEVOS CAMPOS DE ESTATUS Y FLUJO ---
    dStatus: { 
        type: String, 
        required: true, 
        default: 'started', 
        enum: ['started', 'confirmed', 'rejected', 'validated'] 
    },
    confirmedBy: { ref: "User", type: mongoose.Schema.Types.ObjectId, default: null }, // Quién confirmó (Creator)
    rejectedBy: { ref: "User", type: mongoose.Schema.Types.ObjectId, default: null },  // Quién rechazó (Supplier)
    validatedBy: { ref: "User", type: mongoose.Schema.Types.ObjectId, default: null }, // Quién validó (Supplier)
    rejectionReason: { type: String, default: null }, // Motivo de rechazo
    // ----------------------------------------
    creationTime: { type: String },
    actionTime: { type: String }, // Hora de última acción (validación/rechazo)
    fecha: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model("Devolucion", DevolucionSchema);