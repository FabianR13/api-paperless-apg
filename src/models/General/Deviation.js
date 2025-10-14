const mongoose = require('mongoose')

const deviationSchema = new mongoose.Schema(
    {
        deviationNumber: {
            type: String,
        },
        requestBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        severity: {
            type: String,
        },
        deviationType: {
            type: String,
        },
        deviationDate: {
            type: Date,
        },
        implementationDate: {
            type: Date,
        },
        customer: [
            {
                ref: "Customer",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        partNumber: [
            {
                ref: "Parts",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        applyTo: {
            type: String,
        },
        implementationTime: {
            type: String,
        },
        machine: {
            type: String,
        },
        supplier: {
            type: String,
        },
        sectionTwo: {
            type: String,
        },
        termDevRequest: {
            type: String,
        },
        quantity: {
            type: String,
        },
        timePeriodStart: {
            type: Date,
        },
        timePeriodEnd: {
            type: Date,
        },
        other: {
            type: String,
        },
        qualitySign: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        },
        seniorSign: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        },
        customerSign: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        qualitySignStatus: {
            type: String,
        },
        seniorSignStatus: {
            type: String,
        },
        customerSignStatus: {
            type: String,
        },
        qualitySignDate: {
            type: Date,
        },
        seniorSignDate: {
            type: Date,
        },
        customerSignDate: {
            type: Date,
        },
        comments: {
            type: String,
        },
        // Risk Assessment
        reason: {
            type: String,
        },
        consequence: {
            type: String,
        },
        productRisk: [{
            type: String,
        }],
        productMeasurement: [{
            type: String,
        }],
        productResponsible: [{
            employee: { // <- La referencia ahora está dentro de un objeto
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employees'
            }
        }],
        productDueDate: [{
            type: Date,
        }],
        processRisk: [{
            type: String,
        }],
        processMeasurement: [{
            type: String,
        }],
        processResponsible: [{
            employee: { // <- La referencia ahora está dentro de un objeto
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employees'
            }
        }],
        processDueDate: [{
            type: Date,
        }],
        // Actions to Eliminate Deviation
        correctiveMeasurement: [{
            type: String,
        }],
        correctiveResponsible: [{
            employee: { // <- La referencia ahora está dentro de un objeto
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employees'
            }
        }],
        correctiveDueDate: [{
            type: Date,
        }],
        preventiveMeasurement: [{
            type: String,
        }],
        preventiveResponsible: [{
            employee: { // <- La referencia ahora está dentro de un objeto
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employees'
            }
        }],
        preventiveDueDate: [{
            type: Date,
        }],
        // Follow up of corrective/Preventive actions
        followCorrectiveMeasurement: [{
            type: String,
        }],
        followCorrectiveResponsible: [{
            employee: { // <- La referencia ahora está dentro de un objeto
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employees'
            }
        }],
        followCorrectiveDueDate: [{
            type: Date,
        }],
        followPreventiveMeasurement: [{
            type: String,
        }],
        followPreventiveResponsible: [{
            employee: { // <- La referencia ahora está dentro de un objeto
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employees'
            }
        }],
        followPreventiveDueDate: [{
            type: Date,
        }],
        qualitySignRisk: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        },
        productionSignRisk: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        },
        processSignRisk: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        },
        automationSignRisk: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        },
        qualitySignStatusRisk: {
            type: String,
        },
        productionSignStatusRisk: {
            type: String,
        },
        processSignStatusRisk: {
            type: String,
        },
        automationSignStatusRisk: {
            type: String,
        },
        qualitySignDateRisk: {
            type: Date,
        },
        productionSignDateRisk: {
            type: Date,
        },
        processSignDateRisk: {
            type: Date,
        },
        automationSignDateRisk: {
            type: Date,
        },
        //IdentificaDORES
        approvedBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        approvedByDate: {
            type: String,
        },
        consecutive: {
            type: Number,
        },
        deviationStatus: {
            type: String,
        },
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        version: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Deviation", deviationSchema);





