const express = require("express");
const morgan = require("morgan");
const pkg = require("../package.json");
const cors = require("cors");
// const bodyParser = require("body-parser");
const app = express().use("*", cors());
const config = require('../src/config')
const { whatsapp } = require("../src/middlewares/whatsapp.js")
const mongoose = require("mongoose");
// const sslRedirect = require('heroku-ssl-redirect');
require("dotenv").config();
// Configuración básica (permitir todas las solicitudes)
const cron = require('node-cron');
const compression = require("compression");


app.use(cors());

// Configuración avanzada (especificar orígenes permitidos)
const corsOptions = {
  origin: ['https://www.axiompaperless.com', 'https://axiompaperless.com'],
  // origin: ['http://localhost:3000'], // Para desarrollo local
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));
app.use(compression());

// Middlewares
app.set("pkg", pkg);
app.use(morgan("dev"));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: false }));

app.get('/', (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});

app.get("/api/cors", (req, res) => {
  res.status(200).json({ message: "Esta entrando y CORS debería estar bien configurado" });
});

//app.use((req, res, next) => {
//const origin = req.headers.origin;
// res.header('Access-Control-Allow-Origin', origin);
//res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
//res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//res.header('Access-Control-Allow-Credentials', 'true');
// next();
//});

//app.options('*', cors(corsOptions));

/////Metodos initial setup/////
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
  updateEmployeesData,
  createDevicesAutomation
} = require("./libs/initialSetup.js");

////Routes
const apiRoutes = require('./routes/index');

//// Calling Middlewares
const sendEmailMiddleware = require("./middlewares/mailer");
const { autoSendMessage, autoSendEmail } = require("./controllers/whatsapp.controller.js");
const { autoSendDeviationAlerts } = require("./controllers/emailNotification.controller.js");


//Primer inicio de API/////
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
// createDevicesAutomation();

//Agregar camposn a empleados//
// updateEmployeesData();

app.get("/api/cors", (req, res) => {
  res.status(200).json({ message: "Esta entrando" });
});

app.set("pkg", pkg);
app.use(morgan("dev"));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});
//Access to routes///
app.use("/api", apiRoutes);



//setInterval(autoSendEmail, 3600000);//Tiempo de ejecucion de 1Hora
//setInterval(autoSendEmail, 10000);

const date = new Date();
const horaActual = date.getHours()
//console.log(horaActual)

module.exports = app;