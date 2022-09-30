// import app from "./app.js";
// import "./database.js";
// const database = require("./database.js");
const {app} = require("./app.js");
// 
// settings
app.set('port', process.env.PORT || 4000);


app.listen(app.get('port'));

console.log("Server listen on port", app.get('port'));
