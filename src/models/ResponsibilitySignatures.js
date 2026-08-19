const mongoose = require('mongoose');

const responsibilitySignaturesSchema = new mongoose.Schema(
    {
        assetType: {
            type: String, // "Laptop" o "Cellphone"
            required: true
        },
        assetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employees"
        },
        signatureImg: {
            type: String,
            default: null // Inicia en null hasta que se firma
        },
        status: {
            type: String,
            enum: ["Pending", "Signed"],
            default: "Pending"
        },
        signedAt: {
            type: Date,
            default: null
        },
        company: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("ResponsibilitySignatures", responsibilitySignaturesSchema);