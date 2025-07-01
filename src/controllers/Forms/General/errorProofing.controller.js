const Company = require("../../../models/Company");
const Checklist = require("../../../models/General/Checklist");
const ErrorProofing = require("../../../models/General/ErrorProofing");
const User = require("../../../models/User");



// Getting all deviations request/////////////////////////////////////////////////////////////////////////////////////////////////////
const getErrorProofings = async (req, res) => {
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
    const errorProofings = await ErrorProofing.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        // .populate({ path: 'customer' })
        // .populate({
        //     path: 'requestBy',
        //     populate: [
        //         {
        //             path: 'signature',
        //             model: 'Signature'
        //         },
        //         {
        //             path: 'employee',
        //             model: 'Employees',
        //             populate: {
        //                 path: 'department',
        //                 model: 'Department'
        //             }
        //         }
        //     ]
        // })
        .populate({
            path: "startTechnician",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "endTechnician",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "qualityResponsible",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "productionResponsible",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({ path: 'checklists', model: "Checklist" });
    // .populate({ path: 'deviationRisk', model: "DeviationRiskAssessment" });
    res.json({ status: "200", message: "Error Proofings Loaded", body: errorProofings });
};

const createNewErrorProofing = async (req, res) => {
    try {
        const { CompanyId } = req.params;

        const {
            errorProofingName,
            device,
            startDate,
            startShift,
            startTechnician,
            version
        } = req.body;

        const newErrorProfing = new ErrorProofing({
            errorProofingName,
            device,
            startDate,
            startShift,
            errorProofingStatus: "Open",
            version
        });

        if (startTechnician.length > 0) {
            const foundUsers = await User.find({
                username: { $in: startTechnician },
            });
            newErrorProfing.startTechnician = foundUsers.map((user) => user._id);
        }

        if (CompanyId) {
            const foundCompany = await Company.find({
                _id: { $in: CompanyId },
            });
            newErrorProfing.company = foundCompany.map((company) => company._id);
        }

        const count = await ErrorProofing.estimatedDocumentCount();

        if (count > 1) {
            const errorProofings = await ErrorProofing.find().sort({ consecutive: -1 }).limit(1);
            newErrorProfing.consecutive = errorProofings[0].consecutive + 1;
        } else {
            newErrorProfing.consecutive = 1
        }

        await newErrorProfing.save()

        res.status(200).json({ status: "200", message: 'Error Profing guardada' });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al guardar Error Profing", error: error.message });
    }
}

//Actualizar error proofing
const updateErrorProofing = async (req, res) => {
    const { ErrorProofingId } = req.params;

    const {
        endDate,
        endShift,
        endTechnician,
        qualityResponsible,
        productionResponsible
    } = req.body;

    let newEndTechnician = null;
    let newQualityResponsible = null;
    let newProductionResponsible = null;
    let errorProofingStatus = "Open";
    let newQualityValidationDate = null;
    let newProductionValidationDate = null;

    if (endDate) {
        errorProofingStatus = "Closed"
        // Buscar Usuario en la base de datos
        if (endTechnician) {
            const foundUsers = await User.find({ username: endTechnician });
            if (foundUsers.length === 0) {
                return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
            }
            newEndTechnician = foundUsers.map(e => e._id);
        }
    }

    // Buscar Usuario en la base de datos
    if (qualityResponsible) {
        const foundUsers = await User.find({ username: qualityResponsible });
        if (foundUsers.length === 0) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }
        newQualityResponsible = foundUsers.map(e => e._id);
        newQualityValidationDate = new Date();
    }

    // Buscar Usuario en la base de datos
    if (productionResponsible) {
        const foundUsers = await User.find({ username: productionResponsible });
        if (foundUsers.length === 0) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }
        newProductionResponsible = foundUsers.map(e => e._id);
        newProductionValidationDate = new Date();
    }

    const updatedErrorProofing = await ErrorProofing.updateOne(
        { _id: ErrorProofingId },
        {
            $set: {
                endDate,
                endShift,
                endTechnician: newEndTechnician,
                errorProofingStatus,
                qualityResponsible: newQualityResponsible,
                productionResponsible: newProductionResponsible,
                qualityValidationDate: newQualityValidationDate,
                productionValidationDate: newProductionValidationDate,
            },
        }
    );

    if (!updatedErrorProofing) {
        res
            .status(403)
            .json({ status: "403", message: "Error Proofing not Updated", body: "" });
    }

    res
        .status(200)
        .json({ status: "200", message: "Deviation Updated ", body: updatedErrorProofing });
};

//Generar un nuevo checklist en un archivo de error proofing existente
const transformRawItems = (rawItems) => {
    if (!Array.isArray(rawItems)) return [];

    return rawItems.map(row => ({
        itemId: row.id,
        label: row.label,
        quantityOk: parseInt(row.values[0], 10) || 0,
        quantityNotOk: parseInt(row.values[1], 10) || 0,
        totalQuantity: parseInt(row.values[2], 10) || 0,
        operationOk: parseInt(row.values[3], 10) || 0,
        operationNotOk: parseInt(row.values[4], 10) || 0,
        comments: row.values[5] || ''
    }));
};

const createNewChecklist = async (req, res) => {
    try {
        const { ErrorProofingId } = req.params;
        const { sensors, clamping, nidos, visual, createdBy } = req.body;

        if (!ErrorProofingId) {
            return res.status(400).json({ message: "El campo 'idErrorProofing' es requerido." });
        }

        const updatedErrorProofing = await ErrorProofing.findByIdAndUpdate(
            ErrorProofingId,
            { $inc: { checklistCounter: 1 } }, // Incrementa el contador en 1
            { new: true } // Devuelve el documento DESPUÉS de actualizarlo
        );

        if (!updatedErrorProofing) {
            return res.status(404).json({ message: "El documento ErrorProofing con el ID proporcionado no existe." });
        }

        const consecutivo = updatedErrorProofing.checklistCounter;

        const cleanSensors = transformRawItems(sensors);
        const cleanClamping = transformRawItems(clamping);
        const cleanNidos = transformRawItems(nidos);
        const cleanVisual = transformRawItems(visual);

        const newChecklist = new Checklist({
            sensors: cleanSensors,
            clamping: cleanClamping,
            nidos: cleanNidos,
            visual: cleanVisual,
            consecutive: consecutivo
        });

        if (createdBy) {
            const foundUsers = await User.find({
                username: { $in: createdBy },
            });
            newChecklist.createdBy = foundUsers.map((user) => user._id);
        }

        const savedChecklist = await newChecklist.save();

        updatedErrorProofing.checklists.push(savedChecklist._id);
        await updatedErrorProofing.save();

        res.status(200).json({
            status: "200",
            message: "Checklist creado y referenciado exitosamente.",
            data: savedChecklist
        });

    } catch (error) {
        console.error("Error al crear checklist:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "El 'ErrorProofingId' proporcionado no es un ID válido." });
        }
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
}

module.exports = {
    getErrorProofings,
    createNewErrorProofing,
    updateErrorProofing,
    createNewChecklist
};