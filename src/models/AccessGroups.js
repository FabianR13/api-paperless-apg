const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const accessGroupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        timeZone: {
            idZKTeco: { type: Number, required: true }, // 1 = 24h, 2 = 6am-7pm, etc.
            description: { type: String }, // Ej. "24-Hour Access", "Día Entre Semana (06:00 - 19:00)"
        },
        doors: [
            {
                panelIp: { type: String, required: true },
                numeroRelevador: { type: Number, required: true }, // 1, 2, 3 o 4
                doorName: { type: String } // Se guarda para mostrarlo fácil en el frontend de Paperless
            }
        ],
        active: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = model("AccessGroup", accessGroupSchema);