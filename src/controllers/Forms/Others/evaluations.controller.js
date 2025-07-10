const Company = require("../../../models/Company");
const Employees = require("../../../models/Employees");
const Checklist = require("../../../models/General/Checklist");
const ErrorProofing = require("../../../models/General/ErrorProofing");
const TrialEvaluations = require("../../../models/Others/TrialEvaluations");
const User = require("../../../models/User");



// Getting all deviations request/////////////////////////////////////////////////////////////////////////////////////////////////////
const getTrialEvaluations = async (req, res) => {
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
    const trialEvaluations = await TrialEvaluations.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({
            path: "safetyResponsible",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "trainingResponsible",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "humanResourcesResponsible",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "humanResources",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "cmcap",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "directManager",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "employee",
            select: "name lastName numberEmployee"
        })
    res.json({ status: "200", message: "Trial Evaluations Loaded", body: trialEvaluations });
};

const createNewTrialEvaluation = async (req, res) => {
    try {
        const { CompanyId } = req.params;

        const {
            trialEvaluationName,
            evaluationDate,
            employee,
            knowledge,
            performance,
            approvals,
            directManager,
            version
        } = req.body;

        const newTrialEvaluation = new TrialEvaluations({
            trialEvaluationName,
            evaluationDate,
            knowledge,
            performance,
            approvals,
            version
        });

        if (employee.length > 0) {
            const foundEmployee = await Employees.findOne({
                numberEmployee: { $in: employee },
            });
            if (!foundEmployee) {
                return res.status(404).json({ message: "Empleado no encontrado" });
            }
            newTrialEvaluation.employee = foundEmployee._id;
        }

        if (directManager.length > 0) {
            const foundUser = await User.findOne({
                username: { $in: directManager },
            });
            if (!foundUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            newTrialEvaluation.directManager = foundUser._id;
        }

        if (CompanyId) {
            const foundCompany = await Company.findById(CompanyId);
            if (!foundCompany) {
                return res.status(404).json({ message: "Compañía no encontrada" });
            }
            newTrialEvaluation.company = foundCompany._id;
        }

        const count = await TrialEvaluations.estimatedDocumentCount();
        
        if (count > 1) {
            const trialEvaluations = await TrialEvaluations.find().sort({ consecutive: -1 }).limit(1);
            newTrialEvaluation.consecutive = trialEvaluations[0].consecutive + 1;
        } else {
            newTrialEvaluation.consecutive = 1
        }

        await newTrialEvaluation.save()
        console.log("aqui")
        res.status(200).json({ status: "200", message: 'Guardado con exito' });

    } catch (error) {
        console.error("Error al crear la evaluación:", error); // Para ti, en el servidor
        res.status(500).json({ message: "Ocurrió un error interno al guardar la evaluación." }); // Para el cliente
    }
}

module.exports = {
    getTrialEvaluations,
    createNewTrialEvaluation
};