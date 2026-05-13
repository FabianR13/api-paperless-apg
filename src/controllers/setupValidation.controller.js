const Company = require("../models/Company");
const Deviation = require("../models/Deviation");
const Employees = require("../models/Employees");
const Parts = require("../models/Parts");
const SetupValidation = require("../models/SetupValidation");
const User = require("../models/User");

// FUNBCION DE OBTENER LOS REGISTROS DE SETUP VALIDATION //
const getSetupValidations = async (req, res) => {
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

        const userPopulateConfig = {
            select: 'name lastName signature employee',
            populate: [
                { path: 'signature', model: 'Signature' },
                {
                    path: 'employee',
                    model: 'Employees',
                    select: 'name lastName numberEmployee'
                }
            ]
        };

        const populateQuery = [
            {
                path: 'headerInfo.partNumber',
                model: 'Parts',
            },
            {
                path: 'setupValidation.qualityInspector.processVerificationFilled.deviationNumber',
                model: 'Deviation',
                select: 'deviationNumber'
            },
            {
                path: 'headerInfo.moldInstalledBy',
                model: 'Employees',
                select: 'name lastName numberEmployee'
            },
            { path: 'setupValidation.setupTech.employeeId', ...userPopulateConfig },
            { path: 'setupValidation.qualityInspector.employeeId', ...userPopulateConfig },
            { path: 'setupValidation.leadHand.employeeId', ...userPopulateConfig },
            { path: 'restarts.setupTech.employeeId', ...userPopulateConfig },
            { path: 'restarts.quality.employeeId', ...userPopulateConfig },
            { path: 'restarts.leadHand.employeeId', ...userPopulateConfig },
            { path: 'endOfRun.setupTech.employeeId', ...userPopulateConfig },
            { path: 'endOfRun.quality.employeeId', ...userPopulateConfig },
            { path: 'endOfRun.leadHand.employeeId', ...userPopulateConfig }
        ];

        const setupValidations = await SetupValidation.find({
            company: { $in: CompanyId },
        })
            .sort({ createdAt: -1 })
            .populate(populateQuery);

        res.json({ status: "200", message: "SetUp Validations Loaded", body: setupValidations });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error loading Setup Validations" });
    }
};

