const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const deviationRequestSchema = new mongoose.Schema(
    {
        deviationNumber: { type: String, required: true, unique: true },
        consecutive: { type: Number },
        version: { type: Number, default: 1 },
        deviationStatus: {
            type: String,
            enum: ['New', 'Approved', 'Rejected'],
            default: 'New'
        },
        company: { type: Schema.Types.ObjectId, ref: "Company" },
        requestBy: { type: Schema.Types.ObjectId, ref: "User" },
        deviationType: { type: String },
        deviationDate: { type: Date },
        implementationDate: { type: Date },
        implementationTime: { type: String },
        customer: { type: Schema.Types.ObjectId, ref: "Customer" },
        partNumber: { type: Schema.Types.ObjectId, ref: "Parts" },
        supplier: { type: String },
        machine: { type: String },
        processOwner: { type: Schema.Types.ObjectId, ref: "User" },
        deviationDescription: { type: String },
        interimControlMeasure: { type: String },
        termRequest: {
            type: {
                type: String,
                enum: ['Permanent', 'Quantity', 'Time Period', 'Other'],
                required: true
            },
            quantity: {
                type: Number,
                required: false
            },
            startDate: {
                type: Date,
                required: false
            },
            endDate: {
                type: Date,
                required: false
            },
            shiftStart: {
                type: String,
                required: false
            },
            shiftEnd: {
                type: String,
                required: false
            },
            otherDetails: {
                type: String,
                required: false
            }
        },
        deviationImages: [{ img: String }],
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
        reviewDate: { type: Date },
        rejectedComment: { type: String },
        active: { type: Boolean, },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DeviationRequest", deviationRequestSchema);





