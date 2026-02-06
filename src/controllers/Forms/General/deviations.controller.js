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

const extractRows = (body, prefix) => {
    const normalize = (val) => (!val ? [] : Array.isArray(val) ? val : [val]);

    const risks = normalize(body[`${prefix}Risk`]);
    const measurements = normalize(body[`${prefix}Measurement`]);
    const responsibles = normalize(body[`${prefix}Responsible`]);
    const dueDates = normalize(body[`${prefix}DueDate`]);

    if (risks.length === 0) return [];

    return risks.map((risk, index) => {
        const respId = responsibles[index];
        return {
            risk: risk,
            measurement: measurements[index] || '',
            responsible: (respId && respId.trim().length > 0) ? respId : null,
            dueDate: dueDates[index] || null
        };
    }).filter(row => row.risk && row.risk.trim() !== '');
};

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const createDeviation = async (req, res) => {
    const { CompanyId } = req.params;

    try {
        // 1. Extraer TODOS los datos del body
        const {
            requestBy, severity, deviationType, deviationDate, implementationDate,
            customer, partNumber, applyTo, implementationTime, machine, supplier,
            sectionTwo, termDevRequest, quantity, timePeriodStart, timePeriodEnd,
            other, comments, reason, consequence,

            // Variables de decisión de firmas (frontend envia "Yes" o "No")
            qualitySignStatus,
            seniorSignStatus,
            customerSignStatus
        } = req.body;

        // 2. Procesar Imágenes (Multer)
        let deviationImages = [];
        if (req.files && req.files["deviationImages"]) {
            deviationImages = req.files["deviationImages"].map((file) => ({ img: file.key }));
        }

        // 3. Generar Consecutivo (APG-2026-XXX)
        const anioActual = new Date().getFullYear();
        const ultimaDesviacion = await Deviation.findOne({
            createdAt: {
                $gte: new Date(`${anioActual}-01-01T00:00:00.000Z`),
                $lt: new Date(`${anioActual + 1}-01-01T00:00:00.000Z`)
            }
        }).sort({ consecutive: -1 });

        const nextConsecutive = ultimaDesviacion ? ultimaDesviacion.consecutive + 1 : 1;
        const generatedNumber = `APG-${anioActual}-${String(nextConsecutive).padStart(3, "0")}`;

        // 4. CREAR EL OBJETO DEVIATION (Estructura Nueva)
        const newDeviation = new Deviation({
            // Metadatos
            deviationNumber: generatedNumber,
            consecutive: nextConsecutive,
            version: 2,
            deviationStatus: "Open", // Estado inicial de toda la desviación

            // Datos Generales
            severity, deviationType, deviationDate, implementationDate,
            applyTo, implementationTime, machine, supplier, sectionTwo,
            termDevRequest, quantity, timePeriodStart, timePeriodEnd,
            other, comments, reason, consequence, deviationImages,

            // Tablas de Riesgo (Usamos el helper extractRows)
            // Nota: Aunque vengan vacíos desde "Nueva Desviación", esto prepara la estructura.
            riskAssessment: {
                product: extractRows(req.body, 'product'),
                process: extractRows(req.body, 'process')
            },
            actions: {
                corrective: extractRows(req.body, 'corrective'),
                preventive: extractRows(req.body, 'preventive')
            },
            followUp: {
                corrective: extractRows(req.body, 'followCorrective'),
                preventive: extractRows(req.body, 'followPreventive')
            },

            // Firmas: Configuramos el estado inicial basado en la decisión del usuario
            signatures: {
                qualityValidation: {
                    status: qualitySignStatus === 'Yes' ? 'Pending' : 'NA'
                },
                seniorManager: {
                    status: seniorSignStatus === 'Yes' ? 'Pending' : 'NA'
                },
                customer: {
                    status: customerSignStatus === 'Yes' ? 'Pending' : 'NA'
                },

                // Las firmas de los gerentes (Section 5) las dejamos pendientes por defecto
                // Si también son opcionales, necesitarías agregar selects en el front para ellas.
                riskAssessment: {
                    qualityManager: { status: 'Pending' },
                    productionManager: { status: 'Pending' },
                    processManager: { status: 'Pending' },
                    automationManager: { status: 'Pending' }
                }
            }
        });

        // 5. Validar y Asignar Referencias (User, Customer, Parts, Company)

        // Request By (Usuario)
        if (requestBy) {
            const reqByArray = Array.isArray(requestBy) ? requestBy : [requestBy];
            const foundUsers = await User.find({ _id: { $in: reqByArray } });
            if (!foundUsers.length) return res.status(404).json({ status: "error", message: "Usuario RequestBy no encontrado" });
            newDeviation.requestBy = foundUsers.map(u => u._id);
        }

        // Customer
        if (customer) {
            const custArray = Array.isArray(customer) ? customer : [customer];
            const foundCustomers = await Customer.find({ _id: { $in: custArray } });
            if (!foundCustomers.length) return res.status(404).json({ status: "error", message: "Customer no encontrado" });
            newDeviation.customer = foundCustomers.map(c => c._id);
        }

        // Part Number
        if (partNumber) {
            const partArray = Array.isArray(partNumber) ? partNumber : [partNumber];
            const foundParts = await Parts.find({ _id: { $in: partArray } });
            if (!foundParts.length) return res.status(404).json({ status: "error", message: "Parts no encontrado" });
            newDeviation.partNumber = foundParts.map(p => p._id);
        }

        // Company
        if (CompanyId) {
            const foundCompanies = await Company.find({ _id: CompanyId });
            if (!foundCompanies.length) return res.status(404).json({ status: "error", message: "Company no encontrado" });
            newDeviation.company = foundCompanies.map(c => c._id);
        }

        // 6. Guardar en Base de Datos
        const savedDeviationRequest = await newDeviation.save();

        if (!savedDeviationRequest) {
            return res.status(403).json({ status: "403", message: "Deviation not Saved" });
        }

        // 7. Respuesta Exitosa
        res.json({
            status: "200",
            message: "New Deviation created successfully",
            savedDeviationRequest
        });

    } catch (error) {
        console.error("Error creating deviation:", error);
        res.status(500).json({
            status: "error",
            message: "Error al guardar desviacion",
            error: error.message
        });
    }
};

