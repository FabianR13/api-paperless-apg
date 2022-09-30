// const multer = require("multer");
// const shortid = require("shortid");
import multer from "multer";
import shortid from "shortid";

// Save Locally the Files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "C:\\Paperless\\PAPERLESS-APG\\public\\Uploads\\DeviationClosingFile");
      // cb(null, "E:\\Paperless\\PAPERLESS-APG\\build\\Uploads\\DeviationClosingFile");
    },
    filename: function (req, file, cb) {
      let exploded_name = file.originalname.split(".");
      let ext = exploded_name[exploded_name.length - 1];
      cb(null, req.body.deviationNumber +"_"+ shortid.generate() + "." + ext);
    },
  });
  
  const upload = multer({ storage }); //Single Field Form
  
   // Upload Multiple Fields Form
  export default upload.single('deviationStatus');
  
  