const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 1. Esquema para los registros por turno (Fases 2, 3 y 4)
const inspectionRowSchema = new mongoose.Schema({
    shift: {
        type: String,
        required: true,
        enum: ['D', 'A', 'N']
    },
    deliveryDate: { type: String, },
    supervisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees', 
        required: true
    },
    deliveredQty: { type: Number, required: true },
    deliveredUnit: { type: String, enum: ['PIEZAS', 'PALLETS'], default: 'PALLETS' },
    ngParts: { type: Number },
    originalSerial: { type: String },
    partialSerial: { type: String },
    inspectedQty: { type: Number },
    inspectedUnit: { type: String, enum: ['PIEZAS', 'PALLETS'] },
    pickedQty: { type: Number },
    pickedUnit: { type: String, enum: ['PIEZAS', 'PALLETS'] },
    adjusmentSystem: { type: String, enum: ['REALIZADO', 'N/A'] },
    comments: { type: String }
});

// 2. Esquema Principal de la Solicitud (Fase 1)
const ptInspectionSchema = new mongoose.Schema({
    inspectionDate: { type: Date },
    completedDate: { type: Date },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    partId: { type: Schema.Types.ObjectId, ref: "Parts" },
    partPosition: { type: Number, required: true },
    batchInicial: { type: String },
    batchFinal: { type: String },
    instruction: { type: String },
    problemDescription: { type: String },
    totalInventorySystem: { type: Number },
    totalInventoryPhysical: { type: Number },
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Cancelled'],
        default: 'In Progress'
    },
    // Arreglo de subdocumentos para el historial de turnos
    inspectionDetails: [inspectionRowSchema]
}, {
    timestamps: true
});


module.exports = mongoose.model("PTInspection", ptInspectionSchema);