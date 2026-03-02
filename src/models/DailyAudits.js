const mongoose = require('mongoose');
const { Schema } = mongoose;

const DailyAuditsSchema = new Schema({
    auditDay: { type: Date, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    comments: { type: String },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    auditStatus: { type: String },
    completedTime: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('DailyAudits', DailyAuditsSchema);