// Getting all deviations request/////////////////////////////////////////////////////////////////////////////////////////////////////
const getDeviations = async (req, res) => {
    const { CompanyId } = req.params;

    // Validación básica de ID
    if (!CompanyId || CompanyId.length !== 24) {
        return res.status(400).json({ status: "error", message: "Invalid Company ID" });
    }

    try {
        const company = await Company.find({ _id: { $in: CompanyId } });
        if (!company || company.length === 0) {
            return res.status(404).json({ status: "error", message: "Company not found" });
        }

        // Definimos un objeto de "configuración" para poblar usuarios (con su firma y empleado)
        // Esto evita repetir código para cada firma (Quality, Senior, Customer, etc.)
        const userPopulateConfig = {
            select: 'name lastName email signature employee', // Traer solo lo necesario
            populate: [
                { path: 'signature', model: 'Signature' },
                {
                    path: 'employee',
                    model: 'Employees',
                    select: 'name lastName jobTitle department',
                    populate: { path: 'department', model: 'Department' }
                }
            ]
        };

        const deviations = await Deviation.find({
            company: { $in: CompanyId },
            version: 2
        })
            .sort({ createdAt: -1 })

            // --- 1. DATOS GENERALES ---
            .populate('customer')
            .populate('partNumber')
            .populate({
                path: 'requestBy', // Quien creó la desviación
                populate: [
                    { path: 'signature', model: 'Signature' },
                    {
                        path: 'employee',
                        model: 'Employees',
                        populate: { path: 'department', model: 'Department' }
                    }
                ]
            })

            // --- 2. RESPONSABLES EN LAS TABLAS DE RIESGO ---
            // Ahora están anidados, así que accedemos con puntos (.)
            .populate({ path: 'riskAssessment.product.responsible', model: 'Employees', select: 'name lastName' })
            .populate({ path: 'riskAssessment.process.responsible', model: 'Employees', select: 'name lastName' })

            .populate({ path: 'actions.corrective.responsible', model: 'Employees', select: 'name lastName' })
            .populate({ path: 'actions.preventive.responsible', model: 'Employees', select: 'name lastName' })

            .populate({ path: 'followUp.corrective.responsible', model: 'Employees', select: 'name lastName' })
            .populate({ path: 'followUp.preventive.responsible', model: 'Employees', select: 'name lastName' })

            // --- 3. FIRMAS (NUEVA ESTRUCTURA) ---
            // Usamos la configuración 'userPopulateConfig' que creamos arriba

            // Firmas principales
            .populate({ path: 'signatures.qualityValidation.user', ...userPopulateConfig })
            .populate({ path: 'signatures.seniorManager.user', ...userPopulateConfig })
            .populate({ path: 'signatures.customer.user', ...userPopulateConfig })

            // Firmas de Gerentes (Risk Assessment Signatures)
            .populate({ path: 'signatures.riskAssessment.qualityManager.user', ...userPopulateConfig })
            .populate({ path: 'signatures.riskAssessment.productionManager.user', ...userPopulateConfig })
            .populate({ path: 'signatures.riskAssessment.processManager.user', ...userPopulateConfig })
            .populate({ path: 'signatures.riskAssessment.automationManager.user', ...userPopulateConfig });

        res.json({ status: "200", message: "Deviations Loaded", body: deviations });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error loading deviations" });
    }
};

