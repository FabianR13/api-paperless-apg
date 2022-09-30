const multer = require("multer");
const shortid = require("shortid");
// import multer from "multer";
// import shortid from "shortid";

// Save Locally the Files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:\\Paperless\\PAPERLESS-APG\\public\\Uploads\\KaizenImgs");
    // cb(null, "E:\\Paperless\\PAPERLESS-APG\\build\\Uploads\\KaizenImgs");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + ".jpeg");
  },
});

const upload = multer({ storage }); //Single Field Form

 // Upload Multiple Fields Form
const uploadKaizenImgs = upload.fields([
    { name: "kaizenImagesB", maxCount: 5 },
    { name: "kaizenImagesA", maxCount: 5 },
  ]);

  
module.exports = uploadKaizenImgs;