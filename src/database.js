import mongoose from "mongoose";

// Local Enviroment
// mongoose
//   .connect("mongodb://127.0.0.1/paperlessapgapidb", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//   })
//   .then((db) => console.log("Db is connected"))
//   .catch((error) => console.log(error));

mongoose
  .connect("mongodb+srv://PaperlessApg:AdminPaperlessDb@paperlessapgdb.m1cphdz.mongodb.net/paperlessapgapidb", {
      useNewUrlParser: true,
      useUnifiedTopology: true
  })
  .then((db) => console.log("Db is connected"))
  .catch((error) => console.log(error));
