const mongoose = require("mongoose");

const ExistenciaSchema = new mongoose.Schema({
    ubicacion: {
        ref: "EHSUbicacion",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    cantidad: { type: Number, required: true, default: 0 },
    lote: { type: String, trim: true },
    fechaCaducidad: { type: Date },
    factura: { type: String, trim: true }
}, { timestamps: true, _id: true });

const ComponenteProductoSchema = new mongoose.Schema({
    componente: {
        ref: "EHSComponente",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    concentracion: { type: String, trim: true }
}, { _id: false });

const EHSProductoSchema = new mongoose.Schema({
    descripcion: { type: String, required: true, trim: true },

    componentes: [ComponenteProductoSchema],

    funcionPrincipal: [{ type: String, trim: true }], // síntomas/indicaciones

    unidad: {
        type: String,
        enum: ["caja", "pieza", "tableta", "comprimido", "cápsula", "sobre", "paquete", "frasco", "rollo", "ampolleta", "tubo", "otro"],
        required: true
    },
    unidadesPorEnvase: { type: Number },
    tipoEnvase: {
        type: String,
        enum: ["Caja", "Frasco", "Paquete", "Bolsa", "Rollo", "Blíster", "Otro"]
    },
    categoria: {
        type: String,
        enum: ["Medicamento", "Material de curación", "Soluciones", "Insumo médico", "Otro"],
        required: true
    },
    viaAdministracion: {
        type: String,
        enum: ["Oral", "Oftálmica", "Ótica", "Tópica / Dérmica", "Nasal", "Intramuscular", "Intravenosa", "Sublingual", "Otra / No especificada"]
    },
    noDescontar: { type: Boolean, default: false },
    foto: { type: String, trim: true },
    stockMinimo: { type: Number, default: 0 },
    status: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },

    existencias: [ExistenciaSchema],

    createdBy: { ref: "User", type: mongoose.Schema.Types.ObjectId },
    modifiedBy: { ref: "User", type: mongoose.Schema.Types.ObjectId }

}, { timestamps: true });

module.exports = mongoose.model("EHSProducto", EHSProductoSchema);