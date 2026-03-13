const TrainingEvaluation = require("../models/TrainingEvaluation.js");
const Parts = require("../models/Parts.js");
const User = require("../models/User.js");
const Employees = require("../models/Employees.js");
const Company = require("../models/Company.js");

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const createTrainingEvaluation = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        evaluationStatus,
        evaluationDate,
        evaluationType,
        operationType,
        qualification,
        qualifiedBy,
        trainer,
        partNumber,
        numberEmployee,
        question1,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8,
        question9,
        question10,
        question11,
        question12,
        question13,
        question14,
        question15,
        question16,
        question17,
        version,
        recertificationLevel
    } = req.body;

    const isInvalidInput = (fieldValue) => {
        return (
            fieldValue === undefined ||
            fieldValue === null ||
            fieldValue === "" ||
            (Array.isArray(fieldValue) && fieldValue.length === 0)
        );
    };

    if (isInvalidInput(trainer) || isInvalidInput(partNumber) || isInvalidInput(numberEmployee)) {
        return res.status(400).json({
            status: "400",
            message: "No se guardó la evaluación porque no se pudieron analizar los datos correctamente."
        });
    }

    const newTrainingEvaluation = new TrainingEvaluation({
        evaluationStatus,
        evaluationDate,
        evaluationType,
        operationType,
        qualification,
        question1,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8,
        question9,
        question10,
        question11,
        question12,
        question13,
        question14,
        question15,
        question16,
        question17,
        version,
        recertificationLevel
    });

    try {
        if (qualifiedBy) {
            const foundUsers = await User.find({
                username: { $in: qualifiedBy },
            });
            newTrainingEvaluation.qualifiedBy = foundUsers.map((user) => user._id);
        }

        if (trainer) {
            const foundUsers = await User.find({
                username: { $in: trainer },
            });
            newTrainingEvaluation.trainer = foundUsers.map((user) => user._id);
        }

        if (partNumber) {
            const foundParts = await Parts.find({
                _id: { $in: partNumber },
            });
            newTrainingEvaluation.partNumber = foundParts.map((parts) => parts._id);
        }

        if (numberEmployee) {
            const foundEmployee = await Employees.find({
                numberEmployee: { $in: numberEmployee },
            });
            newTrainingEvaluation.numberEmployee = foundEmployee.map((employee) => employee._id);
        }

        if (CompanyId) {
            const foundCompany = await Company.find({
                _id: { $in: CompanyId },
            });
            newTrainingEvaluation.company = foundCompany.map((company) => company._id);
        }

        // Guardar la nueva evaluación
        const savedTrainingEvaluation = await newTrainingEvaluation.save();
        res.json({ status: "200", message: "Evaluation Created", body: savedTrainingEvaluation });

    } catch (error) {
        // Captura errores de las operaciones await (búsquedas en BD, save)
        console.error("Error al crear la evaluación de entrenamiento:", error);
        // El error de Mongoose (si los arrays requeridos están vacíos después de los mapeos) también se capturará aquí.
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: "400", message: "Error de validación: " + error.message, errors: error.errors });
        }
        return res.status(500).json({ status: "500", message: "Error interno del servidor al crear la evaluación.", error: error.message });
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const countEvaluations = async (req, res) => {
    const { CompanyId } = req.params
    if (CompanyId.length !== 24) {
        return;
    }

    let count = await TrainingEvaluation.find().count()
    let countNew = await TrainingEvaluation.find({
        company: { $in: CompanyId }, evaluationStatus: { $in: "new" },
    }).count()

    res.json({ status: "200", countNew: countNew, count: count });
};

