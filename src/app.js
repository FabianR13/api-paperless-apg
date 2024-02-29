const express = require("express");
const morgan = require("morgan");
const pkg = require("../package.json");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express().use("*", cors());
const config = require('../src/config')

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
  updateEmployeesData
} = require("./libs/initialSetup.js");

////Routes
const formsRoutes = require("./routes/forms.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const userRouter = require("./routes/user.routes.js");
const kaizenRoutes = require("./routes/Others/kaizen.routes.js");
const employeesRoutes = require("./routes/employees.routes.js");
const deviationRoutes = require("./routes/General/deviation.routes.js");
const partsRoutes = require("./routes/Quality/parts.routes.js");
const customersRoutes = require("./routes/General/customer.routes.js");
const validationSettingsRoutes = require("./routes/General/validationSettings.routes.js");
const trainingRoutes = require("./routes/Others/training.routes.js")

//// Calling Middlewares
const sendEmailMiddleware = require("./middlewares/mailer");

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

//Agregar camposn a empleados//
// updateEmployeesData();

app.set("pkg", pkg);
app.use(morgan("dev"));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});
//Access to routes///
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

app.get("/api/cors", (req, res) => {
  res.status(200).json({ message: "Esta entrando" });
});

module.exports = app;


// Send Mail Example through Middleware
app.post("/api/mailer", sendEmailMiddleware.sendEmailMiddlewareResponse, (req, res) => {
  // Handle the contact form Submission
  // ...
  res.send('Email Sent successfully!');
});

// Send Mail Example
app.post("/api/mail", (req, res) => {
  const nodemailer = require("nodemailer");
  const requestBy = req.body.requestBy;

  async function main() {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      auth: {
        // user: config.MAIL_AUTH_USER,
        // pass: config.MAIL_AUTH_PASS,
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
      },
      secureConnection: false,
      tls: { ciphers: "SSLv3" },
    });

    let info = await transporter.sendMail({
      from: '"Paperless" <paperless@apgmexico.mx>',
      to: "mahonri.delrincon@apgmexico.mx",
      subject: "Hello " + requestBy + " a creado una nueva deviacion",
      text: "Hello world? desde front",
      html: "<b>Hello world? Ixtapaluco</b>",
    });

    console.log("Message sent:%s", info.messageId);
    res.status(200).json({ message: info.messageId });
  }

  main().catch(console.error);
});