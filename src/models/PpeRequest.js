const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const pperequestSchema = new mongoose.Schema(
    {
        requestId: { type: String, required: true, unique: true },
        issuerId: { type: Schema.Types.ObjectId, ref: 'User' },
        requesterId: { type: Schema.Types.ObjectId, ref: 'User' },
        requesterDate: { type: Date },
        employeeId: { type: Schema.Types.ObjectId, ref: 'Employees' },
        reason: { type: String },
        requestStatus: { type: String },
        glovesSize: { type: String },
        shoesSize: { type: String },
        needsGlases: { type: Boolean },
        needsEarplugs: { type: Boolean },
        needsSideShields: { type: Boolean },
        needsMask: { type: Boolean },
        delivered: { type: Boolean },
        cancelled: { type: Boolean },
        company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", },
        images: [{ type: String }],
        consecutive: { type: Number },
        version: { type: Number }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("PPERequest", pperequestSchema);