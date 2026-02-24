const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for individual widgets
const WidgetSchema = new Schema({
    id: { type: Number, required: true },
    type: { type: String, required: true, enum: ['chart', 'table'] },
    config: { type: Schema.Types.Mixed, required: true }
}, { _id: false });

const ReportSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    category: {
        type: String,
        required: true
    },
    reportMeta: {
        title: { type: String, default: 'Report Title' },
        subtitle: { type: String, default: '' },
        titleColor: { type: String, default: '#1976d2' },
        subtitleColor: { type: String, default: '#666666' },
        x: { type: Number, default: 50 },
        y: { type: Number, default: 50 }
    },
    widgets: [WidgetSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);