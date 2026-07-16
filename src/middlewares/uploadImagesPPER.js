const multer = require('multer');
const multerS3 = require('multer-s3');
const shortid = require("shortid");
const dotenv = require('dotenv')
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
        bucket: process.env.S3_BUCKET_NAME + "/Uploads/PPERequests",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, shortid.generate() + ".jpeg");
        }
    })
});

const uploadPPEImage = upload.single("images");

module.exports = uploadPPEImage;