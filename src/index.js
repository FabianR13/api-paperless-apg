// index.js
const app = require("./app.js");
require("./database"); // Al requerirlo, se ejecuta tu conexión a Mongo automáticamente

// 1. IMPORTAMOS LA FUNCIÓN DEL BOT
// (Asegúrate que la ruta sea correcta. Si index.js está en 'src', esto está bien)
const { connectDiscordBot } = require("./discord/bot.js"); 

app.set('port', process.env.PORT || 4000);

// Iniciamos el servidor Web
app.listen(app.get('port'), () => {
    console.log("Server listen on port", app.get('port'));
    
    // 2. INICIAMOS EL BOT DE DISCORD
    // Lo ponemos aquí para que arranque junto con el servidor
    connectDiscordBot();
});