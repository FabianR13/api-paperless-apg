const mongoose = require("mongoose");
const { Schema } = mongoose;

const KaizenPointsRedeemSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employees",
        required: true,
    },
    reward: {
        type: Schema.Types.ObjectId,
        ref: "RewardsKaizen",
        required: true,
    },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    registerDate: { type: Date, default: Date.now },
    redeemDate: { type: Date },
    cancelDate: { type: Date },
    redeemStatus: { type: String },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
    signatureImage: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("KaizenPointsRedeem", KaizenPointsRedeemSchema);