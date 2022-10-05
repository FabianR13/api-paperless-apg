const mongoose = require('mongoose')

const validationSettingsSchema = new mongoose.Schema(
    {
        machine: [
            {
                ref: "Machine",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        assemblyPartNumber: {
            type: String,
        },
        date: {
            type: Date,
        },
        timeStart: {
            type: String,
        },
        turn: {
            type: String,
        },
        moldInstalledBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId
            }
        ],
        resin: {
            type: String,
        },
        timePrism: {
            type: String,
        },

        consecutive: {
            type: Number,
        },
        assemblyStartTechnical: [
            {
                ref: "AssemblyStarTechnical",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        assemblyStartQuality: [
            {
                ref: "AssemblyStartQuality",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        assmeblyStartProduction: [
            {
                ref: "AssemblyStartProduction",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        temporalStop: [
            {
                ref: "TemporalStop",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        status: {
            type: String,
        },
        endRun: [
            {
                ref: "EndRun",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
    }
)

module.exports = mongoose.model("ValidationSettings", validationSettingsSchema);