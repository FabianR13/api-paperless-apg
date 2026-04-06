// index.js

const cluster = require('cluster');
const os = require('os');

const WORKERS = process.env.WEB_CONCURRENCY || 2;

if (cluster.isPrimary) {
    console.log(`[Master] Hilo principal PID ${process.pid} en ejecución`);
    console.log(`[Master] Iniciando ${WORKERS} ...`);
    require('dotenv').config();
    require("./database");

    // --- CRON JOBS MOVIDOS AL MASTER ---
    const cron = require('node-cron');
    const { autoSendDeviationAlerts } = require("./controllers/emailNotification.controller.js");

    cron.schedule('06 18 * * *', () => {
        console.log("⏰ Ejecutando tarea programada: Alerta de Desviaciones (Desde el Master)");
        autoSendDeviationAlerts();
    }, {
        scheduled: true,
        timezone: "America/Mexico_City"
    });

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

    // bot de Discord
    // const { connectDiscordBot } = require("./discord/bot.js"); 
    // connectDiscordBot();

    app.set('port', process.env.PORT || 4000);

    app.listen(app.get('port'), () => {
        console.log(`[Worker] PID ${process.pid} escuchando en el puerto ${app.get('port')}`);
    });
}