// Getting all Evaluations/////////////////////////////////////////////////////////////////////////////////////////////////////
const getEvaluations = async (req, res) => {
    const { limit } = req.body;
    const { CompanyId } = req.params;

    if (CompanyId.length !== 24) {
        return res.status(400).json({ status: "400", message: "Invalid Company ID" });
    }

    try {
        const activeEmployees = await Employees.find({
            company: CompanyId,
            active: true,
            position: "6891274cb4cdc28fbceed01d"
        }).select('_id');

        const activeEmployeeIds = activeEmployees.map(emp => emp._id);

        const evaluations = await TrainingEvaluation.find({
            company: CompanyId,
            numberEmployee: { $in: activeEmployeeIds }
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate({
                path: 'numberEmployee',
                select: 'numberEmployee name lastName'
            })
            .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
            .populate({ path: 'qualifiedBy', populate: [{ path: "signature" }, { path: "employee", model: "Employees" }] })
            .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } });

        res.json({ status: "200", message: "Evaluations Loaded", body: evaluations });

    } catch (error) {
        console.error("Error fetching evaluations:", error);
        res.status(500).json({ status: "500", message: "Error fetching evaluations" });
    }
};

// Getting Evaluation by Id////////////////////////////////////////////////////////////////////////////////////////////////////////
const getEvaluationById = async (req, res) => {
    const foundEvaluation = await TrainingEvaluation.findById(req.params.evaluationId)
        .populate({ path: 'numberEmployee' })
        .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
        .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
        .populate({ path: 'qualifiedBy', populate: [{ path: "signature" }, { path: "employee", model: "Employees" }] });;
    if (!foundEvaluation) {
        res
            .status(403)
            .json({ status: "403", message: "Evaluation not Founded", body: "" });
    }

    res
        .status(200)
        .json({ status: "200", message: "Efaluation Founded", body: foundEvaluation });
};

