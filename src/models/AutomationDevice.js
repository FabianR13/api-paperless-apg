const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    count: {
        type: Number,
        default: 0,
    },
}, { _id: false });

const clampingTypeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    hasMounting: {
        type: Boolean,
        default: false,
    },
}, { _id: false });

const nestTypeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    hasNest: {
        type: Boolean,
        default: false,
    },
}, { _id: false });

const typeOfVisualAidsSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    hasAids: {
        type: Boolean,
        default: false,
    },
}, { _id: false });

const AutomationDeviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        unique: true, // No permite repetidos
        sparse: true, // Permite que documentos antiguos no tengan el campo sin error de duplicado (null)
        trim: true
    },
    partNumber: {
        ref: "Parts",
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    customer:
    {
        ref: "Customer",
        type: mongoose.Schema.Types.ObjectId,
    },
    sensors: [sensorSchema],
    clampingType: [clampingTypeSchema],
    nestType: [nestTypeSchema],
    typeOfVisualAids: [typeOfVisualAidsSchema],
    company:
    {
        ref: "Company",
        type: mongoose.Schema.Types.ObjectId,
    },
    deviceStatus: {
        type: Boolean,
        default: true,
    },
    version: { type: Number, default: 1 }
}, {
    timestamps: true
});

module.exports = mongoose.model("AutomationDevice", AutomationDeviceSchema);