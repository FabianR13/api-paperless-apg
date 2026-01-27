const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const shortid = require("shortid");
const dotenv = require('dotenv')
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

///Configuracion para acceder a bucket s3///
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
        bucket: process.env.S3_BUCKET_NAME + "/Uploads/RewardsKaizenImg",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, shortid.generate() + ".jpeg");
        }
    })
});

///Metodo para subir una sola imagen///
const uploadRewardImg = upload.fields([
    { name: "rewardImage", maxCount: 1 }
]);

module.exports = uploadRewardImg;