const Panel = require('../models/Panel');
const AccessCredential = require('../models/Credential');
const AccessGroup = require('../models/AccessGroups');

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

// 1. Obtener todos los paneles con sus puertas (para renderizar en el Frontend)
const getPaneles = async (req, res) => {
  try {
    const paneles = await Panel.find();
    return res.status(200).json(paneles);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener paneles', error: error.message });
  }
};

// 2. Crear un nuevo panel manualmente (opcional, por si no se usa el seed)
const crearPanel = async (req, res) => {
  try {
    const nuevoPanel = new Panel(req.body);
    const panelGuardado = await nuevoPanel.save();
    return res.status(201).json(panelGuardado);
  } catch (error) {
    return res.status(400).json({ message: 'Error al crear panel', error: error.message });
  }
};

const getCredentials = async (req, res) => {
  try {
    const { companyId } = req.params;

    const credenciales = await AccessCredential.find()
      .populate('accessGroup')
      .populate('employee');

    return res.status(200).json({
      status: "200",
      message: "Credenciales obtenidas con éxito",
      body: credenciales
    });
  } catch (error) {
    console.error("Error al obtener credenciales:", error);
    return res.status(500).json({ message: "Error al obtener credenciales", error: error.message });
  }
};

const getAccessGroups = async (req, res) => {
  try {
    const grupos = await AccessGroup.find();

    return res.status(200).json({
      status: "200",
      message: "Grupos de acceso obtenidos con éxito",
      body: grupos
    });
  } catch (error) {
    console.error("Error al obtener grupos de acceso:", error);
    return res.status(500).json({ message: "Error al obtener grupos", error: error.message });
  }
};

// NUEVA FUNCIÓN 1: Mandar el Horario 2 al panel
const configurarHorarioPanel = async (req, res) => {
  try {
    const { ipPanel } = req.body;

    if (!ipPanel) {
      return res.status(400).json({ mensaje: "Falta la ipPanel" });
    }

    const io = req.app.get('io');
    io.emit('comando_configurar_horario', { ipPanel });

    res.status(200).json({
      exito: true,
      mensaje: `Orden enviada para configurar el Horario 2 en el panel ${ipPanel}`
    });

  } catch (error) {
    console.error("Error configurando horario:", error);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// NUEVA FUNCIÓN 2: Enviar una sola credencial a MÚLTIPLES paneles
const enviarCredencialUnica = async (req, res) => {
  try {
    const { pin, tarjeta, timezone, accesos } = req.body;

    // Validamos que vengan los datos base y que 'accesos' sea un arreglo válido
    if (!pin || !tarjeta || !timezone || !Array.isArray(accesos) || accesos.length === 0) {
      return res.status(400).json({
        mensaje: "Faltan datos requeridos (pin, tarjeta, timezone, accesos[])"
      });
    }

    const io = req.app.get('io');

    // Iteramos sobre el arreglo de accesos y disparamos una orden al Agente por cada uno
    for (const acceso of accesos) {
      // Validamos que cada acceso tenga su IP y su puerta
      if (acceso.ipPanel && acceso.puerta) {
        io.emit('comando_enviar_credencial', {
          ipPanel: acceso.ipPanel,
          pin,
          tarjeta,
          puerta: acceso.puerta,
          timezone
        });
      }
    }

    res.status(200).json({
      exito: true,
      mensaje: `Órdenes de inyección enviadas. El PIN ${pin} se enviará a ${accesos.length} puerta(s).`
    });

  } catch (error) {
    console.error("Error inyectando credenciales masivas:", error);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// NUEVA FUNCIÓN 3: Sincronización Total
const sincronizarTodoElPanel = async (req, res) => {
  try {
    const { ipPanel } = req.body;
    if (!ipPanel) return res.status(400).json({ mensaje: "Falta ipPanel" });

    // 1. Buscamos todas las credenciales activas y poblamos su Grupo de Acceso
    const credenciales = await AccessCredential.find({ active: true })
      .populate('accessGroup');

    // 2. Filtramos y armamos el paquete solo con las credenciales que tienen permiso en ESTE panel
    const credencialesParaEnviar = [];

    for (const cred of credenciales) {
      if (!cred.accessGroup || !cred.accessGroup.active) continue;

      // Revisamos si el grupo de esta credencial tiene acceso al panel solicitado
      const accesoEnPanel = cred.accessGroup.doors.find(door => door.panelIp === ipPanel);

      if (accesoEnPanel) {
        credencialesParaEnviar.push({
          pin: cred.personnelId,
          tarjeta: cred.cardNumber,
          puerta: accesoEnPanel.numeroRelevador,
          timezone: cred.accessGroup.timeZone.idZKTeco
        });
      }
    }

    if (credencialesParaEnviar.length === 0) {
      return res.status(404).json({ mensaje: "No hay credenciales asignadas a este panel." });
    }

    // 3. Emitimos la orden al Agente Local
    const io = req.app.get('io');
    io.emit('comando_sync_masiva', {
      ipPanel,
      credenciales: credencialesParaEnviar
    });

    res.status(200).json({
      exito: true,
      mensaje: `Orden de Sincronización Masiva enviada. Se inyectarán ${credencialesParaEnviar.length} credenciales.`
    });

  } catch (error) {
    console.error("Error en sincronización masiva:", error);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// NUEVA FUNCIÓN: Eliminar una sola credencial
const eliminarCredencialUnica = async (req, res) => {
  try {
    const { ipPanel, pin } = req.body;

    if (!ipPanel || !pin) {
      return res.status(400).json({ 
        mensaje: "Faltan datos requeridos (ipPanel, pin)" 
      });
    }

    const io = req.app.get('io');
    
    // Disparamos la orden al Agente en Windows
    io.emit('comando_eliminar_credencial', { ipPanel, pin });

    res.status(200).json({
      exito: true,
      mensaje: `Orden de eliminación enviada. PIN: ${pin} en panel: ${ipPanel}`
    });

  } catch (error) {
    console.error("Error eliminando credencial:", error);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

module.exports = {
  abrirPanelRemoto, sincronizarLogsPanel, getPaneles, crearPanel,
  configurarHorarioPanel,
  enviarCredencialUnica,
  sincronizarTodoElPanel,
  eliminarCredencialUnica,
  getCredentials, 
  getAccessGroups 
};


