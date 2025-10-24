const AWS = require('aws-sdk');

const multer = require('multer');

const multerS3 = require('multer-s3');

const shortid = require("shortid");

const dotenv = require('dotenv');

const path = require('path'); // Necesario para obtener la extensión del archivo
// Asegúrate de que esta ruta a tu archivo .env sea correcta para tu entorno de ejecución.


dotenv.config({
  path: "C:\\api-paperless-apg\\src\\.env"
}); ///Configuracion para acceder a bucket s3///

AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  apiVersion: 'latest',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
});
const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME + "/Uploads/FaqImgs",
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: (req, file, cb) => {
      const fieldName = file.fieldname;
      const match = fieldName.match(/images\[(\d+)\]\[file\]/); // Intenta extraer el índice

      let idParaNombreArchivo = "paso_desconocido"; // Valor por defecto

      if (match && match[1]) {
        const index = match[1]; // El índice extraído, ej: "0", "1", etc.

        idParaNombreArchivo = index; // Usamos el índice directamente
      } else {
        console.warn(`No se pudo parsear el índice desde fieldName: ${fieldName}. Se usará id por defecto para el nombre del archivo.`);
      } // Sanitizar el idParaNombreArchivo (que ahora es el índice)


      const sanitizedId = String(idParaNombreArchivo).replace(/[^a-zA-Z0-9_-]/g, '_');
      const nuevoNombreArchivo = `${sanitizedId}_${shortid.generate()}.jpeg`; // Ej: "0_xxxx.jpeg", "1_xxxx.jpeg"

      cb(null, nuevoNombreArchivo);
    }
  }) // limits: { fileSize: 1024 * 1024 * 5 }

});
const uploadFaqImages = upload.any();
module.exports = uploadFaqImages;