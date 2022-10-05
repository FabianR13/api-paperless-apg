const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/.env' });

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((db) => console.log("Db is connected"))
  .catch((error) => console.log(error));
