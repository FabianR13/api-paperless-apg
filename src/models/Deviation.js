const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- SUB-SCHEMA 1: Para las filas de Product, Process, Corrective, etc. ---
// Esto reemplaza tener 4 arrays separados. Ahora cada objeto es una fila completa.
const ActionRowSchema = new Schema({
    risk: { type: String, trim: true },
    measurement: { type: String, trim: true },
    responsible: {
        type: Schema.Types.ObjectId,
        ref: 'Employees' // Asumiendo que tu colección de empleados se llama así
    },
    dueDate: { type: Date }
}, { _id: false }); // _id: false para que no cree un ID único por cada fila (opcional)

// --- SUB-SCHEMA 2: Para estandarizar TODAS las firmas ---
const SignatureSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'NA'], // NA por si no aplica
        default: 'Pending'
    },
    date: { type: Date },
    comment: { type: String } // Útil para agregar razón de rechazo aquí mismo
}, { _id: false });

// --- SCHEMA PRINCIPAL ---
const deviationSchema = new Schema(
    {
        deviationNumber: { type: String, required: true, unique: true },
        consecutive: { type: Number },
        version: { type: Number, default: 1 },
        deviationStatus: {
            type: String,
            enum: ['Open', 'In Review', 'Approved', 'Rejected', 'Closed'],
            default: 'Open'
        },
        rejectedBy: { type: Schema.Types.ObjectId, ref: "User" },
        rejectedDate: { type: Date },
        rejectedComment: { type: String },

        // Datos Generales
        requestBy: { type: Schema.Types.ObjectId, ref: "User" },
        severity: { type: String },
        deviationType: { type: String },
        deviationDate: { type: Date },
        implementationDate: { type: Date },
        closureDate: { type: Date },
        closedAt: { type: Date },
        customer: { type: Schema.Types.ObjectId, ref: "Customer" },
        partNumber: { type: Schema.Types.ObjectId, ref: "Parts" },
        company: { type: Schema.Types.ObjectId, ref: "Company" },

        // Detalles específicos
        applyTo: String,
        implementationTime: String,
        machine: String,
        supplier: String,
        sectionTwo: String,
        termDevRequest: String,
        quantity: String,
        timePeriodStart: Date,
        timePeriodEnd: Date,
        other: String,
        comments: String,

        // Risk Assessment (Texto)
        reason: String,
        consequence: String,
        deviationImages: [{ img: String }],

        // --- AQUI EL CAMBIO FUERTE: SECCIONES AGRUPADAS ---
        // En lugar de arrays sueltos, usamos el ActionRowSchema
        riskAssessment: {
            product: [ActionRowSchema],
            process: [ActionRowSchema]
        },

        actions: {
            corrective: [ActionRowSchema],
            preventive: [ActionRowSchema]
        },

        followUp: {
            corrective: [ActionRowSchema],
            preventive: [ActionRowSchema]
        },

        // --- SECCIÓN DE FIRMAS REESTRUCTURADA ---
        signatures: {
            // Validación inicial
            qualityValidation: SignatureSchema,

            // Firmas de aprobación final
            seniorManager: SignatureSchema,
            customer: SignatureSchema,

            // Firmas de evaluación de riesgo (Risk Assessment Signatures)
            riskAssessment: {
                qualityManager: SignatureSchema,
                productionManager: SignatureSchema,
                processManager: SignatureSchema,
                automationManager: SignatureSchema
            }
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Deviation", deviationSchema);