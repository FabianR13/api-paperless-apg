const Customer = require("../../../models/General/Customer.js");
const Parts = require("../../../models/Quality/Parts.js");
const DeviationRequest = require("../../../models/General/DeviationRequestTemp.js");
const User = require("../../../models/User.js");
const DeviationRiskAssessment = require("../../../models/General/DeviationRiskAssessmentTemp.js");
const Company = require("../../../models/Company.js");
const AWS = require('aws-sdk');
const { sendEmailMiddlewareResponse } = require("../../../middlewares/mailer.js");
const Deviation = require("../../../models/General/Deviation.js");
const Employees = require("../../../models/Employees.js");
const Role = require("../../../models/Role.js");

AWS.config.update({
    region: process.env.S3_BUCKET_REGION,
    apiVersion: 'latest',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
})

const s3 = new AWS.S3();

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const createDeviation = async (req, res, next) => {
    const { CompanyId } = req.params;

    try {
        const {
            deviationNumber,
            requestBy,
            severity,
            deviationType,
            deviationDate,
            implementationDate,
            customer,
            partNumber,
            applyTo,
            implementationTime,
            machine,
            supplier,
            sectionTwo,
            termDevRequest,
            quantity,
            timePeriodStart,
            timePeriodEnd,
            other,
            qualitySignStatus,
            seniorSignStatus,
            customerSignStatus,
            comments,
            reason,
            consequence,
            productRisk,
            productMeasurement,
            productResponsible,
            productDueDate,
            processRisk,
            processMeasurement,
            processResponsible,
            processDueDate,
            correctiveMeasurement,
            correctiveResponsible,
            correctiveDueDate,
            preventiveMeasurement,
            preventiveResponsible,
            preventiveDueDate,
            followCorrectiveMeasurement,
            followCorrectiveResponsible,
            followCorrectiveDueDate,
            followPreventiveMeasurement,
            followPreventiveResponsible,
            followPreventiveDueDate,
        } = req.body;

        const newDeviation = new Deviation({
            deviationNumber,
            severity,
            deviationType,
            deviationDate,
            implementationDate,
            applyTo,
            implementationTime,
            machine,
            supplier,
            sectionTwo,
            termDevRequest,
            quantity,
            timePeriodStart,
            timePeriodEnd,
            other,
            qualitySignStatus,
            seniorSignStatus,
            customerSignStatus,
            comments,
            reason,
            consequence,
            productRisk,
            productMeasurement,
            productDueDate,
            processRisk,
            processMeasurement,
            processDueDate,
            correctiveMeasurement,
            correctiveDueDate,
            preventiveMeasurement,
            preventiveDueDate,
            followCorrectiveMeasurement,
            followCorrectiveDueDate,
            followPreventiveMeasurement,
            followPreventiveDueDate,
            deviationStatus: "Open",
            version: 1
        });
        // Buscar usuario en la base de datos
        if (requestBy) {
            const foundUsers = await User.find({ _id: requestBy });
            if (foundUsers.length === 0) {
                return res.status(404).json({ status: "error", message: "Usuario RequestBy no encontrado" });
            }
            newDeviation.requestBy = foundUsers.map(u => u._id);
        }

        // Buscar customer en la base de datos
        if (customer) {
            const foundCustomers = await Customer.find({ _id: customer });
            if (foundCustomers.length === 0) {
                return res.status(404).json({ status: "error", message: "Customer no encontrado" });
            }
            newDeviation.customer = foundCustomers.map(c => c._id);
        }

        // Buscar partes en la base de datos
        if (partNumber) {
            const foundParts = await Parts.find({ _id: partNumber });
            if (foundParts.length === 0) {
                return res.status(404).json({ status: "error", message: "Parts no encontrado" });
            }
            newDeviation.partNumber = foundParts.map(p => p._id);
        }

        // Buscar employee en la base de datos
        if (productResponsible && productResponsible.length > 0) {
            const uniqueIds = [...new Set(productResponsible)];
            const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

            if (countFound !== uniqueIds.length) {
                return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
            }
            const responsablesParaGuardar = productResponsible.map(id => ({ employee: id }));
            newDeviation.productResponsible = responsablesParaGuardar;
        } else {
            newDeviation.productResponsible = [];
        }

        // Buscar employee en la base de datos
        if (processResponsible && processResponsible.length > 0) {
            const uniqueIds = [...new Set(processResponsible)];
            const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

            if (countFound !== uniqueIds.length) {
                return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
            }
            const responsablesParaGuardar = processResponsible.map(id => ({ employee: id }));
            newDeviation.processResponsible = responsablesParaGuardar;
        } else {
            newDeviation.processResponsible = [];
        }

        // Buscar employee en la base de datos
        if (correctiveResponsible && correctiveResponsible.length > 0) {
            const uniqueIds = [...new Set(correctiveResponsible)];
            const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

            if (countFound !== uniqueIds.length) {
                return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
            }
            const responsablesParaGuardar = correctiveResponsible.map(id => ({ employee: id }));
            newDeviation.correctiveResponsible = responsablesParaGuardar;
        } else {
            newDeviation.correctiveResponsible = [];
        }

        // Buscar employee en la base de datos
        if (preventiveResponsible && preventiveResponsible.length > 0) {
            const uniqueIds = [...new Set(preventiveResponsible)];
            const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

            if (countFound !== uniqueIds.length) {
                return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
            }
            const responsablesParaGuardar = preventiveResponsible.map(id => ({ employee: id }));
            newDeviation.preventiveResponsible = responsablesParaGuardar;
        } else {
            newDeviation.preventiveResponsible = [];
        }

        // Buscar employee en la base de datos
        if (followCorrectiveResponsible && followCorrectiveResponsible.length > 0) {
            const uniqueIds = [...new Set(followCorrectiveResponsible)];
            const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

            if (countFound !== uniqueIds.length) {
                return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
            }
            const responsablesParaGuardar = followCorrectiveResponsible.map(id => ({ employee: id }));
            newDeviation.followCorrectiveResponsible = responsablesParaGuardar;
        } else {
            newDeviation.followCorrectiveResponsible = [];
        }

        // Buscar employee en la base de datos
        if (followPreventiveResponsible && followPreventiveResponsible.length > 0) {
            const uniqueIds = [...new Set(followPreventiveResponsible)];
            const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

            if (countFound !== uniqueIds.length) {
                return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
            }
            const responsablesParaGuardar = followPreventiveResponsible.map(id => ({ employee: id }));
            newDeviation.followPreventiveResponsible = responsablesParaGuardar;
        } else {
            newDeviation.followPreventiveResponsible = [];
        }

        // Buscar compañia en la base de datos
        if (CompanyId) {
            const foundCompanies = await Company.find({ _id: CompanyId });
            if (foundCompanies.length === 0) {
                return res.status(404).json({ status: "error", message: "Compani no encontrado" });
            }
            newDeviation.company = foundCompanies.map(c => c._id);
        }

        const anioActual = new Date().getFullYear();

        const ultimaDesviacion = await Deviation.findOne({
            createdAt: {
                $gte: new Date(`${anioActual}-01-01T00:00:00.000Z`), // Desde el inicio del año actual
                $lt: new Date(`${anioActual + 1}-01-01T00:00:00.000Z`)   // Hasta antes del inicio del siguiente año
            }
        }).sort({ consecutive: -1 });

        if (ultimaDesviacion) {
            newDeviation.consecutive = ultimaDesviacion.consecutive + 1;
        } else {
            newDeviation.consecutive = 1;
        }

        // newDeviationReq.deviationNumber = "APG-" + yearactual + "-" + `${Number(newDeviationReq.consecutive)}`.padStart(3, "0")`
        // newDeviationReq.deviationNumber = "APG-" + yearactual + "-" + `${count}`.padStart(3, "0")

        const savedDeviationRequest = await newDeviation.save();
        if (!savedDeviationRequest) {
            res
                .status(403)
                .json({ status: "403", message: "Deviation not Saved", body: "" });
        }
        next();
        //res.json({ status: "200", message: "Deviation request created", savedDeviationRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al guardar desviacion", error: error.message });
    }
};

