const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const shortid = require("shortid");
const dotenv = require('dotenv');
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" }); // Asegúrate que esta ruta sea correcta

///Configuracion para acceder a bucket s3///
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
        bucket: process.env.S3_BUCKET_NAME + "/Uploads/FaqImgs", // Considera si esta ruta de bucket sigue siendo la adecuada
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            // Es buena práctica usar el mimetype para la extensión o extraerla del originalname
            // const extension = file.mimetype.split('/')[1] || 'jpeg'; // Ejemplo
            cb(null, shortid.generate() + ".jpeg"); // Actualmente fuerza la extensión a .jpeg
        }
    })
    // Puedes agregar límites globales aquí si es necesario, por ejemplo, tamaño de archivo
    // limits: { fileSize: 1024 * 1024 * 5 } // Límite de 5MB por archivo, por ejemplo
});

///Metodo para subir multiples imagenes bajo un solo campo 'images' sin límite específico de Multer///
const uploadFaqImages = upload.array('images'); // No se especifica maxCount para "ilimitado" (Multer procesará todos los archivos enviados bajo este nombre)

module.exports = uploadFaqImages;