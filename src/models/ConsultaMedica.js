const mongoose = require("mongoose");

const InsumoSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "EHSProducto", required: true },
        name: { type: String, default: "" }, // copia del nombre al momento de la consulta
        quantity: { type: Number, required: true, min: 0 },
        uom: { type: String, default: "" },
        quantityBase: { type: Number, default: 0 },   // cantidad en unidad base del producto
        descontado: { type: Boolean, default: true }, // false si el producto es noDescontar
    },
    { _id: false }
);

const ConsultaMedicaSchema = new mongoose.Schema(
    {
        company: { type: String, required: true, index: true },
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },

        // Datos de la consulta
        consultationDate: { type: Date, required: true, default: Date.now },
        shift: { type: String, enum: ["D", "A", "N"], required: true },
        administeredBy: { type: String, required: true },
        attentionType: {
            type: String,
            enum: [
                "Primera atención médica recibida",
                "Segunda atención subsecuente",
                "Tercera atención subsecuente",
                "Seguimiento médico (reincorporación laboral tras incapacidad o ausencia)",
            ],
            required: true,
        },

        // Cuadro clínico
        symptoms: { type: [String], default: [] },
        physicalExam: { type: String, default: "" },
        medicalHistory: { type: String, default: "" },
        externalMedication: { type: String, default: "" },
        diagnosis: { type: String, default: "" },
        medicalIndications: { type: String, default: "" },

        // Insumos del inventario EHS
        insumos: { type: [InsumoSchema], default: [] },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

// Para la bitácora (filtros por fecha, empleado y turno)
ConsultaMedicaSchema.index({ company: 1, consultationDate: -1 });
ConsultaMedicaSchema.index({ company: 1, employeeId: 1, consultationDate: -1 });

module.exports = mongoose.model("ConsultaMedica", ConsultaMedicaSchema);