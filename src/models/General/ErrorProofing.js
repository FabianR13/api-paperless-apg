const mongoose = require("mongoose");

const ErrorProfingSchema = new mongoose.Schema({
    errorProofingName: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    startShift: {
        type: String,
    },
    startTechnician: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    endDate: {
        type: Date,
    },
    endShift: {
        type: String,
    },
    endTechnician: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    device: {
        type: String,
    },
    errorProofingStatus: {
        type: String,
    },
    consecutive: {
        type: Number,
    },
    company: [
        {
            ref: "Company",
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    version: {
        type: Number,
    },
    checklists: [{
        ref: "Checklist",
        type: mongoose.Schema.Types.ObjectId,
    },],
    checklistCounter: {
        type: Number,
        default: 0
    },
    qualityResponsible: [{
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },],
    qualityValidationDate: {
        type: Date,
        default: null
    },
    productionResponsible: [{
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },],
    productionValidationDate: {
        type: Date,
        default: null
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("ErrorProofing", ErrorProfingSchema);