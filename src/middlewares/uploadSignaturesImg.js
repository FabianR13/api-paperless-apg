const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const shortid = require("shortid");
const path = require('path'); 
const dotenv = require('dotenv');

dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

AWS.config.update({
    region: process.env.S3_BUCKET_REGION,
    apiVersion: 'latest',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
})

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME + "/Uploads/KaizenInvestigationSings",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, shortid.generate() + ".png");
        }
    })
});

/// 2. CAMBIO DE CAMPOS: Aceptamos las 3 firmas posibles ///
const uploadInvestigationSignatures = upload.fields([
    { name: "advisorSignature", maxCount: 1 },
    { name: "managerSignature", maxCount: 1 },
    { name: "topManagerSignature", maxCount: 1 }
]);

module.exports = uploadInvestigationSignatures;