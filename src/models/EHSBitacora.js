const { Schema, model } = require("mongoose");

const ehsBitacoraSchema = new Schema(
    {
        company: { 
            type: Schema.Types.ObjectId, 
            ref: "Company", // Ajusta el nombre del ref si tu modelo se llama distinto (ej: "Empresa")
            required: true 
        },
        accion: { type: String, required: true }, // Ej: "CREAR", "EDITAR", "ACTIVAR", "DESACTIVAR", "ELIMINAR"
        modulo: { type: String, required: true }, // Ej: "PRODUCTO", "UBICACION", "COMPONENTE"
        descripcion: { type: String, required: true }, // Detalle legible del cambio
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    {
        timestamps: true // Esto genera automáticamente createdAt y updatedAt
    }
);

module.exports = model("EHSBitacora", ehsBitacoraSchema);