// Actualizar calificacion de evaluacion/////////////////////////////////////////////////////////////////////////////////
const updateTrainingEvaluation = async (req, res) => {

    const { evaluationId } = req.params;
    const evaluationNewData = [];

    const {
        evaluationStatus,
        qualification,
        question1,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8,
        question9,
        question10,
        question11,
        question12,
        question13,
        question14,
        question15,
        question16,
        question17,
    } = req.body;

    if (req.body.qualifiedBy) {
        const foundUsers = await User.find({
            username: { $in: req.body.qualifiedBy },
        });
        evaluationNewData.qualifiedBy = foundUsers.map((user) => user._id);
    }

    const {
        qualifiedBy
    } = evaluationNewData;

    const updatedTrainingEvaluation = await TrainingEvaluation.updateOne(
        { _id: evaluationId },
        {
            $set: {
                qualifiedBy,
                evaluationStatus,
                qualification,
                question1,
                question2,
                question3,
                question4,
                question5,
                question6,
                question7,
                question8,
                question9,
                question10,
                question11,
                question12,
                question13,
                question14,
                question15,
                question16,
                question17,
            },
        }
    );

    if (!updatedTrainingEvaluation) {
        res
            .status(403)
            .json({ status: "403", message: "Evaluation not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Evaluation Updated ",
        body: updatedTrainingEvaluation,
    });
};

//delete evaluation/////////////////////////////////////////////////////////////////////////////////////////////////////
const deleteTrainingEvaluation = async (req, res) => {
    const { evaluationId } = req.params;

    TrainingEvaluation.findById(evaluationId, function (err, TrainingEvaluation) {
        if (err) {
            res.status(503).json({
                status: "403",
                message: err,
            });
            return;
        }
        TrainingEvaluation.remove(
            res.status(200).json({
                status: "200",
                message: 'The evaluation has been deleted',
            }));
    });
};

// Actualizar calificacion de evaluacion/////////////////////////////////////////////////////////////////////////////////
const updateEvaluationRegister = async (req, res) => {
    const { evaluationId } = req.params;

    const {
        isChecked
    } = req.body;

    const updatedTrainingEvaluation = await TrainingEvaluation.updateOne(
        { _id: evaluationId },
        {
            $set: {
                isChecked
            },
        }
    );

    if (!updatedTrainingEvaluation) {
        // console.log("Evaluation not Updated",)
        res
            .status(403)
            .json({ status: "403", message: "Evaluation not Updated", body: "" });
    }

    //console.log("Evaluation updated")
    res.status(200).json({
        status: "200",
        message: "Evaluation Updated ",
        body: updatedTrainingEvaluation,
    });
};


// OBTENER EVALUACIONES POR FILTRO /////
const getEvaluationsFiltered = async (req, res) => {
    const { start, end, status, partNo, operator, company } = req.body;
    let options = {};

    try {
        if (start && end) {
            options["evaluationDate"] = {
                $gte: new Date(start),
                $lte: new Date(end)
            };
        }

        if (status) {
            options["evaluationStatus"] = status;
        }
        if (partNo) {
            options["partNumber"] = { $in: partNo };
        }

        if (company) {
            options["company"] = company;
        }

        let employeeQuery = {
            company: company,
            active: true,
            position: "6891274cb4cdc28fbceed01d"
        };

        if (operator) {
            employeeQuery.numberEmployee = operator;
        }

        const validEmployees = await Employees.find(employeeQuery).select('_id');
        const validEmployeeIds = validEmployees.map(emp => emp._id);

        options["numberEmployee"] = { $in: validEmployeeIds };

        const trainingEvaluationsF = await TrainingEvaluation.find(options)
            .populate({
                path: 'numberEmployee',
                select: 'numberEmployee name lastName'
            })
            .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
            .populate({ path: 'qualifiedBy', populate: [{ path: "signature" }, { path: "employee", model: "Employees" }] })
            .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
            .sort({ createdAt: -1 });

        res.json({ status: "200", message: "Evaluations Loaded New", body: trainingEvaluationsF });

    } catch (error) {
        console.error("Error filtrando evaluaciones:", error);
        res.status(500).json({ status: "500", message: "Error en el servidor al filtrar datos" });
    }
};

/// TENER EVALUACIONES PARA MATRIZ //////////////////////////////////////////////////////////////////////////////////////////////////
const getMatrixEvaluations = async (req, res) => {
    const { CompanyId } = req.params;

    if (CompanyId.length !== 24) {
        return res.status(400).json({ status: "400", message: "Invalid Company ID" });
    }

    try {
        const [evaluations, activeParts, activeEmployees] = await Promise.all([

            TrainingEvaluation.find({
                company: CompanyId
            })
                .select('evaluationStatus qualification evaluationType operationType numberEmployee partNumber')
                .populate({
                    path: 'numberEmployee',
                    match: {
                        active: true,
                        position: "6891274cb4cdc28fbceed01d"
                    },
                    select: 'numberEmployee name lastName'
                })
                .populate({
                    path: 'partNumber',
                    select: 'partnumber'
                })
                .lean(),

            Parts.find({
                company: CompanyId,
                status: true,
                // showInTraining: true
            })
                .select('partnumber operations customer countOperations')
                .populate({
                    path: 'customer',
                    select: 'name'
                })
                .lean(),

            Employees.find({
                company: CompanyId,
                active: true,
                position: "6891274cb4cdc28fbceed01d"
            })
                .select('numberEmployee name lastName')
                .lean()
        ]);

        const activeEvaluations = evaluations.filter(ev => ev.numberEmployee && ev.numberEmployee.length > 0);

        res.json({
            status: "200",
            message: "Matrix Data Loaded",
            evaluations: activeEvaluations,
            parts: activeParts,
            employees: activeEmployees
        });

    } catch (error) {
        console.error("Error fetching matrix data:", error);
        res.status(500).json({ status: "500", message: "Server error fetching matrix data" });
    }
};

module.exports = {
    createTrainingEvaluation,
    getEvaluations,
    getEvaluationById,
    updateTrainingEvaluation,
    deleteTrainingEvaluation,
    updateEvaluationRegister,
    countEvaluations,
    getEvaluationsFiltered,
    getMatrixEvaluations
};