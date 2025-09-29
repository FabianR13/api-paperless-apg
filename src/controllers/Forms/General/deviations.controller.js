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
        if (productResponsible) {
            const foundEmployees = await Employees.find({ _id: productResponsible });
            if (foundEmployees.length === 0) {
                return res.status(404).json({ status: "error", message: "Employee no encontrado" });
            }
            newDeviation.productResponsible = foundEmployees.map(e => e._id);
        }

        // Buscar employee en la base de datos
        if (processResponsible) {
            const foundEmployees = await Employees.find({ _id: processResponsible });
            if (foundEmployees.length === 0) {
                return res.status(404).json({ status: "error", message: "Employee no encontrado" });
            }
            newDeviation.processResponsible = foundEmployees.map(e => e._id);
        }

        // Buscar employee en la base de datos
        if (correctiveResponsible) {
            const foundEmployees = await Employees.find({ _id: correctiveResponsible });
            if (foundEmployees.length === 0) {
                return res.status(404).json({ status: "error", message: "Employee no encontrado" });
            }
            newDeviation.correctiveResponsible = foundEmployees.map(e => e._id);
        }

        // Buscar employee en la base de datos
        if (preventiveResponsible) {
            const foundEmployees = await Employees.find({ _id: preventiveResponsible });
            if (foundEmployees.length === 0) {
                return res.status(404).json({ status: "error", message: "Employee no encontrado" });
            }
            newDeviation.preventiveResponsible = foundEmployees.map(e => e._id);
        }

        // Buscar employee en la base de datos
        if (followCorrectiveResponsible) {
            const foundEmployees = await Employees.find({ _id: followCorrectiveResponsible });
            if (foundEmployees.length === 0) {
                return res.status(404).json({ status: "error", message: "Employee no encontrado" });
            }
            newDeviation.followCorrectiveResponsible = foundEmployees.map(e => e._id);
        }

        // Buscar employee en la base de datos
        if (followPreventiveResponsible) {
            const foundEmployees = await Employees.find({ _id: followPreventiveResponsible });
            if (foundEmployees.length === 0) {
                return res.status(404).json({ status: "error", message: "Employee no encontrado" });
            }
            newDeviation.followPreventiveResponsible = foundEmployees.map(e => e._id);
        }

        // Buscar compañia en la base de datos
        if (CompanyId) {
            const foundCompanies = await Company.find({ _id: CompanyId });
            if (foundCompanies.length === 0) {
                return res.status(404).json({ status: "error", message: "Compani no encontrado" });
            }
            newDeviation.company = foundCompanies.map(c => c._id);
        }

        const count = await Deviation.estimatedDocumentCount();

        if (count > 1) {
            const deviations = await Deviation.find().sort({ consecutive: -1 }).limit(1);
            newDeviation.consecutive = deviations[0].consecutive + 1;
        } else {
            newDeviation.consecutive = 1
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
    //.populate({ path: 'deviationRisk', model: "DeviationRiskAssessment"  });
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
    if (productResponsible) {
        const foundEmployees = await Employees.find({ _id: productResponsible });
        if (foundEmployees.length === 0) {
            return res.status(404).json({ status: "error", message: "Employee no encontrado" });
        }
        newProductResponsible = foundEmployees.map(e => e._id);
    }

    // Buscar employee en la base de datos
    if (processResponsible) {
        const foundEmployees = await Employees.find({ _id: processResponsible });
        if (foundEmployees.length === 0) {
            return res.status(404).json({ status: "error", message: "Employee no encontrado" });
        }
        newProcessResponsible = foundEmployees.map(e => e._id);
    }

    // Buscar employee en la base de datos
    if (correctiveResponsible) {
        const foundEmployees = await Employees.find({ _id: correctiveResponsible });
        if (foundEmployees.length === 0) {
            return res.status(404).json({ status: "error", message: "Employee no encontrado" });
        }
        newCorrectiveResponsible = foundEmployees.map(e => e._id);
    }

    // Buscar employee en la base de datos
    if (preventiveResponsible) {
        const foundEmployees = await Employees.find({ _id: preventiveResponsible });
        if (foundEmployees.length === 0) {
            return res.status(404).json({ status: "error", message: "Employee no encontrado" });
        }
        newPreventiveResponsible = foundEmployees.map(e => e._id);
    }

    // Buscar employee en la base de datos
    if (followCorrectiveResponsible) {
        const foundEmployees = await Employees.find({ _id: followCorrectiveResponsible });
        if (foundEmployees.length === 0) {
            return res.status(404).json({ status: "error", message: "Employee no encontrado" });
        }
        newFollowCorrectiveResponsible = foundEmployees.map(e => e._id);
    }

    // Buscar employee en la base de datos
    if (followPreventiveResponsible) {
        const foundEmployees = await Employees.find({ _id: followPreventiveResponsible });
        if (foundEmployees.length === 0) {
            return res.status(404).json({ status: "error", message: "Employee no encontrado" });
        }
        newFollowPreventiveResponsible = foundEmployees.map(e => e._id);
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
// Updating the Kaizen All data//////////////////////////////////////////////////////////////////////////////////////////////
const validateDeviation = async (req, res) => {
    const { deviationId } = req.params;
    const deviationData = {};
    const {
        username,
    } = req.body;

    // Buscar usuario en la base de datos
    if (username) {
        const foundUser = await User.findOne({
            username: { $in: username },
        });
        if (foundUser) {
            const roles = await Role.find({ _id: { $in: foundUser.roles } });
            for (let i = 0; i < roles.length; i++) {
                
            }
            deviationData.qualitySign = foundUser._id;
            deviationData.qualitySignStatus = "Signed";
        } else {
            console.log(`Usuario "${username}" no encontrado.`);
        }
    }

    const {
        qualitySign,
        qualitySignStatus
    } = deviationData;

    const updatedDeviation = await Deviation.updateOne(
        { _id: deviationId },
        {
            $set: {
                qualitySign,
                qualitySignStatus,
                qualitySignDate: new Date()
            },
        }
    );

    if (!updatedDeviation) {
        return res // Es buena práctica agregar un 'return' para no ejecutar el resto.
            .status(403)
            .json({ status: "403", message: "Deviation not Updated", body: "" });
    }

    res
        .status(200)
        .json({ status: "200", message: "Deviation Updated ", body: updatedDeviation });
};
module.exports = {
    createDeviation,
    getDeviations,
    updateDeviation
};