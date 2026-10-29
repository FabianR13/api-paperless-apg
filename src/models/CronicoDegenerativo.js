const mongoose = require("mongoose");

const CronicoDegenerativoSchema = new mongoose.Schema(
    {
        company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employees", required: true },

        diseaseType: {
            type: [String],
            enum: [
                "Diabetes mellitus tipo 1", "Diabetes mellitus tipo 2", "Hipertensión arterial",
                "Enfermedad renal crónica", "Enfermedad cardiovascular", "EPOC", "Asma",
                "Obesidad", "Hipotiroidismo", "Hipertiroidismo", "Artritis reumatoide",
                "Lupus", "Epilepsia", "Cáncer (en tratamiento o remisión)", "Otra"
            ],
            default: [],
        },

        diagnosisDate: { type: Date, default: null },
        lastCheckupDate: { type: Date, default: null },
        treatingPhysician: { type: String, default: "" }, // médico tratante / institución
        nextCheckupDate: { type: Date, default: null },
        currentTreatment: { type: String, default: "" },  // tratamiento / medicamentos
        restrictions: { type: String, default: "" },       // aptitud / restricciones para el puesto
        notes: { type: String, default: "" },

        documents: [
            {
                fileName: { type: String, required: true },     // nombre en S3
                originalName: { type: String, default: "" },    // nombre que tenía el archivo
                fileUrl: { type: String, default: "" },
                uploadedAt: { type: Date, default: Date.now },
            },
        ],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

CronicoDegenerativoSchema.index({ company: 1, employeeId: 1 });

module.exports = mongoose.model("CronicoDegenerativo", CronicoDegenerativoSchema);