//Funcion para rechazar una desviacion
const rejectDeviation = async (req, res) => {
    const { deviationId } = req.params;
    const { rejectedComment, user } = req.body;

    try {
        const foundUser = await User.findById(user);

        if (!foundUser) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }

        const dateMX = new Date();

        const updatedDeviation = await Deviation.findByIdAndUpdate(
            deviationId,
            {
                $set: {
                    deviationStatus: "Rejected",
                    rejectedComment: rejectedComment,
                    rejectedDate: dateMX,
                    rejectedBy: [foundUser._id]
                }
            },
            { new: true }
        );

        if (!updatedDeviation) {
            return res.status(404).json({ status: "error", message: "Deviation not found or not updated" });
        }

        res.status(200).json({
            status: "200",
            message: "Deviation Rejected Successfully",
            body: updatedDeviation
        });

    } catch (error) {
        console.error("Error rejecting deviation:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
}

//Funcion para actualizar desviacion
const updateDeviation = async (req, res) => {
    const { deviationId } = req.params;

    try {
        const currentDeviation = await Deviation.findById(deviationId);
        if (!currentDeviation) {
            return res.status(404).json({ status: "404", message: "Deviation not found" });
        }

        const {
            reason, consequence,
            user,
            imagesToDelete,
            closureDate
        } = req.body;

        //Actualizar firma de aprovador
        const updatedSignatures = { ...currentDeviation.signatures };

        if (user) {
            const foundUsers = await User.find({ _id: user });
            if (foundUsers.length === 0) {
                return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
            }
            updatedSignatures.qualityValidation = {
                status: 'Approved',
                date: new Date(),
                user: foundUsers.map(u => u._id)
            };
        }

        let updatedImages = [...currentDeviation.deviationImages];

        // Borrar imágenes (DB + S3)
        if (imagesToDelete) {
            const parsedImagesToDelete = JSON.parse(imagesToDelete);
            if (Array.isArray(parsedImagesToDelete) && parsedImagesToDelete.length > 0) {

                updatedImages = updatedImages.filter(img => !parsedImagesToDelete.includes(img.img));

                parsedImagesToDelete.forEach(imgName => {
                    const params = {
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: `Uploads/DeviationImgs/${imgName}`
                    };

                    s3.deleteObject(params, (err, data) => {
                        if (err) console.error("Error deleting from S3:", err, err.stack);
                        else console.log("Deleted from S3:", imgName);
                    });
                });
            }
        }

        // Agregar nuevas imágenes
        if (req.files && req.files['deviationImages']) {
            const newImages = req.files['deviationImages'].map(file => ({ img: file.key }));
            updatedImages = [...updatedImages, ...newImages];
        }

        const updateData = {
            reason, consequence,
            deviationImages: updatedImages,
            deviationStatus: "Approved",

            // Tablas (usando helper)
            riskAssessment: {
                product: extractRows(req.body, 'product'),
                process: extractRows(req.body, 'process')
            },
            actions: {
                corrective: extractRows(req.body, 'corrective'),
                preventive: extractRows(req.body, 'preventive')
            },
            followUp: {
                corrective: extractRows(req.body, 'followCorrective'),
                preventive: extractRows(req.body, 'followPreventive')
            },
            signatures: updatedSignatures,
            ...(closureDate && { closureDate: closureDate }),
        };

        const updatedDeviation = await Deviation.findByIdAndUpdate(
            deviationId,
            { $set: updateData },
            { new: true }
        );

        res.json({
            status: "200",
            message: "Deviation Updated Successfully",
            body: updatedDeviation
        });

    } catch (error) {
        console.error("Error updating deviation:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

//Funcion Para firmas de las desviaciones
const signDeviation = async (req, res) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });
    const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
    const Access = [];
    const { CompanyId } = req.params;
    Access.company = await Company.find({ _id: { $in: CompanyId } });
    const { deviationId } = req.params;


    try {
        if (!roles) {
            return res.status(404).json({ status: "404", message: "User Roles not found" });
        }

        const currentDeviation = await Deviation.findById(deviationId);
        if (!currentDeviation) {
            return res.status(404).json({ status: "404", message: "Deviation not found" });
        }

        const updatedSignatures = { ...currentDeviation.signatures };

        const signaturePayload = {
            status: 'Approved',
            date: new Date(),
            user: user._id
        };

        let roleMatched = false;

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "QualityASGer") {
                updatedSignatures.riskAssessment.qualityManager = signaturePayload;
                roleMatched = true;
            }
            if (roles[i].name === "ProductionSign") {
                updatedSignatures.riskAssessment.productionManager = signaturePayload;
                roleMatched = true;
            }
            if (roles[i].name === "AutomationSign") {
                updatedSignatures.riskAssessment.automationManager = signaturePayload;
                roleMatched = true;
            }
            if (roles[i].name === "SeniorManagement") {
                updatedSignatures.seniorManager = signaturePayload;
                roleMatched = true;
            }
            if (roles[i].name === "ProcessSign") {
                updatedSignatures.riskAssessment.processManager = signaturePayload;
                roleMatched = true;
            }
        }

        if (!roleMatched) {
            return res.status(403).json({
                status: "403",
                message: "Deviation not signed: No matching role found for the required signatures."
            });
        }

        const updateData = {
            signatures: updatedSignatures
        };

        const updatedDeviation = await Deviation.findByIdAndUpdate(
            deviationId,
            { $set: updateData },
            { new: true }
        );

        res.json({
            status: "200",
            message: "Deviation Updated Successfully",
            body: updatedDeviation
        });

    } catch (error) {
        console.error("Error updating deviation:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = {
    createDeviation,
    getDeviations,
    updateDeviation,
    rejectDeviation,
    signDeviation
};