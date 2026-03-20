const mongoose = require('mongoose');
const { Schema } = mongoose;

const DailyAuditsSchema = new Schema({
    auditDay: { type: Date, required: true },
    assignedToD: { type: Schema.Types.ObjectId, ref: "User" },
    assignedToA: { type: Schema.Types.ObjectId, ref: "User" },
    generalCommentsD: { type: String },
    generalCommentsA: { type: String },
    auditStatusD: { type: String },
    completedTimeD: { type: String },
    auditStatusA: { type: String },
    completedTimeA: { type: String },
    imagesD: [{ type: String }],
    imagesA: [{ type: String }],
    observations: [{
        location: { type: String, required: true },
        partNumber: { type: Schema.Types.ObjectId, ref: "Parts" },
        shift: { type: String },
        comments: { type: String }
    }],
    company: { type: Schema.Types.ObjectId, ref: "Company" },
}, {
    timestamps: true
});

module.exports = mongoose.model('DailyAudits', DailyAuditsSchema);
