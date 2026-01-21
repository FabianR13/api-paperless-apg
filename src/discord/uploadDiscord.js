// src/utils/uploadDiscord.js
const AWS = require('aws-sdk');
const axios = require('axios');
const shortid = require("shortid");
const dotenv = require('dotenv');

// Ajusta la ruta a tu .env si es necesario
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
});

const s3 = new AWS.S3();

/**
 * Descarga un archivo desde Discord y lo sube a S3
 */
async function uploadToS3FromUrl(discordUrl, contentType) {
    try {
        // 1. Obtener el stream del archivo desde Discord
        const response = await axios({
            method: 'GET',
            url: discordUrl,
            responseType: 'stream'
        });

        const extension = contentType.split('/')[1] || 'bin';
        const fileName = `${shortid.generate()}.${extension}`;
        
        // 2. Definir parámetros de subida (Cambiamos la carpeta a /Courses/)
        const params = {
            Bucket: process.env.S3_BUCKET_NAME, // Asegúrate que el bucket base esté bien
            Key: `Uploads/Courses/${fileName}`, 
            Body: response.data,
            ContentType: contentType
        };

        // 3. Subir
        const data = await s3.upload(params).promise();
        return {
            url: data.Location, // URL pública/accesible de S3
            key: data.Key
        };
    } catch (error) {
        console.error("Error subiendo a S3:", error);
        throw error;
    }
}

module.exports = { uploadToS3FromUrl };