const mongoose = require("mongoose");

const PersonalLactanteSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employees", required: true },

    startDate: { type: Date, default: null },
    estimatedEndDate: { type: Date, default: null },
    notes: { type: String, default: "" }, // notas / evaluación de riesgo del puesto

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

PersonalLactanteSchema.index({ company: 1, employeeId: 1 });

module.exports = mongoose.model("PersonalLactante", PersonalLactanteSchema);