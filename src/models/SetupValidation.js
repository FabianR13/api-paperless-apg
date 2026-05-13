const mongoose = require('mongoose');
const { Schema } = mongoose;
const statusEnum = ['YES', 'NO', 'N/A'];

const SetUpValidationSchema = new Schema({
    // ==========================================
    // 1. INFORMACIÓN GENERAL (HEADER)
    // ==========================================
    headerInfo: {
        validationId: { type: String, required: true, unique: true },
        partNumber: { type: Schema.Types.ObjectId, ref: "Parts" },
        shift: { type: String },
        machineNumber: { type: String },
        date: { type: Date, default: Date.now },
        startupTime: { type: String },
        resinUsed: { type: String },
        quotedCycleTime: { type: String },
        moldInstalledBy: { type: Schema.Types.ObjectId, ref: "Employees" },
        setupValidationStatus: { type: String }
    },

    // ==========================================
    // 2. SET-UP VALIDATION (PAGE 1)
    // ==========================================
    setupValidation: {
        setupTech: {
            parametersAsPerSheet: { status: { type: String, enum: statusEnum }, revisionDate: Date },
            repairsDone: { status: { type: String, enum: statusEnum }, tagColor: { type: String, enum: ['YELLOW', 'GREEN'] } },
            repairsResolved: { status: { type: String, enum: statusEnum }, workOrder: String },
            resinVerified: { status: { type: String, enum: statusEnum }, dryerNumber: String },
            safetySwitchesFunctional: { status: { type: String, enum: statusEnum }, comments: String },
            machinePurged: { type: String, enum: ['YES', 'NO'] },
            startupParts: { type: String, enum: ['YES', 'NO'] },
            processAlarmsSet: { status: { type: String, enum: statusEnum }, actualFillTime: String },
            moldWaterVerified: {
                status: { type: String, enum: statusEnum },
                cavityTemp: String,
                coreTemp: String,
                slideTemp: String
            },
            conveyorSetup: { type: String, enum: statusEnum },
            shotCounterReset: { type: String, enum: statusEnum },
            robotAndSecondarySetup: { type: String, enum: statusEnum },
            employeeId: { type: Schema.Types.ObjectId, ref: "User" },
            signedAt: { type: Date }
        },

        qualityInspector: {
            processVerificationFilled: {
                status: { type: String, enum: statusEnum },
                deviationNumber: { type: Schema.Types.ObjectId, ref: "Deviation" }
            },
            modificationsVerified: { status: { type: String, enum: statusEnum }, newPartNumber: String },
            repairsResolved: { status: { type: String, enum: statusEnum }, workOrder: String },
            resinVerified: { status: { type: String, enum: statusEnum }, dryerNumber: String },
            qualityAlert: { status: { type: String, enum: statusEnum }, alertDate: Date },
            unusedLabelsDisposed: { status: { type: String, enum: ['YES', 'NO'] }, comments: String },
            rejectBinsEmptied: { status: { type: String, enum: statusEnum }, comments: String },
            assemblyStationSetup: { status: { type: String, enum: statusEnum }, comments: String },
            automationTechValidated: { status: { type: String, enum: statusEnum }, comments: String },
            firstOffSample: { status: { type: String, enum: statusEnum }, comments: String },
            employeeId: { type: Schema.Types.ObjectId, ref: "User" },
            signedAt: { type: Date }
        },

        leadHand: {
            operatorTrained: { status: { type: String, enum: ['YES', 'NO'] }, trainedBy: String },
            previousMaterialsRemoved: { status: { type: String, enum: ['YES', 'NO'] }, comments: String },
            properPackagingAvailable: { status: { type: String, enum: ['YES', 'NO'] }, comments: String },
            workStationSetup: { status: { type: String, enum: ['YES', 'NO'] }, comments: String },
            properScrapBinsAvailable: { type: String, enum: statusEnum },
            correctComponentsAvailable: { type: String, enum: statusEnum },
            processAlarmsMatch: { status: { type: String, enum: ['YES', 'NO'] }, comments: String },
            workCellOrganized5S: { status: { type: String, enum: ['YES', 'NO'] }, comments: String },
            additionalComments: { type: String },
            employeeId: { type: Schema.Types.ObjectId, ref: "User" },
            signedAt: { type: Date }
        }
    },

    // ==========================================
    // 3. TEMPORARY SHUTDOWN / RESTART (PAGE 2 - Tabla)
    // ==========================================
    // Usamos un array porque puede haber múltiples reinicios en un turno
    restarts: [{
        date: { type: Date },
        timeOfStartup: { type: String },
        setupTech: {
            normalStartupChecked: { type: String, enum: ['YES', 'NO'] },
            employeeId: { type: Schema.Types.ObjectId, ref: "User" },
            signedAt: { type: Date }
        },
        quality: {
            newFirstOffIssued: { type: String, enum: ['YES', 'NO'] },
            employeeId: { type: Schema.Types.ObjectId, ref: "User" },
            signedAt: { type: Date }
        },
        leadHand: {
            workcellReady: { type: String, enum: ['YES', 'NO'] },
            employeeId: { type: Schema.Types.ObjectId, ref: "User" },
            signedAt: { type: Date }
        }
    }],

    // ==========================================
    // 4. MOLD CHANGE / END OF RUN (PAGE 2 - Inferior)
    // ==========================================
    endOfRun: {
        setupTech: {
            actualFillTime: { type: String },
            moldWaterVerified: {
                status: { type: String, enum: ['YES', 'NO'] },
                cavityTemp: String,
                coreTemp: String,
                slideTemp: String
            },
            providedToQuality: { type: String, enum: ['YES', 'NO'] },
            moldCleanedAndSprayed: { type: String, enum: ['YES', 'NO'] },
            waterCircuitsBlownOut: { type: String, enum: ['YES', 'NO'] },
            machinePurged: { type: String, enum: ['YES', 'NO'] },
            tagAttached: { status: { type: String, enum: ['YES', 'NO'] }, tagColor: { type: String, enum: ['RED', 'GREEN'] } },
            shotCounter: { type: String },
            employeeId: { type: Schema.Types.ObjectId, ref: "User" },
            signedAt: { type: Date }
        },

        quality: {
            lastOffTakenAndStored: { type: String, enum: ['YES', 'NO'] },
            documentsRemoved: { type: String, enum: ['YES', 'NO'] },
            rejectsReviewedInPrism: { type: String, enum: ['YES', 'NO'] },
            reasonPressDown: {
                type: String,
                enum: ['MACHINE BREAKDOWN', 'NO COMPONENTS/PACKAGING', 'NO RAW MATERIAL (RESIN)', 'NO LABOUR', 'RUN COMPLETED', 'OTHER']
            },
            employeeId: { type: Schema.Types.ObjectId, ref: "User" },
            signedAt: { type: Date }
        },

        leadHand: {
            componentsRemoved: { type: String, enum: ['YES', 'NO'] },
            workStationCleaned: { type: String, enum: ['YES', 'NO'] },
            assemblyFixtureStored: { type: String, enum: ['YES', 'NO'] },
            additionalComments: { type: String },
            employeeId: { type: Schema.Types.ObjectId, ref: "User" },
            signedAt: { type: Date }
        }
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", },
}, {
    timestamps: true // Crea automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('SetUpValidation', SetUpValidationSchema);