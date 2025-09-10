const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema para los sensores
const SensorChecklistItemSchema = new Schema({
    label: { type: String },
    quantityOk: { type: Number, default: 0 },
    quantityNotOk: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
    comments: { type: String, default: '' }
}, { _id: false });

// Schema para las categorías con 'status' (clamping, nidos, visual)
const StatusChecklistItemSchema = new Schema({
    label: { type: String },
    status: { type: String, enum: ['Ok', 'No Ok', ''], default: '' },
    comments: { type: String, default: '' }
}, { _id: false });

// Schema principal del Checklist
const ChecklistSchema = new Schema({
    sensors: [SensorChecklistItemSchema],
    clamping: [StatusChecklistItemSchema],
    nidos: [StatusChecklistItemSchema],
    visual: [StatusChecklistItemSchema],
    automationResponsible: [{
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    }],
    automationValidationDate: {
        type: Date,
        default: null
    },
    consecutive: {
        type: Number,
    },
    createdBy: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    generalComments: { type: String, default: '' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Checklist', ChecklistSchema);