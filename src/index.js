import app from "./app.mjs";
import "./database.js";

// settings
app.set('port', process.env.PORT || 4000);


app.listen(app.get('port'));

console.log("Server listen on port", app.get('port'));
