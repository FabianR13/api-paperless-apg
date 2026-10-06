const mongoose = require("mongoose");

const ControlPrenatalSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employees", required: true },

    dueDate: { type: Date, default: null },           // FPP
    gestationWeeks: { type: Number, default: null },
    estimatedLeaveDate: { type: Date, default: null }, // fecha probable de incapacidad
    nextAppointmentDate: { type: Date, default: null },
    notes: { type: String, default: "" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ControlPrenatalSchema.index({ company: 1, employeeId: 1 });

module.exports = mongoose.model("ControlPrenatal", ControlPrenatalSchema);