import express from "express";
import morgan from "morgan";
import pkg from "../package.json"  assert {type: "json"};
import config from "./config.js";

import {
  createRoles,
  createDepartments,
  createPositions,
  createUser,
  createDashboard,
  createEmployees,
  createForms,
  createCustomers,
  createParts,
  updateRoles,
  createDeviationRequest,
  createDeviationRisk,
  updateKaizens,
  createCompanys,
  updateEmployees,
  updateUsersCompany,
  updatePartsCompany,
  createPartsInfo,
  createMachine,
} from "./libs/initialSetup.js";

import formsRoutes from "./routes/forms.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import kaizenRoutes from "./routes/Others/kaizen.routes.js";
import employeesRoutes from "./routes/employees.routes.js";
import deviationRoutes from "./routes/General/deviation.routes.js";
import partsRoutes from "./routes/Quality/parts.routes.js";
import customersRoutes from "./routes/General/customer.routes.js";
import validationSettingsRoutes from "./routes/General/validationSettings.routes.js";





const cors = require("cors");
const bodyParser = require("body-parser");
const app = express().use("*", cors());


//Primer inicio de API
// createCompanys();
// createDashboard();
// createRoles();
// createDepartments();
// createPositions();
// createCustomers();

// Segundo inicio de API
// createForms();
// createParts();
// createEmployees();


// Tercer inicio de API
// createPartsInfo();

// Cuarto inicio
// createMachine();

// Metodos no usados
// updateKaizens();
// updateEmployees();
// updateUsersCompany();
// updatePartsCompany();
// createEmployees();


app.set("pkg", pkg);

app.use(morgan("dev"));
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});

app.use("/api/forms", formsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);
app.use("/api/form", kaizenRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/deviations", deviationRoutes);
app.use("/api/validationSettings", validationSettingsRoutes);



app.get("/api/cors", (req, res) => {
  res.status(200).json({ message: "Esta entrando" });
});

// // Send Mail Example
// app.get("/api/mail", (req, res) => {
//   const nodemailer = require("nodemailer");
//   async function main() {
//     let testAccount = await nodemailer.createTestAccount();

//     let transporter = nodemailer.createTransport({
//       host: "smtp.office365.com",
//       port: 587,
//       auth: {
//         user: config.MAIL_AUTH_USER,
//         pass: config.MAIL_AUTH_PASS,
//       },
//       secureConnection: false,
//       tls: { ciphers: "SSLv3" },
//     });

//     let info = await transporter.sendMail({
//       from: '"Mahonri Del Rincon" <mahonri.delrincon@apgmexico.mx>',
//       to: "fabian.ramos@apgmexico.mx",
//       subject: "Hello",
//       text: "Hello world? Ixtapaluco 2",
//       html: "<b>Hello world? Ixtapaluco</b>",
//     });

//     console.log("Message sent:%s", info.messageId);
//     res.status(200).json({ message: info.messageId });
//   }

//   main().catch(console.error);
// });

export default app;
