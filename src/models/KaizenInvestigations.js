const { Schema, model } = require("mongoose");

const kaizenInvestigationSchema = new Schema({
    // Referencia a la sugerencia padre
    suggestionId: { type: Schema.Types.ObjectId, ref: "Suggestion" },

    // ESTATUS PROPIO DE LA INVESTIGACIÓN (Aquí es donde se guarda ahora)
    investigationStatus: { type: String, default: "Pending" },

    // Datos generales
    ideaName: String,
    ideators: String,

    // Validación (1-3)
    q1_isNew: String,
    q2_isConsidered: String,
    q3_whoEntered: String,

    // Impacto (4-8)
    q4_quality: String, q4_how: String, q4_value: String,
    q5_material: String, q5_how: String, q5_annual: String,
    q6_labor: String, q6_how: String, q6_annual: String,
    q7_process: String, q7_how: String, q7_annual: String,
    q8_other: String, q8_which: String, q8_how: String,

    // Totales (9-10)
    q9_totalAnnualSavings: Number,
    q10_calculationDetail: String,

    // Implementación (11-13)
    q11_implementationDate: Date,
    q12_requirements: String,
    q13_involvedAreas: String,

    // Análisis y Costos (14-18)
    // Guardamos ObjectIds reales referenciando a usuarios
    q14_advisors: [{ type: Schema.Types.ObjectId, ref: "User" }], 
    
    q15_instructions: String,
    q16_estimatedCost: Number,
    q17_costDetail: String,
    q18_roiTime: String,

    // Conclusión (19)
    q19_implementationStatus: String,
    q19_why: String,

    // Firmas (Nombres, Fechas y URLs/Keys de imagen)
    advisorName: String, advisorDate: Date, advisorSignatureUrl: String,
    managerName: String, managerDate: Date, managerSignatureUrl: String,
    topManagerName: String, topManagerDate: Date, topManagerSignatureUrl: String,

}, {
    timestamps: true,
    versionKey: false
});

module.exports = model("KaizenInvestigation", kaizenInvestigationSchema);