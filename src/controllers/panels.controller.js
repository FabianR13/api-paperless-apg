const Panel = require('../models/Panel');
const AccessCredential = require('../models/Credential');
const AccessGroup = require('../models/AccessGroups');
const Employees = require('../models/Employees');
const AccessLog = require('../models/AccessLog');

const abrirPanelRemoto = async (req, res) => {
  try {
    const { ipPanel, numeroPuerta } = req.body;

    if (!ipPanel || !numeroPuerta) {
      return res.status(400).json({
        mensaje: "Faltan datos requeridos (ipPanel, numeroPuerta)"
      });
    }

    const io = req.app.get('io');

    io.emit('comando_abrir_puerta', { ipPanel, numeroPuerta });

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

const borrarLogsPanel = async (req, res) => {
  try {
    const { ipPanel } = req.body;

    if (!ipPanel) {
      return res.status(400).json({ mensaje: "Falta la ipPanel" });
    }

    const io = req.app.get('io');

    // Verificamos que haya al menos un agente conectado antes de decir "éxito"
    const sockets = await io.fetchSockets();
    if (sockets.length === 0) {
      return res.status(503).json({ mensaje: "No hay ningún agente local conectado en este momento" });
    }

    // Disparamos la orden de borrado al Agente en Windows
    io.emit('comando_borrar_logs', { ipPanel });

    res.status(200).json({
      exito: true,
      mensaje: `Orden de borrado de memoria enviada al Agente para el panel ${ipPanel}`
    });

  } catch (error) {
    console.error("Error pidiendo borrado de logs:", error);
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

const updatePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const panelActualizado = await Panel.findByIdAndUpdate(id, req.body, { new: true });

    if (!panelActualizado) {
      return res.status(404).json({ message: "Panel no encontrado" });
    }

    return res.status(200).json({
      exito: true,
      mensaje: "Panel actualizado con éxito",
      body: panelActualizado
    });
  } catch (error) {
    console.error("Error al actualizar panel:", error);
    return res.status(500).json({ message: "Error al actualizar panel", error: error.message });
  }
};

const deletePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const panelEliminado = await Panel.findByIdAndDelete(id);

    if (!panelEliminado) {
      return res.status(404).json({ message: "Panel no encontrado" });
    }

    return res.status(200).json({ exito: true, mensaje: "Panel eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar panel", error: error.message });
  }
};

// Actualiza únicamente el nombre de una puerta dentro de un panel
const updateDoorName = async (req, res) => {
  try {
    const { panelId, puertaId } = req.params;
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ exito: false, mensaje: "El nombre de la puerta es requerido." });
    }

    const panelActualizado = await Panel.findOneAndUpdate(
      { _id: panelId, "puertas._id": puertaId },
      { $set: { "puertas.$.nombre": nombre.trim() } },
      { new: true }
    );

    if (!panelActualizado) {
      return res.status(404).json({ exito: false, mensaje: "Panel o puerta no encontrada." });
    }

    return res.status(200).json({
      exito: true,
      mensaje: "Nombre de puerta actualizado con éxito.",
      body: panelActualizado
    });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: "Error al actualizar la puerta", error: error.message });
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

const crearAccessGroup = async (req, res) => {
  try {
    const nuevoGrupo = new AccessGroup(req.body);
    const grupoGuardado = await nuevoGrupo.save();
    return res.status(201).json({ message: "New group added", exito: true, body: grupoGuardado });
  } catch (error) {
    return res.status(400).json({ message: "Error al crear grupo de acceso", error: error.message });
  }
};

const updateAccessGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const grupoActualizado = await AccessGroup.findByIdAndUpdate(id, req.body, { new: true });

    if (!grupoActualizado) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    return res.status(200).json({ message: "Group Updated", exito: true, body: grupoActualizado });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar grupo", error: error.message });
  }
};

const deleteAccessGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const grupoEliminado = await AccessGroup.findByIdAndDelete(id);

    if (!grupoEliminado) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    return res.status(200).json({ exito: true, mensaje: "Grupo eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar grupo", error: error.message });
  }
};

const getCredentials = async (req, res) => {
  try {
    const { companyId } = req.params;

    const credenciales = await AccessCredential.find()
      .populate('accessGroup')
      .populate({
        path: 'employee',
        populate: [
          { path: "department" }
        ]
      });

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
      const accesosEnPanel = cred.accessGroup.doors.filter(door => door.panelIp === ipPanel);

      if (accesosEnPanel.length > 0) {
        // Unimos todas las puertas encontradas separadas por coma
        const puertasCombinadas = accesosEnPanel.map(d => d.numeroRelevador).join(',');

        credencialesParaEnviar.push({
          pin: cred.personnelId,
          tarjeta: cred.cardNumber,
          puerta: puertasCombinadas,
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

//Crear una crendencial nueva en DB
const createNewCredential = async (req, res) => {
  const { CompanyId } = req.params;

  try {
    const {
      personnelId,
      cardNumber,
      employee,
      guestName,
      accessGroup,
      active
    } = req.body;

    if (employee !== 'NoEmployee') {
      const foundEmployee = await Employees.findById(employee);
      if (!foundEmployee) {
        return res.status(404).json({ status: "error", message: "Empleado no encontrado" });
      }
    }

    const foundGroup = await AccessGroup.findById(accessGroup);
    if (!foundGroup) {
      return res.status(404).json({ status: "error", message: "Grupo de acceso no encontrado" });
    }

    const newCredential = new AccessCredential({
      personnelId,
      cardNumber,
      employee: employee === 'NoEmployee' ? null : employee,
      guestName,
      accessGroup,
      active
    });

    await newCredential.save();

    const io = req.app.get('io');
    const pin = newCredential.personnelId;
    const tarjeta = newCredential.cardNumber;
    const timezone = foundGroup.timeZone.idZKTeco;

    // AGRUPAMOS LAS PUERTAS POR IP
    const accesosAgrupados = {};
    if (foundGroup.doors && foundGroup.doors.length > 0) {
      for (const door of foundGroup.doors) {
        if (door.panelIp && door.numeroRelevador) {
          if (!accesosAgrupados[door.panelIp]) {
            accesosAgrupados[door.panelIp] = [];
          }
          // Solo agregamos la puerta si no estaba ya (evitar duplicados)
          if (!accesosAgrupados[door.panelIp].includes(door.numeroRelevador)) {
            accesosAgrupados[door.panelIp].push(door.numeroRelevador);
          }
        }
      }
    }

    // ENVIAMOS UNA SOLA INYECCIÓN POR PANEL (Con las puertas combinadas)
    for (const ip in accesosAgrupados) {
      io.emit('comando_enviar_credencial', {
        ipPanel: ip,
        pin: pin,
        tarjeta: tarjeta,
        puerta: accesosAgrupados[ip].join(','), // Esto enviará "1" o "1,3" o "1,2,3,4"
        timezone: timezone
      });
    }

    res.status(201).json({ status: "200", message: "New credential register", body: newCredential });
  } catch (error) {
    console.error("Error en Crear credencial:", error);
    res.status(500).json({ status: "500", message: "Internal Server Error" });
  }
};

//Actualizar una crendencial nueva en DB
const updateCredential = async (req, res) => {
  const { CredentialId } = req.params;

  try {
    const {
      personnelId,
      cardNumber,
      employee,
      guestName,
      accessGroup,
      active
    } = req.body;

    const oldCredential = await AccessCredential.findById(CredentialId);
    if (!oldCredential) {
      return res.status(404).json({ status: "error", message: "Credencial no encontrada" });
    }
    const oldPersonnelId = oldCredential.personnelId;

    if (employee !== 'NoEmployee') {
      const foundEmployee = await Employees.findById(employee);
      if (!foundEmployee) {
        return res.status(404).json({ status: "error", message: "Empleado no encontrado" });
      }
    }

    const foundGroup = await AccessGroup.findById(accessGroup);
    if (!foundGroup) {
      return res.status(404).json({ status: "error", message: "Grupo de acceso no encontrado" });
    }

    const pinesABorrar = [oldPersonnelId];

    if (oldPersonnelId !== personnelId) {
      pinesABorrar.push(personnelId);
    }

    const allPanels = await Panel.find({}, 'ip');
    const ipsTodosLosPaneles = allPanels.map(panel => panel.ip);

    const accesosAgrupados = {};
    if (active && foundGroup.doors && foundGroup.doors.length > 0) {
      for (const door of foundGroup.doors) {
        if (door.panelIp && door.numeroRelevador) {
          if (!accesosAgrupados[door.panelIp]) {
            accesosAgrupados[door.panelIp] = [];
          }
          if (!accesosAgrupados[door.panelIp].includes(door.numeroRelevador)) {
            accesosAgrupados[door.panelIp].push(door.numeroRelevador);
          }
        }
      }
    }

    const arregloAccesos = [];
    for (const ip in accesosAgrupados) {
      arregloAccesos.push({
        ipPanel: ip,
        puerta: accesosAgrupados[ip].join(',') // Genera las puertas separadas por coma
      });
    }

    const updateCard = await AccessCredential.findByIdAndUpdate(
      CredentialId,
      {
        $set: {
          personnelId,
          cardNumber,
          employee: employee === 'NoEmployee' ? null : employee,
          guestName,
          accessGroup,
          active
        }
      },
      { new: true }
    );

    const io = req.app.get('io');
    io.emit('comando_actualizar_credencial_lote', {
      pinesABorrar,
      ipsTodosLosPaneles,
      pinNuevo: personnelId,
      tarjetaNueva: cardNumber,
      timezone: foundGroup.timeZone.idZKTeco,
      accesosNuevos: arregloAccesos
    });

    res.status(200).json({ status: "200", message: "Credential updated and synchronization started", body: updateCard });
  } catch (error) {
    console.error("Error en Actualizar credencial:", error);
    res.status(500).json({ status: "500", message: "Internal Server Error" });
  }
};

const getAccessLogsData = async (req, res) => {
  const { CompanyId } = req.params;

  try {
    const [logs, panels, credentials, employeesList] = await Promise.all([
      AccessLog.find()
        .sort({ verifiedTime: -1 })
        .limit(1000)
        .lean()
        .catch(() => []),

      Panel.find().lean().catch(() => []),

      AccessCredential.find({
        $or: [{ company: CompanyId }, { companyId: CompanyId }]
      }).lean().catch(() => []),

      Employees.find({
        $or: [{ company: CompanyId }, { companyId: CompanyId }]
      }).lean().catch(() => [])
    ]);

    const activePanels = panels.length ? panels : await Panel.find().lean().catch(() => []);
    const activeEmployees = employeesList.length ? employeesList : await Employees.find().lean().catch(() => []);
    const activeCredentials = credentials.length ? credentials : await AccessCredential.find().lean().catch(() => []);

    // 1. Mapa de Paneles asociando p.ip con p.nombre
    const panelMap = new Map();
    activePanels.forEach(p => {
      if (p.ip) {
        const cleanIp = String(p.ip).trim();
        panelMap.set(cleanIp, p.nombre || cleanIp);
      }
    });

    // Mapa de Puertas: clave "ip|numeroRelevador" -> nombre de la puerta
    const doorMap = new Map();
    activePanels.forEach(p => {
      if (p.ip && Array.isArray(p.puertas)) {
        const cleanIp = String(p.ip).trim();
        p.puertas.forEach(puerta => {
          doorMap.set(`${cleanIp}|${puerta.numeroRelevador}`, puerta.nombre);
        });
      }
    });

    // 2. Mapa de Empleados
    const employeeMap = new Map();
    activeEmployees.forEach(e => {
      const fn = e.firstName || e.name || '';
      const ln = e.lastName || '';
      const fullName = `${fn} ${ln}`.trim();

      if (e.numberEmployee) employeeMap.set(String(e.numberEmployee).trim(), fullName);
      if (e._id) employeeMap.set(String(e._id), fullName);
    });

    // 3. Mapa de Credenciales
    const credCardMap = new Map();
    const credPersonnelMap = new Map();

    activeCredentials.forEach(c => {
      const empName = employeeMap.get(String(c.employee)) || c.guestName || '';
      if (c.cardNumber) credCardMap.set(String(c.cardNumber).trim(), empName);
      if (c.personnelId) credPersonnelMap.set(String(c.personnelId).trim(), empName);
    });

    // 4. Mapeo de Logs
    const formattedLogs = logs.map(log => {
      const logCard = String(log.cardNumber || '').trim();
      const logPersonnel = String(log.personnelId || '').trim();

      const employeeName =
        employeeMap.get(logPersonnel) ||
        credPersonnelMap.get(logPersonnel) ||
        credCardMap.get(logCard) ||
        "----------";

      let dateStr = '---';
      let timeStr = '---';

      if (log.verifiedTime) {
        try {
          const dateObj = log.verifiedTime instanceof Date
            ? log.verifiedTime
            : new Date(log.verifiedTime);

          if (!isNaN(dateObj.getTime())) {
            const isoStr = dateObj.toISOString();
            const [datePart, timeWithZ] = isoStr.split('T');
            const [year, month, day] = datePart.split('-');
            const timePart = timeWithZ.substring(0, 8);
            const [hh, mm, ss] = timePart.split(':');

            dateStr = `${day}/${month}/${year}`;

            let hourNum = parseInt(hh, 10);
            const ampm = hourNum >= 12 ? 'p.m.' : 'a.m.';
            hourNum = hourNum % 12 || 12;
            const hourFormatted = String(hourNum).padStart(2, '0');

            timeStr = `${hourFormatted}:${mm}:${ss} ${ampm}`;
          }
        } catch (e) {
          console.error("Error al formatear fecha:", e);
        }
      }

      const logIp = String(log.panelIp || '').trim();
      const doorName = doorMap.get(`${logIp}|${log.doorNumber}`) || (log.doorNumber ? `Puerta ${log.doorNumber}` : '---');

      return {
        _id: log._id,
        panelIp: logIp,
        panelName: panelMap.get(logIp) || (logIp ? `Panel (${logIp})` : 'Desconocido'),
         doorName: doorName,
        cardNumber: log.cardNumber || '---',
        personnelId: log.personnelId || '---',
        employeeName: employeeName,
        date: dateStr,
        time: timeStr,
        verifiedTime: log.verifiedTime
      };
    });

    // Lista formateada de paneles enviada al selector del cliente
    const panelsList = activePanels.map(p => ({
      ip: p.ip,
      name: p.nombre || p.ip
    }));

    res.json({
      status: "200",
      message: "Access logs loaded successfully",
      logs: formattedLogs,
      panels: panelsList
    });

  } catch (error) {
    console.error("Error fetching access logs:", error);
    res.status(500).json({ status: "500", message: "Server error fetching access logs" });
  }
};

module.exports = {
  abrirPanelRemoto,
  sincronizarLogsPanel,
  getPaneles,
  crearPanel,
  updatePanel,
  deletePanel,
  configurarHorarioPanel,
  enviarCredencialUnica,
  sincronizarTodoElPanel,
  eliminarCredencialUnica,
  getCredentials,
  getAccessGroups,
  createNewCredential,
  updateCredential,
  crearAccessGroup,
  updateAccessGroup,
  deleteAccessGroup,
  updateDoorName,
  getAccessLogsData,
  borrarLogsPanel
};


