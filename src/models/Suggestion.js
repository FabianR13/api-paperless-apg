const mongoose = require("mongoose");
const { Schema } = mongoose;

const SuggestionSchema = new Schema({
  consecutive: { type: Number },
  idSuggestion: { type: String }, // Ej: APG-SUG-001

  // Campos del formato
  suggestionTitle: { type: String, required: true }, // "Esta es mi sugerencia"
  currentMethod: { type: String },                   // Método Actual
  proposedMethod: { type: String },                  // Método Propuesto
  benefits: { type: String },                        // Beneficios

  // Datos
  partNumber: { type: String },

  // Relaciones
  company: [{ type: Schema.Types.ObjectId, ref: "Company" }],
  createdBy: [{ type: Schema.Types.ObjectId, ref: "Employees" }], // Nombre
  modifiedBy: [{ type: Schema.Types.ObjectId, ref: "Employees" }], // Nombre
  area: { type: String },    // Ubicación

  // Fechas y Firma
  createdDate: { type: Date, default: Date.now },
  signatureImg: { type: String }, // Key de S3

  // Control interno
  status: { type: String, default: "New" },
  version: { type: Number, default: 1 },
  investigationId: { type: Schema.Types.ObjectId, ref: "KaizenInvestigation" },
}, {
  timestamps: true
});

module.exports = mongoose.model("Suggestion", SuggestionSchema);