// Crear Setup Validation /////////////////////////////////////////////////////////////////////
const createSetupValidation = async (req, res) => {
    const { CompanyId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const foundCompany = await Company.findById(CompanyId);
    if (!foundCompany) return res.status(404).json({ status: "error", message: "Company not found" });

    const { headerInfo, setupTech } = req.body;

    const now = new Date();

    const mxFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Mexico_City',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });

    const parts = mxFormatter.formatToParts(now);
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    const hour = parts.find(p => p.type === 'hour').value;
    const minute = parts.find(p => p.type === 'minute').value;
    const second = parts.find(p => p.type === 'second').value;
    const newDate = `${year}-${month}-${day}`; // Fecha actual para el ID

    let turno;

    if (hour >= 7 && hour < 15) { // D: 7:00 a 12:59 hrs
        turno = 'D';
    } else if (hour >= 15 && hour < 23) {// A: 13:00 a 22:59 hrs
        turno = 'A';
    } else { // N: 23:00 a 06:59 hrs
        turno = 'N';
    }

    const idValidationPrefix = `SVC-${newDate}-${turno}`;

    // Buscar el último pedido creado
    const lastRegister = await SetupValidation.findOne().sort({ createdAt: -1 });

    let consecutivo = 1;

    if (lastRegister && lastRegister.validationId) {
        const lastId = lastRegister.validationId;

        // (?:-\d+)? permite ignorar el "-1" si existe, capturando el número base en el grupo 2.
        const idMatch = lastId.match(/SVC-\d{4}-\d{2}-\d{2}-([DAN])(\d+)(?:-\d+)?$/);

        if (idMatch && idMatch.length >= 3) {
            const lastTurno = idMatch[1]; // La letra del turno anterior (ej: 'N')
            const lastNumber = parseInt(idMatch[2], 10); // El número base (ej: 1)

            if (lastTurno === turno) {
                // Si seguimos en el mismo turno, sumamos.
                consecutivo = lastNumber + 1;
            }
            // Si el turno es diferente, consecutivo se queda en 1 (reinicio).
        }
    }

    const paddedConsecutivo = String(consecutivo).padStart(3, '0');
    let validationId = `${idValidationPrefix}${paddedConsecutivo}`; // Usamos 'let' para modificarlo si es necesario

    // --- VALIDACIÓN DE DUPLICADOS (SOLO TURNO N) ---
    if (turno === 'N') {
        // Verificamos si este ID base ya existe (conflicto madrugada vs noche)
        const existe = await SetupValidation.findOne({ validationId: validationId });

        if (existe) {
            // Si existe, simplemente agregamos "-1" para diferenciarlo.
            // No buscamos -2, -3, etc. Siempre será -1 como indicador de duplicado de turno.
            validationId = `${validationId}-1`;
        }
    }

    try {
        const foundPart = await Parts.findById(headerInfo.partNumber);
        if (!foundPart) return res.status(404).json({ status: "error", message: "Part Number not found" });

        const foundEmployee = await Employees.findById(headerInfo.moldInstalledBy);
        if (!foundEmployee) return res.status(404).json({ status: "error", message: "Employee not found" });

        const newValidation = new SetupValidation({
            headerInfo: {
                validationId: validationId,
                partNumber: headerInfo.partNumber,
                shift: headerInfo.shift,
                machineNumber: headerInfo.machineNumber,
                date: now,
                startupTime: headerInfo.startupTime,
                resinUsed: headerInfo.resinUsed,
                quotedCycleTime: headerInfo.quotedCycleTime,
                moldInstalledBy: headerInfo.moldInstalledBy,
                setupValidationStatus: "New"
            },
            setupValidation: {
                setupTech: {
                    ...setupTech,
                    employeeId: user._id,
                    signedAt: now
                }
            },
            company: CompanyId
        });

        // 5. Guardar en la base de datos
        await newValidation.save();

        res.status(200).json({
            status: "200",
            message: "Setup Validation created successfully",
            body: newValidation
        });

    } catch (error) {
        console.error("Error creating Setup Validation:", error);
        res.status(500).json({
            status: 500,
            message: "Error saving record",
            error: error.message
        });
    }
};

// GUARDAR APARTADO CALIDAD INICIAL /////////////////////////////////////////////////////////////////////
const updateQualityValidation = async (req, res) => {
    const { ValidationId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const { qualityInspector } = req.body;

    const now = new Date();

    try {
        const foundDeviation = await Deviation.findById(qualityInspector.processVerificationFilled.deviationNumber)
        if (!foundDeviation) return res.status(404).json({ status: "error", message: "Deviation Number not found" });

        const updateValidation = await SetupValidation.findByIdAndUpdate(
            ValidationId,
            {
                $set: {
                    "headerInfo.setupValidationStatus": "Initial Quality Filled",
                    "setupValidation.qualityInspector": {
                        ...qualityInspector,
                        employeeId: user._id,
                        signedAt: now
                    }
                }
            },
            { new: true }
        )

        if (!updateValidation) {
            return res.status(404).json({ status: "error", message: "Validation not updated" });
        }

        res.status(200).json({
            status: "200",
            message: "Setup Validation updated",
            body: updateValidation
        });

    } catch (error) {
        console.error("Error updating Setup Validation:", error);
        res.status(500).json({
            status: 500,
            message: "Error saving record",
            error: error.message
        });
    }
};

// GUARDAR APARTADO PRODUCCION INICIAL /////////////////////////////////////////////////////////////////////
const updateLeadHandValidation = async (req, res) => {
    const { ValidationId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const { leadHand } = req.body;

    const now = new Date();

    try {
        const updateValidation = await SetupValidation.findByIdAndUpdate(
            ValidationId,
            {
                $set: {
                    "headerInfo.setupValidationStatus": "Initial Production Filled",
                    "setupValidation.leadHand": {
                        ...leadHand,
                        employeeId: user._id,
                        signedAt: now
                    }
                }
            },
            { new: true }
        )

        if (!updateValidation) {
            return res.status(404).json({ status: "error", message: "Validation not updated" });
        }

        res.status(200).json({
            status: "200",
            message: "Setup Validation updated",
            body: updateValidation
        });

    } catch (error) {
        console.error("Error updating Setup Validation:", error);
        res.status(500).json({
            status: 500,
            message: "Error saving record",
            error: error.message
        });
    }
};

// GUARDAR REINICIOS /////////////////////////////////////////////////////////////////////
const updateRestartValidation = async (req, res) => {
    const { ValidationId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const { stage, restartId, data } = req.body;

    const now = new Date();

    let updateQuery = {};
    let options = { new: true };

    try {
        if (stage === "SETUP") {
            updateQuery = {
                $push: {
                    restarts: {
                        date: now,
                        timeOfStartup: data.timeOfStartup,
                        setupTech: {
                            normalStartupChecked: data.normalStartupChecked,
                            employeeId: user._id,
                            signedAt: now
                        }
                    }
                },
                $set: {
                    "headerInfo.setupValidationStatus": "Shutdown/Restart Started"
                }
            };
        }
        else if (stage === "QUALITY") {
            updateQuery = {
                $set: {
                    "restarts.$[elem].quality": {
                        newFirstOffIssued: data.newFirstOffIssued,
                        employeeId: user._id,
                        signedAt: now
                    },
                    "headerInfo.setupValidationStatus": "Shutdown/Restart Pending"
                }
            };
            options.arrayFilters = [{ "elem._id": restartId }];
        }
        else if (stage === "LEAD_HAND") {
            updateQuery = {
                $set: {
                    "restarts.$[elem].leadHand": {
                        workcellReady: data.workcellReady,
                        employeeId: user._id,
                        signedAt: now
                    },
                    "headerInfo.setupValidationStatus": "Shutdown/Restart Completed"
                }
            };
            options.arrayFilters = [{ "elem._id": restartId }];
        }

        const updatedValidation = await SetupValidation.findByIdAndUpdate(
            ValidationId,
            updateQuery,
            options
        );

        if (!updatedValidation) {
            return res.status(404).json({ status: "error", message: "Validation record not found" });
        }

        res.status(200).json({
            status: 200,
            message: `Restart Phase ${stage} saved successfully`,
            body: updatedValidation
        });

    } catch (error) {
        console.error("Error saving Restart Phase:", error);
        res.status(500).json({ status: 500, message: "Server Error", error: error.message });
    }
};

// GUARDAR END RUN /////////////////////////////////////////////////////////////////////
const updateEndRunValidation = async (req, res) => {
    const { ValidationId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const userId = req.userId;
    const { stage, data } = req.body;

    const now = new Date();

    let updateQuery = {};

    try {
        if (stage === "SETUP") {
            updateQuery = {
                $set: {
                    "endOfRun.setupTech": {
                        ...data,
                        employeeId: userId,
                        signedAt: now
                    },
                    "headerInfo.setupValidationStatus": "End of Run Started"
                }
            };
        }
        else if (stage === "QUALITY") {
            updateQuery = {
                $set: {
                    "endOfRun.quality": {
                        ...data,
                        employeeId: userId,
                        signedAt: now
                    },
                    "headerInfo.setupValidationStatus": "End of Run Pending"
                }
            };
        }
        else if (stage === "LEAD_HAND") {
            updateQuery = {
                $set: {
                    "endOfRun.leadHand": {
                        ...data,
                        employeeId: userId,
                        signedAt: now
                    },
                    "headerInfo.setupValidationStatus": "Completed"
                }
            };
        }

        const updatedValidation = await SetupValidation.findByIdAndUpdate(
            ValidationId,
            updateQuery,
            { new: true }
        );

        if (!updatedValidation) {
            return res.status(404).json({ status: "error", message: "Validation record not found" });
        }

        res.status(200).json({
            status: 200,
            message: `End of Run Phase ${stage} saved successfully`,
            body: updatedValidation
        });

    } catch (error) {
        console.error("Error saving Restart Phase:", error);
        res.status(500).json({ status: 500, message: "Server Error", error: error.message });
    }
};

module.exports = {
    getSetupValidations,
    createSetupValidation,
    updateQualityValidation,
    updateLeadHandValidation,
    updateRestartValidation,
    updateEndRunValidation
}