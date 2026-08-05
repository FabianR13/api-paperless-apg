const abrirPanelRemoto = async (req, res) => {
  try {
    // Ahora recibiremos el Número de Serie y el número de puerta (1, 2, 3 o 4)
    const { ipPanel, numeroPuerta } = req.body;

    if (!ipPanel || !numeroPuerta) {
      return res.status(400).json({ 
        mensaje: "Faltan datos requeridos (ipPanel, numeroPuerta)" 
      });
    }

    // 1. Extraemos la instancia de Socket.io que configuramos en index.js
    const io = req.app.get('io');

    // 2. Emitimos la orden hacia tu Agente Local con las nuevas variables
    io.emit('comando_abrir_puerta', { ipPanel, numeroPuerta });

    // 3. Respondemos al cliente (Postman/Frontend)
    res.status(200).json({
      exito: true,
      mensaje: `Orden encolada para el panel: ${ipPanel} en la puerta ${numeroPuerta}`
    });

  } catch (error) {
    console.error("Error en el controlador de paneles:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

const sincronizarLogsPanel = async (req, res) => {
    try {
        const { ipPanel } = req.body;

        if (!ipPanel) {
            return res.status(400).json({ mensaje: "Falta la ipPanel" });
        }

        const io = req.app.get('io');
        
        // Disparamos la orden al Agente en Windows
        io.emit('comando_obtener_logs', { ipPanel });

        res.status(200).json({
            exito: true,
            mensaje: `Orden enviada al Agente para extraer los últimos 10 logs del panel ${ipPanel}`
        });

    } catch (error) {
        console.error("Error pidiendo logs:", error);
        res.status(500).json({ mensaje: "Error interno" });
    }
};

module.exports = { abrirPanelRemoto, sincronizarLogsPanel };