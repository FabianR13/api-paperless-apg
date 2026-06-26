const express = require('express');
const router = express.Router();

const formsRoutes = require("./forms.routes.js");
const authRoutes = require("./auth.routes.js");
const userRouter = require("./user.routes.js");
const kaizenRoutes = require("./kaizen.routes.js");
const employeesRoutes = require("./employees.routes.js");
const deviationRoutes = require("./deviation.routes.js");
const partsRoutes = require("./parts.routes.js");
const customersRoutes = require("./customer.routes.js");
const trainingRoutes = require("./training.routes.js");
const itRoutes = require("./it.routes.js");
const supermarketRoutes = require("./supermarket.routes.js");
const minutaRoutes = require("./minuta.routes.js");
const errorProfingRoutes = require("./errorProofing.routes.js");
const automationDevicesRoutes = require("./automationDevices.routes.js");
const reportsRoutes = require("./report.routes.js");
const dailyAuditsRoutes = require("./dailyAudits.routes.js");
const ppeRequestRoutes = require("./ppeRequest.routes.js");
const setupValidationRoutes = require("./SetupValidation.routes.js");
const quarantineroutes = require("./quarantine.routes.js")

router.use("/forms", formsRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRouter);
router.use("/form", kaizenRoutes);
router.use("/employees", employeesRoutes);
router.use("/parts", partsRoutes);
router.use("/customers", customersRoutes);
router.use("/deviations", deviationRoutes);
router.use("/training", trainingRoutes);
router.use("/it", itRoutes);
router.use("/supermarket", supermarketRoutes);
router.use("/minuta", minutaRoutes);
router.use("/errorproofing", errorProfingRoutes);
router.use("/automationDevices", automationDevicesRoutes);
router.use("/reports", reportsRoutes);
router.use("/dailyAudits", dailyAuditsRoutes);
router.use("/ppe", ppeRequestRoutes);
router.use("/setupvalidation", setupValidationRoutes);
router.use("/quarantine", quarantineroutes);

module.exports = router;