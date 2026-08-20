const mongoose = require('mongoose');

const PuertaSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  numeroRelevador: { 
    type: Number, 
    required: true,
    min: 1, 
    max: 4 
  },
  tiempoApertura: {
    type: Number,
    default: 5
  },
  estadoActual: {
    type: String,
    enum: ['Normal', 'Abierta Permanente', 'Bloqueada'],
    default: 'Normal'
  }
});

const PanelSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  serial: { 
    type: String, 
    required: true,
    trim: true
  },
  ip: { 
    type: String, 
    required: true,
    unique: true 
  },
  puerto: { 
    type: Number, 
    default: 4370 
  },
  modelo: {
    type: String,
    default: 'SYSCA4R4D'
  },
  estado: {
    type: String,
    enum: ['Online', 'Offline', 'Mantenimiento'],
    default: 'Online'
  },
  ultimaConexion: {
    type: Date
  },
  puertas: [PuertaSchema]

}, { 
  timestamps: true 
});

module.exports = mongoose.model('Panel', PanelSchema);