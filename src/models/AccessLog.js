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
        employee: { 
            type: Schema.Types.ObjectId, 
            ref: "Employees" // Enlace a tu modelo de empleados (lo llenaremos al guardar)
        }
    },
    { timestamps: true }
);

module.exports = model("AccessLog", accessLogSchema);