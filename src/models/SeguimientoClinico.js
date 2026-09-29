const mongoose = require("mongoose");

const SeguimientoClinicoSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, index: true },
    consultationId: { type: mongoose.Schema.Types.ObjectId, ref: "ConsultaMedica", required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },

    followUpDate: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ["En seguimiento", "Alta médica", "Incapacidad activa", "Reincorporado"],
      default: "En seguimiento",
    },
    clinicalEvolution: { type: String, default: "" },

    disabilityDays: { type: Number, default: 0, min: 0 },
    st7: {
      issued: { type: Boolean, default: false },
      folio: { type: String, default: "" },
    },

    nextAppointmentDate: { type: Date, default: null },
    fitForWork: {
      type: String,
      enum: ["Apto", "Apto con restricciones", "No apto", ""],
      default: "",
    },
    restrictions: { type: String, default: "" },

    registeredBy: { type: String, default: "" },
  },
  { timestamps: true }
);

SeguimientoClinicoSchema.index({ company: 1, employeeId: 1, followUpDate: -1 });
SeguimientoClinicoSchema.index({ company: 1, status: 1 });

module.exports = mongoose.model("SeguimientoClinico", SeguimientoClinicoSchema);