// Getting all deviations request/////////////////////////////////////////////////////////////////////////////////////////////////////
const getDeviations = async (req, res) => {
    const { CompanyId } = req.params
    if (CompanyId.length !== 24) {
        return;
    }
    const company = await Company.find({
        _id: { $in: CompanyId },
    })
    if (!company) {
        return;
    }
    const deviations = await Deviation.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({ path: 'customer' })
        .populate({
            path: 'requestBy',
            populate: [
                {
                    path: 'signature',
                    model: 'Signature'
                },
                {
                    path: 'employee',
                    model: 'Employees',
                    populate: {
                        path: 'department',
                        model: 'Department'
                    }
                }
            ]
        })
        .populate({ path: 'partNumber' })
        .populate({
            path: 'qualitySign',
            populate: [
                {
                    path: 'signature',
                    model: 'Signature'
                },
                {
                    path: 'employee',
                    model: 'Employees',
                }
            ]
        })
    // .populate({ path: 'deviationRisk', model: "DeviationRiskAssessment" });
    res.json({ status: "200", message: "Deviations Loaded", body: deviations });
};

// Updating the Kaizen All data//////////////////////////////////////////////////////////////////////////////////////////////
const updateDeviation = async (req, res) => {
    const { deviationId } = req.params;

    const {
        severity,
        deviationType,
        implementationDate,
        customer,
        partNumber,
        applyTo,
        implementationTime,
        machine,
        supplier,
        sectionTwo,
        termDevRequest,
        quantity,
        timePeriodStart,
        timePeriodEnd,
        other,
        qualitySignStatus,
        seniorSignStatus,
        customerSignStatus,
        comments,
        reason,
        consequence,
        productRisk,
        productMeasurement,
        productResponsible,
        productDueDate,
        processRisk,
        processMeasurement,
        processResponsible,
        processDueDate,
        correctiveMeasurement,
        correctiveResponsible,
        correctiveDueDate,
        preventiveMeasurement,
        preventiveResponsible,
        preventiveDueDate,
        followCorrectiveMeasurement,
        followCorrectiveResponsible,
        followCorrectiveDueDate,
        followPreventiveMeasurement,
        followPreventiveResponsible,
        followPreventiveDueDate,
    } = req.body;

    let newCustomer = "";
    let newPartNumber = "";
    let newProductResponsible = "";
    let newProcessResponsible = "";
    let newCorrectiveResponsible = "";
    let newPreventiveResponsible = "";
    let newFollowCorrectiveResponsible = "";
    let newFollowPreventiveResponsible = "";

    // Buscar customer en la base de datos
    if (customer) {
        const foundCustomers = await Customer.find({ _id: customer });
        if (foundCustomers.length === 0) {
            return res.status(404).json({ status: "error", message: "Customer no encontrado" });
        }
        newCustomer = foundCustomers.map(c => c._id);
    }

    // Buscar partes en la base de datos
    if (partNumber) {
        const foundParts = await Parts.find({ _id: partNumber });
        if (foundParts.length === 0) {
            return res.status(404).json({ status: "error", message: "Parts no encontrado" });
        }
        newPartNumber = foundParts.map(p => p._id);
    }
    // Buscar employee en la base de datos
    if (productResponsible && productResponsible.length > 0) {
        const uniqueIds = [...new Set(productResponsible)];
        const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

        if (countFound !== uniqueIds.length) {
            return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
        }
        const responsablesParaGuardar = productResponsible.map(id => ({ employee: id }));
        newProductResponsible = responsablesParaGuardar;
    } else {
        newProductResponsible = [];
    }
    // Buscar employee en la base de datos
    if (processResponsible && processResponsible.length > 0) {
        const uniqueIds = [...new Set(processResponsible)];
        const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

        if (countFound !== uniqueIds.length) {
            return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
        }
        const responsablesParaGuardar = processResponsible.map(id => ({ employee: id }));
        newProcessResponsible = responsablesParaGuardar;
    } else {
        newProcessResponsible = [];
    }

    // Buscar employee en la base de datos
    if (correctiveResponsible && correctiveResponsible.length > 0) {
        const uniqueIds = [...new Set(correctiveResponsible)];
        const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

        if (countFound !== uniqueIds.length) {
            return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
        }
        const responsablesParaGuardar = correctiveResponsible.map(id => ({ employee: id }));
        newCorrectiveResponsible = responsablesParaGuardar;
    } else {
        newCorrectiveResponsible = [];
    }

    // Buscar employee en la base de datos
    if (preventiveResponsible && preventiveResponsible.length > 0) {
        const uniqueIds = [...new Set(preventiveResponsible)];
        const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

        if (countFound !== uniqueIds.length) {
            return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
        }
        const responsablesParaGuardar = preventiveResponsible.map(id => ({ employee: id }));
        newPreventiveResponsible = responsablesParaGuardar;
    } else {
        newPreventiveResponsible = [];
    }

    // Buscar employee en la base de datos
    if (followCorrectiveResponsible && followCorrectiveResponsible.length > 0) {
        const uniqueIds = [...new Set(followCorrectiveResponsible)];
        const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

        if (countFound !== uniqueIds.length) {
            return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
        }
        const responsablesParaGuardar = followCorrectiveResponsible.map(id => ({ employee: id }));
        newFollowCorrectiveResponsible = responsablesParaGuardar;
    } else {
        newFollowCorrectiveResponsible = [];
    }

    // Buscar employee en la base de datos
    if (followPreventiveResponsible && followPreventiveResponsible.length > 0) {
        const uniqueIds = [...new Set(followPreventiveResponsible)];
        const countFound = await Employees.countDocuments({ _id: { $in: uniqueIds } });

        if (countFound !== uniqueIds.length) {
            return res.status(404).json({ status: "error", message: "Uno o más IDs de empleado no fueron encontrados." });
        }
        const responsablesParaGuardar = followPreventiveResponsible.map(id => ({ employee: id }));
        newFollowPreventiveResponsible = responsablesParaGuardar;
    } else {
        newFollowPreventiveResponsible = [];
    }

    const updatedDeviation = await Deviation.updateOne(
        { _id: deviationId },
        {
            $set: {
                severity,
                deviationType,
                implementationDate,
                customer: newCustomer,
                partNumber: newPartNumber,
                applyTo,
                implementationTime,
                machine,
                supplier,
                sectionTwo,
                termDevRequest,
                quantity,
                timePeriodStart,
                timePeriodEnd,
                other,
                qualitySignStatus,
                seniorSignStatus,
                customerSignStatus,
                comments,
                reason,
                consequence,
                productRisk,
                productMeasurement,
                productResponsible: newProductResponsible,
                productDueDate,
                processRisk,
                processMeasurement,
                processResponsible: newProcessResponsible,
                processDueDate,
                correctiveMeasurement,
                correctiveResponsible: newCorrectiveResponsible,
                correctiveDueDate,
                preventiveMeasurement,
                preventiveResponsible: newPreventiveResponsible,
                preventiveDueDate,
                followCorrectiveMeasurement,
                followCorrectiveResponsible: newFollowCorrectiveResponsible,
                followCorrectiveDueDate,
                followPreventiveMeasurement,
                followPreventiveResponsible: newFollowPreventiveResponsible,
                followPreventiveDueDate,
            },
        }
    );

    if (!updatedDeviation) {
        res
            .status(403)
            .json({ status: "403", message: "Deviation not Updated", body: "" });
    }

    res
        .status(200)
        .json({ status: "200", message: "Deviation Updated ", body: updatedDeviation });
};

