const express = require("express");

const morgan = require("morgan");

const pkg = require("../package.json");

const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();

const config = require('../src/config');

const {
  whatsapp
} = require("../src/middlewares/whatsapp.js");

const mongoose = require("mongoose");

app.use(cors({
  origin: ['http://paperless-apg.s3-website-us-east-1.amazonaws.com', 'http://localhost:3000'],
  // Lista de dominios permitidos
  credentials: true // Habilitar envío de cookies

}));
app.options('*', cors()); /////Metodos initial setup/////

const {
  createCompanys,
  createDashboard,
  createRoles,
  createDepartments,
  createPositions,
  createCustomers,
  createForms,
  createEmployees,
  createParts,
  createPartsInfo,
  createMachine,
  updateEmployeesData
} = require("./libs/initialSetup.js"); ////Routes


const formsRoutes = require("./routes/forms.routes.js");

const authRoutes = require("./routes/auth.routes.js");

const userRouter = require("./routes/user.routes.js");

const kaizenRoutes = require("./routes/Others/kaizen.routes.js");

const employeesRoutes = require("./routes/employees.routes.js");

const deviationRoutes = require("./routes/General/deviation.routes.js");

const partsRoutes = require("./routes/Quality/parts.routes.js");

const customersRoutes = require("./routes/General/customer.routes.js");

const validationSettingsRoutes = require("./routes/General/validationSettings.routes.js");

const trainingRoutes = require("./routes/Others/training.routes.js");

const PersonalRequisition = require("./routes/General/personalRequisition.routes.js");

const whatsappRoutes = require("./routes/whatsapp.routes.js");

const itRoutes = require("./routes/it.routes.js");

const encuestasRoutes = require("./routes/encuestas.routes.js");

const processRoutes = require("./routes/Setup/process.routes.js"); //// Calling Middlewares


const sendEmailMiddleware = require("./middlewares/mailer");

const {
  autoSendMessage,
  autoSendEmail
} = require("./controllers/whatsapp.controller.js"); //Primer inicio de API/////
// createCompanys();
// createDashboard();
// createRoles();
// createDepartments();
// createPositions();
// createCustomers();
// Segundo inicio de API///////
// createForms();
// createParts();
// createEmployees();
// Tercer inicio de API///////
// createPartsInfo();
// Cuarto inicio//////
// createMachine();
//Agregar camposn a empleados//
// updateEmployeesData();


app.set("pkg", pkg);
app.use(morgan("dev"));
app.use(express.json({
  limit: '25mb'
}));
app.use(express.urlencoded({
  limit: '25mb'
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version
  });
}); //Access to routes///

app.use("/api/forms", formsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);
app.use("/api/form", kaizenRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/deviations", deviationRoutes);
app.use("/api/validationSettings", validationSettingsRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/personalrequisition", PersonalRequisition);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/it", itRoutes);
app.use("/api/encuestas", encuestasRoutes);
app.use("/api/process", processRoutes);
setInterval(autoSendEmail, 3600000); //Tiempo de ejecucion de 1Hora
//setInterval(autoSendEmail, 10000);

const date = new Date();
const horaActual = date.getHours();
console.log(horaActual);
app.get("/api/cors", (req, res) => {
  res.status(200).json({
    message: "Esta entrando"
  });
});
module.exports = app;