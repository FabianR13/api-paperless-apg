const TrainingEvaluation = require("../../../models/Others/TrainingEvaluation.js");
const Parts = require("../../../models/Quality/Parts.js");
const User = require("../../../models/User.js");
const Employees = require("../../../models/Employees.js");
const Company = require("../../../models/Company.js");
const dotenv = require('dotenv');
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

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
        version
    } = req.body;
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
        version
    });

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
            partnumber: { $in: partNumber },
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

    newTrainingEvaluation.save((error, newTrainingEvaluation) => {
        if (error) return res.status(400).json({ status: "400", message: error });
        if (newTrainingEvaluation) {
            res.json({ status: "200", message: "Evaluation Created", body: newTrainingEvaluation });
        }
    });
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
    const { filter, order, limit } = req.body
    const { CompanyId } = req.params
    let count = 0;
    let skip = 0;

    if (CompanyId.length !== 24) {
        return;
    }

    if ((order === 1) && (filter === "createdAt")) {
        count = await TrainingEvaluation.find().count();
        skip = limit;
    }

    if (filter === "createdAt") {
        const evaluations = await TrainingEvaluation.find({
            company: { $in: CompanyId },
        }).populate({ path: 'numberEmployee' })
            .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
            .populate({ path: 'qualifiedBy' })
            .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
            .limit(limit)
            .skip(count - skip)
            .sort({ createdAt: order });
        res.json({ status: "200", message: "Evaluations Loaded", body: evaluations });
    }
    if (filter === "numberEmployee") {
        const evaluations = await TrainingEvaluation.find({
            company: { $in: CompanyId },
        }).populate({ path: 'numberEmployee' })
            .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
            .populate({ path: 'qualifiedBy' })
            .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
            .limit(limit)
            .sort({ numberEmployee: order });
        res.json({ status: "200", message: "Evaluations Loaded", body: evaluations });
    }
    if (filter === "partNumber") {
        const evaluations = await TrainingEvaluation.find({
            company: { $in: CompanyId },
        }).populate({ path: 'numberEmployee' })
            .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
            .populate({ path: 'qualifiedBy' })
            .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
            .limit(limit)
            .sort({ partNumber: order });
        res.json({ status: "200", message: "Evaluations Loaded", body: evaluations });
    }
    if (filter === "operationType") {
        const evaluations = await TrainingEvaluation.find({
            company: { $in: CompanyId },
        }).populate({ path: 'numberEmployee' })
            .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
            .populate({ path: 'qualifiedBy' })
            .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
            .limit(limit)
            .sort({ operationType: order });
        res.json({ status: "200", message: "Evaluations Loaded", body: evaluations });
    }
    if (filter === "evaluationType") {
        const evaluations = await TrainingEvaluation.find({
            company: { $in: CompanyId },
        }).populate({ path: 'numberEmployee' })
            .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
            .populate({ path: 'qualifiedBy' })
            .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
            .limit(limit)
            .sort({ evaluationType: order });
        res.json({ status: "200", message: "Evaluations Loaded", body: evaluations });
    }
    if (filter === "qualification") {
        const evaluations = await TrainingEvaluation.find({
            company: { $in: CompanyId },
        }).populate({ path: 'numberEmployee' })
            .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
            .populate({ path: 'qualifiedBy' })
            .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
            .limit(limit)
            .sort({ qualification: order });
        res.json({ status: "200", message: "Evaluations Loaded", body: evaluations });
    }
    if (filter === "trainer") {
        const evaluations = await TrainingEvaluation.find({
            company: { $in: CompanyId },
        }).populate({ path: 'numberEmployee' })
            .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
            .populate({ path: 'qualifiedBy' })
            .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
            .limit(limit)
            .sort({ trainer: order });
        res.json({ status: "200", message: "Evaluations Loaded", body: evaluations });
    }
    if (filter === "evaluationStatus") {
        const evaluations = await TrainingEvaluation.find({
            company: { $in: CompanyId },
        }).populate({ path: 'numberEmployee' })
            .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
            .populate({ path: 'qualifiedBy' })
            .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
            .limit(limit)
            .sort({ evaluationStatus: order });
        res.json({ status: "200", message: "Evaluations Loaded", body: evaluations });
    }
};

// Getting Evaluation by Id////////////////////////////////////////////////////////////////////////////////////////////////////////
const getEvaluationById = async (req, res) => {
    const foundEvaluation = await TrainingEvaluation.findById(req.params.evaluationId)
        .populate({ path: 'numberEmployee' })
        .populate({ path: 'partNumber', populate: { path: "customer", model: "Customer" } })
        .populate({ path: 'qualifiedBy' })
        .populate({ path: 'trainer', populate: { path: "employee", model: "Employees" } })
        .populate({ path: 'qualifiedBy', populate: { path: "employee", model: "Employees" } });;
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
        question13
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
                question13
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




module.exports = {
    createTrainingEvaluation,
    getEvaluations,
    getEvaluationById,
    updateTrainingEvaluation,
    deleteTrainingEvaluation,
    updateEvaluationRegister,
    countEvaluations
};