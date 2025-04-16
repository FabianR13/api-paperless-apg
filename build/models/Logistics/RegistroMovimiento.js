const mongoose = require("mongoose");

const RegistroMovimientosSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  tipoAccion: {
    type: String,
    required: true,
    enum: ["Crear pedido", "Surtir pedido", "Modificar Items", "Ingresar duplicado", "Otro"] // Puedes agregar más acciones aquí

  },
  detalles: {
    type: String,
    // Información adicional sobre el movimiento
    default: ""
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("RegistroMovimientos", RegistroMovimientosSchema);