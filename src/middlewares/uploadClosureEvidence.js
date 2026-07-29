const multer = require('multer');
const multerS3 = require('multer-s3');
const shortid = require("shortid");
const path = require("path"); // <-- NECESARIO para leer la extensión (.pdf o .jpg)
const dotenv = require('dotenv');

dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

//Actualizacion de sdk de aws v3
const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME, // Tu nueva carpeta
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            // Extraemos la extensión original del archivo
            const extension = path.extname(file.originalname);
            // Generamos el shortid y le pegamos su extensión real
            cb(null, "Uploads/DeviationClosingFiles/" + shortid.generate() + extension);
        }
    })
});

/// Metodo para subir evidencias de cierre (PDFs e Imágenes) ///
const uploadClosureEvidence = upload.fields([
    { name: "newClosurePdfs", maxCount: 4 },
    { name: "newClosureImgs", maxCount: 4 }
]);

module.exports = uploadClosureEvidence;