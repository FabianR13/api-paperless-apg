const ProcessEvaluationsTemplate = require("../../../models/Setup/ProcessEvaluationsTemplate.js");
const Parts = require("../../../models/Quality/Parts.js");
const User = require("../../../models/User.js");
const Employees = require("../../../models/Employees.js");
const Company = require("../../../models/Company.js");

// Getting all Evaluations/////////////////////////////////////////////////////////////////////////////////////////////////////
const getEvaluation1Template = async (req, res) => {
    
    const { CompanyId } = req.params

    if (CompanyId.length !== 24) {
        return;
    }

    const evaluation1 = await ProcessEvaluationsTemplate.find({
        company: { $in: CompanyId },
        name: { $in: "Evaluation1" }
    }).sort({ createdAt: -1 })
    .select("questions answers");
    res.json({ status: "200", message: "Evaluation 1 Loaded", body: evaluation1 });

};

module.exports = {
    getEvaluation1Template,
};