//Validar desviacion//////////////////////////////////////////////////////////////////////////////////////////////
const validateDeviation = async (req, res) => {
    const { deviationId } = req.params;
    const { username } = req.body;

    try {
        if (!username) {
            return res.status(400).json({ message: "El 'username' es requerido." });
        }

        const foundUser = await User.findOne({ username });

        if (!foundUser) {
            return res.status(404).json({ message: `Usuario "${username}" no encontrado.` });
        }

        const fieldsToUpdate = {};
        const currentDate = new Date();

        const roles = await Role.find({ _id: { $in: foundUser.roles } });

        for (const role of roles) {
            if (["QualityASIns",  "QualityASEng"].includes(role.name)) {
                fieldsToUpdate.qualitySign = foundUser._id;
                fieldsToUpdate.qualitySignStatus = "Signed";
                fieldsToUpdate.qualitySignDate = currentDate;
            }
            if (role.name === "QualityASGer") {
                fieldsToUpdate.qualitySignRisk = foundUser._id;
                fieldsToUpdate.qualitySignStatusRisk = "Signed";
                fieldsToUpdate.qualitySignDateRisk = currentDate;
            }
            if (role.name === "ProductionSign") {
                fieldsToUpdate.productionSignRisk = foundUser._id;
                fieldsToUpdate.productionSignStatusRisk = "Signed";
                fieldsToUpdate.productionSignDateRisk = currentDate;
            }
            if (role.name === "AutomationSign") {
                fieldsToUpdate.automationSignRisk = foundUser._id;
                fieldsToUpdate.automationSignStatusRisk = "Signed";
                fieldsToUpdate.automationSignDateRisk = currentDate;
            }
            if (role.name === "SeniorManagement") {
                fieldsToUpdate.seniorSign = foundUser._id;
                fieldsToUpdate.seniorSignStatus = "Signed";
                fieldsToUpdate.seniorSignDate = currentDate;
            }
            if (role.name === "ProcessSign") {
                fieldsToUpdate.processSignRisk = foundUser._id;
                fieldsToUpdate.processSignStatusRisk = "Signed";
                fieldsToUpdate.processSignDateRisk = currentDate;
            }
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ message: "El usuario no tiene los roles necesarios para firmar en este paso." });
        }

        const updateResult = await Deviation.updateOne(
            { _id: deviationId },
            { $set: fieldsToUpdate }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: "La desviación a actualizar no fue encontrada." });
        }

        res.status(200).json({ status: "200", message: "Desviación actualizada correctamente." });

    } catch (error) {
        console.error("Error al validar la desviación:", error);
        res.status(500).json({ message: "Ocurrió un error en el servidor." });
    }
};

module.exports = {
    createDeviation,
    getDeviations,
    updateDeviation,
    validateDeviation
};