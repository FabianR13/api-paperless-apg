const mongoose = require('mongoose')

const partsInfoSchema = new mongoose.Schema(
    {
        machine: {
            type: Number,
        },
        numberCavities: {
            type: String,
        },
        shotWeight: {
            type: String,
        },
        totalShotWeight: {
            type: String,
        },
        avgPartWeight: {
            type: String,
        },
        cycleTime: {
            type: String,
        },
        partsPerHour: {
            type: String,
        },
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        partnumber: [
            {
                ref: "Parts",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        cushion: {
            type: String,
        },
        recovery: {
            type: String,
        },
        fillTime: {
            type: String,
        },
        peakPress: {
            type: String,
        },
        status: {
            type: Boolean,
        },
    }
)

module.exports = mongoose.model("PartsInfo", partsInfoSchema);