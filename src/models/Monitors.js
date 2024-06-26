const mongoose = require('mongoose')

const monitorSchema = new mongoose.Schema(
    {
        monitorName: {
            type: String,
        },
        responsible: [
            {
                ref: "Employees",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        responsibleAlt: {
            type: String,
        },
        responsibleGroup: [
            {
                ref: "GenericAccount",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        modifiedBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        modified: {
            type: Boolean,
        },
        location: {
            type: String,
        },
        marca: {
            type: String,
        },
        model: {
            type: String,
        },
        serialNo: {
            type: String,
        },
        status: {
            type: String,
        },
        version: {
            type: Number,
        },
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Monitor", monitorSchema);





