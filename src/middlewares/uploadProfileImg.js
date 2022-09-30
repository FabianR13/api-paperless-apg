const multer = require("multer");
const shortid = require("shortid");
// import multer from "multer";
// import shortid from "shortid";

// Save Locally the Files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "C:\\Paperless\\PAPERLESS-APG\\public\\Uploads\\Employees");
      // cb(null, "E:\\Paperless\\PAPERLESS-APG\\build\\Uploads\\Employees");
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + ".jpeg");
    },
  });
  
  const upload = multer({ storage }); //Single Field Form
  
   // Upload Multiple Fields Form
  module.export = upload.single('picture');
  
  