import multer from 'multer';
const shortid = require("shortid");

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
  export default upload.single('picture');
  
  