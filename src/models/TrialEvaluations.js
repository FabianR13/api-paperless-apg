const mongoose = require("mongoose");

const TrialEvaluationSchema = new mongoose.Schema({
    trialEvaluationName: {
        type: String,
    },
    evaluationDate: {
        type: Date,
    },
    knowledge: {
        qualification: { type: Number },
        explain: { type: String, default: '' }
    },
    performance: {
        qualification: { type: Number },
        explain: { type: String, default: '' }
    },
    safety: {
        qualification: { type: Number },
        explain: { type: String, default: '' }
    },
    training: {
        qualification: { type: Number },
        explain: { type: String, default: '' }
    },
    disciplinaryActions: {
        qualification: { type: String },
        explain: { type: String, default: '' }
    },
    attendanceRecord: {
        qualification: { type: Number },
        explain: { type: String, default: '' }
    },
    safetyResponsible: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    trainingResponsible: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    humanResourcesResponsible: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    humanResources: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    cmcap: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    directManager: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    employee: {
        ref: "Employees",
        type: mongoose.Schema.Types.ObjectId,
    },
    employeeSignature: {
        type: String,
    },
    approvals: {
        directManagerApproved: {
            type: String,
            enum: ['Si', 'No', ''],
            default: ''
        },
        safetyResponsibleApproved: {
            type: String,
            enum: ['Si', 'No', ''],
            default: ''
        },
        trainingResponsibleApproved: {
            type: String,
            enum: ['Si', 'No', ''],
            default: ''
        },
        humanResourcesResponsibleApproved: {
            type: String,
            enum: ['Si', 'No', ''],
            default: ''
        },
        humanResourcesApproved: {
            type: String,
            enum: ['Si', 'No', ''],
            default: ''
        }
    },
    consecutive: {
        type: Number,
    },
    company:
    {
        ref: "Company",
        type: mongoose.Schema.Types.ObjectId,
    }
    ,
    version: {
        type: Number,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("TrialEvaluation", TrialEvaluationSchema);