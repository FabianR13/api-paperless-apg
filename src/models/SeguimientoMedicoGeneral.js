const mongoose = require("mongoose");

const SeguimientoMedicoGeneralSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employees", required: true },

    reason: { type: String, default: "" }, // motivo del seguimiento
    absenceStartDate: { type: Date, default: null }, // inicio de incapacidad/ausencia
    returnDate: { type: Date, default: null },        // reincorporación / alta
    nextCheckupDate: { type: Date, default: null },
    restrictions: { type: String, default: "" },
    notes: { type: String, default: "" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

SeguimientoMedicoGeneralSchema.index({ company: 1, employeeId: 1 });

module.exports = mongoose.model("SeguimientoMedicoGeneral", SeguimientoMedicoGeneralSchema);