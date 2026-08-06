const mongoose = require('mongoose');

// 1. Definimos el Subesquema de las Puertas (No crea una colección extra en MongoDB)
const PuertaSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
    // Ej: "Torniquete Entrada Principal"
  },
  numeroRelevador: { 
    type: Number, 
    required: true,
    min: 1, 
    max: 4 // El panel SYSCA4R4D soporta hasta 4 relevadores
  },
  tiempoApertura: {
    type: Number,
    default: 5 // Segundos de apertura
  },
  estadoActual: {
    type: String,
    enum: ['Normal', 'Abierta Permanente', 'Bloqueada'],
    default: 'Normal'
  }
});

// 2. Definimos el Esquema Principal del Panel
const PanelSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
    // Ej: "Panel Principal Corporativo"
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
    // Ej: "192.168.1.201"
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
  
  // 3. Insertamos las puertas como un arreglo de subdocumentos
  puertas: [PuertaSchema]

}, { 
  timestamps: true 
});

module.exports = mongoose.model('Panel', PanelSchema);