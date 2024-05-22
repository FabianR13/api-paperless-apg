const mongoose = require('mongoose')

const linesSchema = new mongoose.Schema(
    {
        number: {
            type: Number,
            required: true,
            unique: true,
        },
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
        iccid: {
            type: String,
        },
        planName: {
            type: String,
        },
        status: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
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

module.exports = mongoose.model("Lines", linesSchema);





