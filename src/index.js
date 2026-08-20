// index.js (SERVIDOR - Express/Mongo/Socket.io, NO confundir con el agente de Windows)

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

    // 1. IMPORTAR MODELO PARA LOS LOGS
    const AccessLog = require('./models/AccessLog'); // <-- Ajusta la ruta si es necesario

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

    // ==========================================
    // CONVERSIÓN DE FECHA: ZKTeco NO usa epoch Unix (1970)
    // ==========================================
    // El campo Time_second del panel es "segundos transcurridos desde el
    // 1 de enero del año 2000, 00:00:00" (hora local del panel), NO segundos
    // desde 1970 como asume por defecto `new Date(numero)` en JS.
    // Pasar el número crudo directo a `new Date()` genera una fecha en 1970,
    // silenciosamente incorrecta (sin error visible).
    function convertirFechaZK(timeSecondRaw) {
        let valor = parseInt(timeSecondRaw, 10);
        if (isNaN(valor)) return null;

        const segundo = valor % 60;
        valor = Math.floor(valor / 60);

        const minuto = valor % 60;
        valor = Math.floor(valor / 60);

        const hora = valor % 24;
        valor = Math.floor(valor / 24);

        const dia = (valor % 31) + 1;
        valor = Math.floor(valor / 31);

        const mes = valor % 12; // Enero = 0, Agosto = 7
        valor = Math.floor(valor / 12);

        const anio = valor + 2000;

        return new Date(anio, mes, dia, hora, minuto, segundo);
    }

    // Escuchar conexiones del Agente Local
    io.on('connection', (socket) => {
        console.log(`[Worker ${process.pid}] 🔌 Agente Local conectado. ID: ${socket.id}`);

        socket.on('respuesta_apertura', (data) => {
            console.log(`[Worker ${process.pid}] ✅ Respuesta del panel:`, data);
        });

        // RECIBIR Y GUARDAR LOS LOGS
        socket.on('respuesta_logs_panel', async (datos) => {
            const { ipPanel, logsRaw } = datos;
            console.log(`[Worker ${process.pid}] 📥 Recibidas ${logsRaw.length} líneas del panel ${ipPanel}`);

            if (logsRaw.length < 2) {
                console.log(`[Worker ${process.pid}] ⚠️ No hay datos suficientes (solo encabezado o vacío)`);
                return;
            }
            const encabezado = logsRaw[0].split(',').map(h => h.trim());
            console.log(`[Worker ${process.pid}] 🔎 Encabezado detectado:`, encabezado);
            
            const documentosParaInsertar = [];
            let fechasInvalidas = 0;

            for (let i = 1; i < logsRaw.length; i++) {
                const valores = logsRaw[i].split(',').map(v => v.trim());
                const logObj = {};
                encabezado.forEach((campo, idx) => {
                    logObj[campo] = valores[idx];
                });

                const timeSecondRaw = logObj.Time_second || logObj.Time;
                const numPuerta = logObj.DoorID || logObj.DoorId || 1;

                if (!timeSecondRaw || !logObj.Pin || logObj.Pin === "0") continue;

                const fechaConvertida = convertirFechaZK(timeSecondRaw);
                if (!fechaConvertida) {
                    fechasInvalidas++;
                    continue;
                }

                documentosParaInsertar.push({
                    panelIp: ipPanel,
                    personnelId: logObj.Pin,
                    cardNumber: logObj.Cardno || logObj.CardNo || '',
                    doorNumber: parseInt(numPuerta),
                    eventType: parseInt(logObj.EventType) || 0,
                    verifiedTime: fechaConvertida
                });
            }

            let insertados = 0;
            if (documentosParaInsertar.length > 0) {
                try {
                    const resultado = await AccessLog.insertMany(documentosParaInsertar, { ordered: false });
                    insertados = resultado.length;
                } catch (err) {
                    insertados = err.insertedDocs ? err.insertedDocs.length : (err.result ? err.result.nInserted : 0);
                    console.error(`[Worker ${process.pid}] ⚠️ Algunos documentos fallaron (duplicados u otro error):`, err.writeErrors ? err.writeErrors.length : err.message);
                }
            }

            console.log(`[Worker ${process.pid}] ✔️ Total guardados: ${insertados}${fechasInvalidas > 0 ? ` (⚠️ ${fechasInvalidas} con fecha inválida, omitidos)` : ''}`);

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