const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChecklistItemSchema = new Schema({
    itemId: { type: String, required: true },
    label: { type: String }, // Guardemos también la etiqueta, es útil
    quantityOk: { type: Number, default: 0 },
    quantityNotOk: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
    operationOk: { type: Number, default: 0 },
    operationNotOk: { type: Number, default: 0 },
    comments: { type: String, default: '' }
}, { _id: false });

// Schema principal del Checklist
const ChecklistSchema = new Schema({
    sensors: [ChecklistItemSchema],
    clamping: [ChecklistItemSchema],
    nidos: [ChecklistItemSchema],
    visual: [ChecklistItemSchema],
    consecutive: {
        type: Number,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Checklist', ChecklistSchema);