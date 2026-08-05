// index.js

const cluster = require('cluster');
const os = require('os');
const { setupPrimary } = require("@socket.io/cluster-adapter");

const WORKERS = process.env.WEB_CONCURRENCY || 2;

if (cluster.isPrimary) {
    console.log(`[Master] Hilo principal PID ${process.pid} en ejecución`);
    console.log(`[Master] Iniciando ${WORKERS} ...`);
    require('dotenv').config();
    require("./database");

    // --- CRON JOBS MOVIDOS AL MASTER ---
    const cron = require('node-cron');
    const {
        autoSendDeviationAlerts,
        sendApgGreenAlert,
        sendPausaActivaAlert
    } = require("./controllers/emailNotification.controller.js");

    // 1. Pausa Activa: Lunes a Viernes a las 10:00 AM, 1:00 PM (13 hrs) y 4:00 PM (16 hrs)
    // cron.schedule('00 10,13,16 * * 1-5', () => {
    //     console.log("⏰ Ejecutando cron: Pausa Activa");
    //     sendPausaActivaAlert();
    // }, {
    //     scheduled: true,
    //     timezone: "America/Mexico_City"
    // });

    // 2. APG Green: Lunes a Viernes a las 5:00 PM (17 hrs)
    // cron.schedule('00 17 * * 1-5', () => {
    //     console.log("⏰ Ejecutando cron: APG Green");
    //     sendApgGreenAlert();
    // }, {
    //     scheduled: true,
    //     timezone: "America/Mexico_City"
    // });

    // cron.schedule('06 18 * * *', () => {
    //     console.log("⏰ Ejecutando tarea programada: Alerta de Desviaciones (Desde el Master)");
    //     autoSendDeviationAlerts();
    // }, {
    //     scheduled: true,
    //     timezone: "America/Mexico_City"
    // });
    setupPrimary();
    // Clonamos la API
    for (let i = 0; i < WORKERS; i++) {
        cluster.fork();
    }

    // Si un worker crashea por falta de memoria u otro error, levantamos uno nuevo
    cluster.on('exit', (worker, code, signal) => {
        console.log(`[Worker] PID ${worker.process.pid} se detuvo. Levantando un nuevo clon...`);
        cluster.fork();
    });

} else {
    // --- ESPACIO DE LOS WORKERS ---
    require('dotenv').config();
    const app = require("./app.js");
    require("./database");

    // 1. IMPORTAR MODELOS PARA LOS LOGS
    const AccessLog = require('./models/AccessLog'); // <-- Ajusta la ruta si es necesario
    const Employees = require('./models/Employees'); // <-- Ajusta la ruta si es necesario

    const http = require('http');
    const { Server } = require('socket.io');
    const { createAdapter } = require('@socket.io/cluster-adapter');

    // bot de Discord
    // const { connectDiscordBot } = require("./discord/bot.js"); 
    // connectDiscordBot();

    app.set('port', process.env.PORT || 4000);

    // Envolver Express en un servidor HTTP
    const server = http.createServer(app);

    // Inicializar Socket.io con el adaptador de clúster
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        adapter: createAdapter()
    });

    // Guardar la instancia global de Socket.io en Express para usarla en los controladores
    app.set('io', io);

    // Escuchar conexiones del Agente Local
    io.on('connection', (socket) => {
        console.log(`[Worker ${process.pid}] 🔌 Agente Local conectado. ID: ${socket.id}`);

        socket.on('respuesta_apertura', (data) => {
            console.log(`[Worker ${process.pid}] ✅ Respuesta del panel:`, data);
        });

        // 2. NUEVO EVENTO: RECIBIR Y GUARDAR LOS LOGS
        socket.on('respuesta_logs_panel', async (datos) => {
            const { ipPanel, logsRaw } = datos;
            console.log(`[Worker ${process.pid}] 📥 Recibidos ${logsRaw.length} registros del panel ${ipPanel}`);

            let insertados = 0;

            for (const linea of logsRaw) {
                console.log(`[Worker ${process.pid}] 📝 Línea cruda: ${linea}`);

                const partes = linea.split(',');
                
                // REORDENAMIENTO SEGÚN TU CAPTURA:
                // Partes[0] es la Fecha real ("2026-08-05 15:22:25")
                // La siguiente posición (o en la que venga tu PIN de empleado en el CSV) la asignamos al Pin.
                // Generalmente en GetRTLog el formato es: Fecha, Pin, Tarjeta, Puerta, Evento...
                
                const fechaReal = partes[0] ? partes[0].trim() : null;
                const pinEmpleado = partes[1] ? partes[1].trim() : null; // <--- Aquí viene el PIN real
                const tarjeta = partes[2] ? partes[2].trim() : '';
                const puerta = partes[3] ? partes[3].trim() : 1;
                const evento = partes[4] ? partes[4].trim() : 0;

                // Validaciones de seguridad
                if (!fechaReal || !pinEmpleado || pinEmpleado === "0") continue;

                let employeeId = null;
                const emp = await Employees.findOne({ numberEmployee: pinEmpleado });
                if (emp) employeeId = emp._id;

                try {
                    await AccessLog.create({
                        panelIp: ipPanel,
                        personnelId: pinEmpleado,    // Ahora sí guardará el número de empleado
                        cardNumber: tarjeta,
                        doorNumber: parseInt(puerta) || 1,
                        eventType: parseInt(evento) || 0,
                        verifiedTime: new Date(fechaReal), // Ahora sí guardará la fecha correcta del evento
                        employee: employeeId
                    });
                    insertados++;
                    console.log(`[Worker ${process.pid}] ✔️ ¡Checada guardada! Empleado: ${pinEmpleado} a las ${fechaReal}`);
                } catch (err) {
                    // Duplicados ignorados
                }
            }

            console.log(`[Worker ${process.pid}] ✔️ Total guardados: ${insertados}`);
            // ========================================================
            // ⚠️ ZONA DE PELIGRO: GATILLO DE BORRADO
            // ========================================================
            // Descomenta las siguientes dos líneas ÚNICAMENTE cuando hayas verificado 
            // en tu MongoDB que los registros se guardaron perfectamente.

            // io.emit('comando_borrar_logs', { ipPanel });
            // console.log(`[Worker ${process.pid}] 🔫 Orden de destrucción de memoria enviada al panel ${ipPanel}.`);
        });

        socket.on('disconnect', () => {
            console.log(`[Worker ${process.pid}] 🔴 Agente Local desconectado`);
        });
    });

    server.listen(app.get('port'), () => {
        console.log(`[Worker] PID ${process.pid} escuchando en el puerto ${app.get('port')}`);
    });
}