const mongoose = require('mongoose')

const deviationRiskTempSchema = new mongoose.Schema(
    {
        deviationNumber: {
            type: String,
        },
        reason: {
            type: String,
        },
        consequence: {
            type: String,
        },
        productRisk: {
            type: String,
        },
        productMitigate: {
            type: String,
        },
        productPerson: {
            type: String,
        },
        productDueDate1: {
            type: Date,
        },
        productDueDate2: {
            type: Date,
        },
        productDueDate3: {
            type: Date,
        },
        productDueDate4: {
            type: Date,
        },
        processRisk: {
            type: String,
        },
        processMitigate: {
            type: String,
        },
        processPerson: {
            type: String,
        },
        processDueDate1: {
            type: Date,
        },
        processDueDate2: {
            type: Date,
        },
        processDueDate3: {
            type: Date,
        },
        processDueDate4: {
            type: Date,
        },
        correctiveEliminate: {
            type: String,
        },
        correctivePerson: {
            type: String,
        },
        correctiveDueDate1: {
            type: Date,
        },
        correctiveDueDate2: {
            type: Date,
        },
        correctiveDueDate3: {
            type: Date,
        },
        correctiveDueDate4: {
            type: Date,
        },
        preventiveEliminate: {
            type: String,
        },
        preventivePerson: {
            type: String,
        },
        preventiveDueDate1: {
            type: Date,
        },
        preventiveDueDate2: {
            type: Date,
        },
        preventiveDueDate3: {
            type: Date,
        },
        preventiveDueDate4: {
            type: Date,
        },
        deviationGranted: {
            type: String,
        },
        otherGranted: {
            type: String,
        },
        qualitySign: {
            type: String,
        },
        dateQualitySign: {
            type: Date,
        },
        qualitySignStatus: {
            type: String,
        },
        productionSign: {
            type: String,
        },
        dateProductionSign: {
            type: Date,
        },
        productionSignStatus: {
            type: String,
        },
        processSign: {
            type: String,
        },
        dateProcessSign: {
            type: Date,
        },
        processSignStatus: {
            type: String,
        },
        automationSign: {
            type: String,
        },
        dateAutomationSign: {
            type: Date,
        },
        automationSignStatus: {
            type: String,
        },
        seniorSign: {
            type: String,
        },
        dateSeniorSign: {
            type: Date,
        },
        seniorSignStatus: {
            type: String,
        },
        customerSign: {
            type: String,
        },
        dateCustomerSign: {
            type: Date,
        },
        customerSignStatus: {
            type: String,
        },
        correctiveResults: {
            type: String,
        },
        correctivePersonFollow: {
            type: String,
        },
        correctiveDateFollow1: {
            type: Date,
        },
        correctiveDateFollow2: {
            type: Date,
        },
        correctiveDateFollow3: {
            type: Date,
        },
        correctiveDateFollow4: {
            type: Date,
        },
        preventiveResults: {
            type: String,
        },
        preventivePersonFollow: {
            type: String,
        },
        preventiveDateFollow1: {
            type: Date,
        },
        preventiveDateFollow2: {
            type: Date,
        },
        preventiveDateFollow3: {
            type: Date,
        },
        preventiveDateFollow4: {
            type: Date,
        },
        effectiveness: {
            type: String,
        },
        approvedBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        approvedByDate: {
            type: String,
        },
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DeviationRiskAssessmentTemp", deviationRiskTempSchema);