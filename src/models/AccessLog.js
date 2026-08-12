const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const accessLogSchema = new Schema(
    {
        panelIp: { type: String, required: true }, // Para saber de qué panel vino
        personnelId: { type: String }, // El número de empleado (ZKTeco lo llama PIN)
        cardNumber: { type: String }, 
        doorNumber: { type: Number }, // Puerta 1, 2, 3 o 4
        eventType: { type: Number }, // 0 = Acceso Normal, 27 = Sin Permiso, etc.
        verifiedTime: { type: Date, required: true }, // Fecha y hora exacta de la checada
    },
    { timestamps: true }
);

accessLogSchema.index(
    { panelIp: 1, personnelId: 1, verifiedTime: 1, doorNumber: 1, eventType: 1 },
    { unique: true }
);

module.exports = model("AccessLog", accessLogSchema);