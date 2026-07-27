const axios = require('axios');
const shortid = require("shortid");
const dotenv = require('dotenv');

dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

//Actualizacion de sdk de aws v3
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

async function uploadToS3FromUrl(discordUrl, contentType) {
    try {
        const response = await axios({
            method: 'GET',
            url: discordUrl,
            responseType: 'stream'
        });
        const extension = contentType.split('/')[1] || 'bin';
        const fileName = `${shortid.generate()}.${extension}`;
        const key = `Uploads/Courses/${fileName}`;

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: response.data,
            ContentType: contentType
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${key}`;
        return {
            url,
            key
        };
    } catch (error) {
        console.error("Error subiendo a S3 con SDK v3:", error);
        throw error;
    }
}

module.exports = { uploadToS3FromUrl };