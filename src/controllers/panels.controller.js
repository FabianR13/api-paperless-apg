const Panel = require('../models/Panel');
const RegistroPanel = require('../models/RegistroPanel');

// 1. Obtener todos los paneles con sus puertas (para renderizar en el Frontend)
exports.getPaneles = async (req, res) => {
  try {
    const paneles = await Panel.find();
    return res.status(200).json(paneles);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener paneles', error: error.message });
  }
};

// 2. Crear un nuevo panel manualmente (opcional, por si no se usa el seed)
exports.crearPanel = async (req, res) => {
  try {
    const nuevoPanel = new Panel(req.body);
    const panelGuardado = await nuevoPanel.save();
    return res.status(201).json(panelGuardado);
  } catch (error) {
    return res.status(400).json({ message: 'Error al crear panel', error: error.message });
  }
};
