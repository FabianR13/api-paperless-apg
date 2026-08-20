const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const accessLogSchema = new Schema(
    {
        panelIp: { type: String, required: true },
        personnelId: { type: String },
        cardNumber: { type: String }, 
        doorNumber: { type: Number },
        eventType: { type: Number }, 
        verifiedTime: { type: Date, required: true }, 
    },
    { timestamps: true }
);

accessLogSchema.index(
    { panelIp: 1, personnelId: 1, verifiedTime: 1, doorNumber: 1, eventType: 1 },
    { unique: true }
);

module.exports = model("AccessLog", accessLogSchema);