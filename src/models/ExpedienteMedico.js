const mongoose = require("mongoose");

const ExpedienteMedicoSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, index: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },

    // Datos complementarios
    gender: { type: String, default: "" },
    bloodType: { type: String, default: "" },
    emergencyContact: {
      name: { type: String, default: "" },
      relationship: { type: String, default: "" },
      mainPhone: { type: String, default: "" },
      altPhone: { type: String, default: "" },
    },
    maritalStatus: { type: String, default: "" },
    birthDate: { type: Date, default: null },
    nss: { type: String, default: "" },

    // Antecedentes médicos
    hasChronicDisease: { type: String, enum: ["Sí", "No", ""], default: "" },
    chronicDiseases: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    otherAllergies: { type: String, default: "" },
    familyHistory: { type: String, default: "" },   // Antecedentes Heredo-Familiares
    personalHistory: { type: String, default: "" }, // Antecedentes Patológicos Personales
    continuousMedication: { type: String, default: "" }, // texto libre por ahora
    covidVaccine: { type: Boolean, default: false },
    smoking: { type: String, default: "" },
    alcoholism: { type: String, default: "" },
    physicalActivity: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

// Un solo expediente por empleado y empresa
ExpedienteMedicoSchema.index({ company: 1, employeeId: 1 }, { unique: true });

module.exports = mongoose.model("ExpedienteMedico", ExpedienteMedicoSchema);