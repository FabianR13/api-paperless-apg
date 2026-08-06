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
                const logObj = {};
                // Separamos por comas y luego por el signo igual
                linea.split(',').forEach(par => {
                    const [key, value] = par.split('=');
                    if (key && value) logObj[key.trim()] = value.trim();
                });

                // ZKTeco a veces etiqueta la fecha como Time o Time_second
                const fechaLog = logObj.Time_second || logObj.Time;
                const numPuerta = logObj.DoorID || logObj.DoorId || 1;

                if (!fechaLog || !logObj.Pin || logObj.Pin === "0") continue;

                let employeeId = null;
                const emp = await Employees.findOne({ numberEmployee: logObj.Pin });
                if (emp) employeeId = emp._id;

                try {
                    await AccessLog.create({
                        panelIp: ipPanel,
                        personnelId: logObj.Pin,
                        cardNumber: logObj.Cardno || '',
                        doorNumber: parseInt(numPuerta),
                        eventType: parseInt(logObj.EventType) || 0,
                        verifiedTime: new Date(fechaLog),
                        employee: employeeId
                    });
                    insertados++;
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