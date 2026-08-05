const mongoose = require('mongoose');

const RegistroPanelSchema = new mongoose.Schema({
  panelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Panel',
    required: true
  },
  puertaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tipoEvento: {
    type: String,
    default: 'Apertura Remota'
  },
  estadoExito: {
    type: Boolean,
    default: true
  },
  detallesError: {
    type: String
  }
}, {
  timestamps: true // Agrega automáticamente las fechas 'createdAt' y 'updatedAt' para saber exactamente cuándo se abrió la puerta
});

module.exports = mongoose.model('RegistroPanel', RegistroPanelSchema);