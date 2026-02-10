const mongoose = require("mongoose");
const { Schema } = mongoose;

const KaizenPointsSchema = new Schema({
  // Relación con el empleado (Unique asegura que solo haya un registro de puntos por empleado)
  employee: { 
    type: Schema.Types.ObjectId, 
    ref: "Employees", 
    required: true, 
    unique: true 
  },
  
  company: { type: Schema.Types.ObjectId, ref: "Company" },

  // Variable que guarda el TOTAL acumulado actual (se actualiza automáticamente con lógica de backend)
  totalPoints: { type: Number, default: 0 },

  // Array para guardar el registro de movimientos
  history: [
    {
      activity: { type: String, required: true }, // Ej: "Sugerencia generada", "Canje de Puntos"
      reference: { type: String }, // Ej: El ID de la sugerencia (APG-SUG-001) o Nombre del Premio
      points: { type: Number, required: true }, // Ej: 20, 500, -500 (positivos suman, negativos restan)
      date: { type: Date, default: Date.now } // Fecha del movimiento
    }
  ]
}, {
  timestamps: true // Esto guardará createdAt (cuando se creó el registro del empleado) y updatedAt (última modificación)
});

module.exports = mongoose.model("KaizenPoints", KaizenPointsSchema);