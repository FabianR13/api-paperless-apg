const mongoose = require("mongoose");

const ExpedienteMedicoSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, index: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },

    // Datos complementarios
    gender: { type: String, default: "" },
    bloodType: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    birthDate: { type: Date, default: null },
    nss: { type: String, default: "" },

    // Antecedentes médicos
    hasChronicDisease: { type: String, enum: ["Sí", "No", ""], default: "" },
    chronicDiseases: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    otherAllergies: { type: String, default: "" },

    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

// Un solo expediente por empleado y empresa
ExpedienteMedicoSchema.index({ company: 1, employeeId: 1 }, { unique: true });

module.exports = mongoose.model("ExpedienteMedico", ExpedienteMedicoSchema);