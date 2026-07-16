const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/.env" });

// Quitamos la advertencia de obsolescencia de Mongoose 7
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 20, // Limita las conexiones simultáneas
            minPoolSize: 3,  // Mantiene 2 conexiones abiertas mínimo
        });
        console.log("✅ Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
        process.exit(1); // Cierra la app si falla la conexión
    }
};

connectDB();

// Cierra la conexión cuando la API se detenga
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔴 Conexión a MongoDB cerrada.");
    process.exit(0);
});