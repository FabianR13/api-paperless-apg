const nodemailer = require('nodemailer');
const Deviation = require('../models/Deviation.js'); // Asegúrate de importar tu modelo
const dotenv = require('dotenv');
// Ajusta la ruta a tu .env si es necesario
dotenv.config({ path: "D:\\Paperless GIT\\api-paperless-apg\\src\\.env" });

// Configuración del Transporter (Reutilizando la tuya)
let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
    },
    secureConnection: false,
    tls: { ciphers: "SSLv3" },
});

const autoSendDeviationAlerts = async () => {
    try {

        console.log("Iniciando escaneo de desviaciones para alertas...");

        const openDeviations = await Deviation.find({
            deviationStatus: { $nin: ["Closed", "Rejected"] },
            closureDate: { $exists: true, $ne: null } // Que tengan fecha compromiso
        });

        const alertasPorVencer = []; // Faltan 3 días
        const alertasVencenHoy = []; // Vencen hoy
        const alertasVencidas = [];  // Vencidas hace 5, 10, 15... días

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        openDeviations.forEach(dev => {
            const dateString = dev.closureDate.toISOString().split('T')[0];
            const closeDate = new Date(dateString + 'T00:00:00');
            closeDate.setHours(0, 0, 0, 0);
            console.log(closeDate)
            const diffTime = closeDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log(diffDays)
            if (diffDays === 3) {
                alertasPorVencer.push(dev);
            }

            if (diffDays === 0) {
                alertasVencenHoy.push(dev);
            }

            if (diffDays < 0) {
                const diasVencidos = Math.abs(diffDays);
                if (diasVencidos % 5 === 0) {
                    dev.diasRetraso = diasVencidos;
                    alertasVencidas.push(dev);
                }
            }
        });

        if (alertasPorVencer.length === 0 && alertasVencenHoy.length === 0 && alertasVencidas.length === 0) {
            console.log("No hay alertas de desviación para hoy.");
            return;
        }

        let htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #d32f2f;">Daily Deviations Report</h2>
                <p>This is an automated message from the Paperless APG system.</p>
        `;

        if (alertasVencenHoy.length > 0) {
            htmlContent += `
            <h3 style="background-color: #d3842f; color: white; padding: 5px;">🚨 EXPIRING TODAY (${alertasVencenHoy.length})</h3>
            <ul>
                ${alertasVencenHoy.map(d => `<li><strong>${d.deviationNumber}</strong></li>`).join('')}
            </ul>
        `;
        }

        if (alertasVencidas.length > 0) {
            htmlContent += `
            <h3 style="background-color: #d32f2f; color: white; padding: 5px;">⚠️ OVERDUE - FOLLOW UP (${alertasVencidas.length})</h3>
            <p>These deviations remain open and are notified every 5 days of delay.</p>
            <ul>
                ${alertasVencidas.map(d => `<li><strong>${d.deviationNumber}</strong> - <strong>${d.diasRetraso} days ago</strong>. (Closure Date: ${d.closureDate.toISOString().substring(0, 10)})</li>`).join('')}
            </ul>
        `;
        }

        if (alertasPorVencer.length > 0) {
            htmlContent += `
            <h3 style="background-color: #fbc02d; color: black; padding: 5px;">📅 UPCOMING EXPIRATIONS (In 3 days)</h3>
            <ul>
                ${alertasPorVencer.map(d => `<li><strong>${d.deviationNumber}</strong> - Expires on: ${d.closureDate.toISOString().substring(0, 10)}</li>`).join('')}
            </ul>
        `;
        }

        htmlContent += `
            <br>
            <p>Please check the platform for follow-up:</p>
            <div style="margin: 20px 0;">
                <a href="https://axiompaperless.com/" style="background-color: #ad5f17; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Go to Paperless
                </a>
            </div>
            <p style="font-size: 0.9em; color: #555;">Link: <a href="https://axiompaperless.com/">https://axiompaperless.com/</a></p>
        </div>
        `;

        const mailOptions = {
            from: 'paperless@apgmexico.mx',
            to: 'fabian.ramos@apgmexico.mx', // para mas correos usar comas para separarlos
            subject: `⚠️ APG Deviations Alert - ${new Date().toLocaleDateString()}`,
            html: htmlContent,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending deviations alert: ', error);
            } else {
                console.log('Alert email sent successfully');
            }
        });
        
    } catch (error) {
        console.error("Error en la función autoSendDeviationAlerts:", error);
    }
};

module.exports = { autoSendDeviationAlerts };