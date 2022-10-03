const multer = require("multer");
const shortid = require("shortid");
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/.env'});

const region = process.env.S3_BUCKET_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const bucketName = process.env.S3_BUCKET_NAME;

const storage = new S3({
  region,
  accessKeyId,
  secretAccessKey
});


// Upload files
function uploadKaizenImgs(file) {
  const fileStream = fs.createReadStream(file.path)
  console.log(fileStream)
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: function (req, file, cb) {
      cb(null, shortid.generate() + ".jpeg");
    }
  }
  return s3.upload(uploadParams).promise()
};







// import multer from "multer";
// import shortid from "shortid";

// Save Locally the Files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "C:\\Paperless\\PAPERLESS-APG\\public\\Uploads\\KaizenImgs");
//     // cb(null, "E:\\Paperless\\PAPERLESS-APG\\build\\Uploads\\KaizenImgs");
//   },
//   filename: function (req, file, cb) {
//     cb(null, shortid.generate() + ".jpeg");
//   },
// });

// const upload = multer({ storage }); //Single Field Form

//  // Upload Multiple Fields Form
// const uploadKaizenImgs = upload.fields([
//     { name: "kaizenImagesB", maxCount: 5 },
//     { name: "kaizenImagesA", maxCount: 5 },
//   ]);

  
module.exports = uploadKaizenImgs;