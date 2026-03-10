// utils/emailNotifier.js
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Ajusta la ruta a tu modelo User
const Role = require('../models/Role'); // Ajusta la ruta a tu modelo Role

const dotenv = require('dotenv');
dotenv.config({ path: "D:\\Paperless GIT\\api-paperless-apg\\src\\.env" });

// Configuración de tu servidor de correos (Ajusta con tus credenciales reales o variables de entorno)
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

const sendAuditCompletionEmail = async (audit, shiftName) => {
    try {
        // 1. Buscar el ObjectId del rol "DailyAuditNotify"
        const notifyRole = await Role.findOne({ name: 'DailyAuditNotify' });
        if (!notifyRole) {
            console.error("Role 'DailyAuditNotify' no encontrado en la BD.");
            return;
        }

        // 2. Buscar todos los usuarios que tengan ese rol en su arreglo de roles
        const usersToNotify = await User.find({ roles: notifyRole._id });
        const emails = usersToNotify.map(user => user.email).filter(email => email);

        if (emails.length === 0) {
            console.log("No hay usuarios con el rol DailyAuditNotify para enviar el correo.");
            return;
        }

        // 3. Extraer la información dependiendo de qué turno se completó
        let auditorName = 'Unknown';
        let generalComments = 'No comments';

        if (shiftName === 'Shift 1') {
            const emp = audit.assignedToD?.employee?.[0];
            if (emp) auditorName = `${emp.name} ${emp.lastName}`;
            generalComments = audit.generalCommentsD || 'N/A';
        } else {
            const emp = audit.assignedToA?.employee?.[0];
            if (emp) auditorName = `${emp.name} ${emp.lastName}`;
            generalComments = audit.generalCommentsA || 'N/A';
        }

        // 4. Filtrar solo las observaciones del turno que se completó
        const shiftObservations = audit.observations.filter(obs => obs.shift === shiftName);

        // 5. Construir la lista HTML de observaciones
        let obsHtml = '';
        if (shiftObservations.length > 0) {
            obsHtml = '<ul style="padding-left: 20px;">' + shiftObservations.map(obs => {
                // Como hicimos populate en el controlador, partNumber es un objeto con el arreglo 'partnumber'
                const partNoStr = obs.partNumber?.partnumber ? obs.partNumber.partnumber.join(' / ') : 'Unknown Part';
                return `
                    <li style="margin-bottom: 10px;">
                        <b>Location:</b> ${obs.location} <br/>
                        <b>Part No:</b> ${partNoStr} <br/>
                        <b>Comments:</b> ${obs.comments || 'N/A'}
                    </li>`;
            }).join('') + '</ul>';
        } else {
            obsHtml = '<p>No observations added for this shift.</p>';
        }

        const formattedDate = new Date(audit.auditDay).toISOString().substring(0, 10);

        // 6. Configurar el correo y enviarlo
        const mailOptions = {
            from: process.env.MAIL_AUTH_USER,
            to: emails.join(','), 
            subject: `✅ Daily Audit Completed - ${shiftName} (${formattedDate})`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #4CAF50;">Daily Audit Completed</h2>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Shift:</strong> ${shiftName}</p>
                    <p><strong>Auditor:</strong> ${auditorName}</p>
                    
                    <hr style="border: 1px solid #ddd; margin: 20px 0;"/>
                    
                    <h3 style="color: #555;">General Comments</h3>
                    <p style="background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
                        ${generalComments}
                    </p>

                    <h3 style="color: #555;">Observations</h3>
                    ${obsHtml}
                    
                    <p style="margin-top: 30px; font-size: 12px; color: #888;">
                        This is an automated notification from your Audit System.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo de ${shiftName} enviado exitosamente a ${emails.length} destinatarios.`);

    } catch (error) {
        console.error("Error enviando el correo de auditoría:", error);
    }
};

module.exports = { sendAuditCompletionEmail };