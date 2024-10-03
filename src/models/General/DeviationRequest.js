const mongoose = require('mongoose')

const deviationRequestSchema = new mongoose.Schema(
    {
        deviationDate: {
            type: Date,
        },
        deviationNumber: {
            type: String,
        },
        deviationType: {
            type: String,
        },
        customer: [
            {
                ref: "Customer",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        supplier: {
            type: String,
        },
        requestBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        implementationDate: {
            type: Date,
        },
        implementationTime: {
            type: String,
        },
        parts: [
            {
                ref: "Parts",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        applyTo: {
            type: String,
        },
        machineNo: {
            type: String,
        },
        sectionTwo: {
            type: String,
        },
        termDevRequest: {
            type: String,
        },
        quantity: {
            type: String,
        },
        timePeriodStart: {
            type: Date,
        },
        timePeriodEnd: {
            type: Date,
        },
        other: {
            type: String,
        },
        deviationGranted: {
            type: String,
        },
        otherGranted: {
            type: String,
        },
        qualitySign: {
            type: String,
        },
        dateQualitySign: {
            type: Date,
        },
        seniorSign: {
            type: String,
        },
        dateSeniorSign: {
            type: Date,
        },
        customerSign: {
            type: String,
        },
        dateCustomerSign: {
            type: Date,
        },
        comments: {
            type: String,
        },
        consecutive: {
            type: Number,
        },
        severity: {
            type: String,
        },
        qualitySignStatus: {
            type: String,
        },
        seniorSignStatus: {
            type: String,
        },
        customerSignStatus: {
            type: String,
        },
        deviationStatus: {
            type: String,
        },
        deviationRisk: {
            type: String,
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DeviationRequest", deviationRequestSchema);





