const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const deviationsNewSchema = new mongoose.Schema(
    {
        deviationNumber: { type: String, required: true, unique: true },
        deviationReqId: { type: Schema.Types.ObjectId, ref: "DeviationRequest" },
        consecutive: { type: Number },
        version: { type: Number, default: 1 },
        deviationStatus: {
            type: String,
            enum: ['Open', 'Approved', 'ReadyToClose', 'Closed'],
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
        reason: { type: String },
        consequence: { type: String },
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
        approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
        approvedDate: { type: Date },
        active: { type: Boolean, },
        rootCause: { type: String },
        correctiveActions: { type: String },
        correctiveMeasurement: { type: String },
        preventiveActions: { type: String },
        preventiveMeasurement: { type: String },
        responsibleCorrective: { type: Schema.Types.ObjectId, ref: "User" },
        responsiblePreventive: { type: Schema.Types.ObjectId, ref: "User" },
        correctiveDueDate: { type: Date },
        preventiveDueDate: { type: Date },
        correctiveCloseDate: { type: Date },
        preventiveCloseDate: { type: Date },
        modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
        modifiedDate: { type: Date },
        isAuditable: { type: Boolean, },
        closedBy: { type: Schema.Types.ObjectId, ref: "User" },
        closedDate: { type: Date },
        closureImages: [{ img: String }],
        closurePdfs: [{ pdf: String }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DeviationsNew", deviationsNewSchema);





