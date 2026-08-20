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
            idZKTeco: { type: Number, required: true },
            description: { type: String },
        },
        doors: [
            {
                panelIp: { type: String, required: true },
                numeroRelevador: { type: Number, required: true }, 
                doorName: { type: String } 
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