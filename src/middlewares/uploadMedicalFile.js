const multer = require("multer");
const multerS3 = require("multer-s3");
const shortid = require("shortid");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

const ALLOWED_EXT = [".pdf", ".jpg", ".jpeg", ".png"];

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, "Uploads/MedicalDocs/" + shortid.generate() + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXT.includes(ext)) {
            return cb(new Error("Formato no permitido (solo PDF, JPG o PNG)"));
        }
        cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB por archivo
});

// Hasta 5 archivos por envío, campo "documents"
module.exports = upload.array("documents", 5);