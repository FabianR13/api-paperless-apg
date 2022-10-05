const mongoose = require('mongoose')

const assemblyStartTechnicalSchema = new mongoose.Schema(
    {
        parameterSetting: {
            type: String,
        },
        revisionDate: {
            type: String,
        },
        repairMold: {
            type: String,
        },
        labelColor: {
            type: String,
        },
        ifRepair: {
            type: String,
        },
        orderJob: {
            type: String,
        },
        resinVerifiedDried: {
            type: String,
        },
        numberDryer: {
            tyep: String,
        },
        switchConected: {
            type: String,
        },
        comments: {
            type: String,
        },
        purgeMachine: {
            type: String,
        },
        containerRed: {
            type: String,
        },
        alarmsProgramed: {
            type: String,
        },
        moldWather: {
            type: String,
        },
        temperatures: {
            type: String,
        },
        transportBand: {
            type: String,
        },
        counterMachine: {
            type: String,
        },
        settingRobot: {
            type: String,
        },
        formatEmp: {
            type: String,
        },
        employee: [{
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        }],
        noCheckValidation: {
            type: Number,
        },
        status: {
            type: Boolean,
        },
        company: [{
            ref: "Company",
            type: mongoose.Schema.Types.ObjectId,
        }],
    }
);

module.exports = mongoose.model("assemblyStartTechnical", assemblyStartTechnicalSchema);