const AssemblyStartQuality = require("../models/AssemblyStartQuality.js");
const User = require("../models/User.js");
const Company = require("../models/Company.js");
const DeviationRequest = require("../models/DeviationRequest.js");

//method to post assemblystar quality/////////////////////////////////////////////////////////////////////////////////
const createAssemblyStartQuality = async (req, res) => {
    const {
        sheetVerification,
        numberDevitaion,
        moldRepairs,
        orderJob,
        materialVerified,
        numberDryer,
        technicalVal,
        comments,
        alarms,
        temperatures,
        employee,
        status,
        noCheckValidation,
        company,
    } = req.body;

    const newAssemblyStartQuality = new AssemblyStartQuality({
        sheetVerification,
        moldRepairs,
        orderJob,
        materialVerified,
        numberDryer,
        technicalVal,
        comments,
        alarms,
        temperatures,
        status,
        noCheckValidation,
    });
    if (employee) {
        const foundEmployees = await User.find({
            username: { $in: employee },
        });
        newAssemblyStartQuality.employee = foundEmployees.map((employee) => employee._id);
    }
    if (!numberDevitaion) {
        return res.json({ status: "403", message: "number deviation not in here", body: "" });
    }
    const foundDeviationRequest = await DeviationRequest.find({
        deviationNumber: { $in: numberDevitaion },
    });
    newAssemblyStartQuality.numberDevitaion = foundDeviationRequest.map((numberDevitaion) => numberDevitaion._id);
    if (company) {
        const foundCompany = await Company.find({
            _id: { $in: company },
        });
        newAssemblyStartQuality.company = foundCompany.map((company) => company._id);
    }

    const savedAssemblyStartQuality = await newAssemblyStartQuality.save();
    res.json({ status: "200", message: "Assembly Quality created", savedAssemblyStartQuality });
}
//method to update///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateAssemblyStartQuality = async (req, res) => {
    const { assemblyStartQualityId } = req.params;

    if (!req.body.employee) {
        return res.json({ status: "403", message: "the employee is empty", body: "" });
    }
    const foundEmployees = await User.find({
        username: { $in: req.body.employee },
    });
    if (foundEmployees.length === 0) {
        return res.json({ status: "403", message: "not employee founded", body: "" });
    }
    const employee = foundEmployees.map((employee) => employee._id);
    if (!req.body.numberDevitaion) {
        return res.json({ status: "403", message: "the number deviation is empty", body: "" });
    }
    const foundDeviationRequest = await DeviationRequest.find({
        deviationNumber: { $in: req.body.numberDevitaion },
    });
    if (foundDeviationRequest.length === 0) {
        return res.json({ status: "403", message: "not number deviation founded", body: "" });
    }
    const numberDevitaion = foundDeviationRequest.map((numberDevitaion) => numberDevitaion._id);
    const {
        sheetVerification,
        moldRepairs,
        orderJob,
        materialVerified,
        numberDryer,
        technicalVal,
        comments,
        alarms,
        temperatures,
        status,
        noCheckValidation,
    } = req.body;
    const updatedAssemblyStartQuality = await AssemblyStartQuality.updateOne(
        { _id: assemblyStartQualityId },
        {
            $set: {
                sheetVerification,
                numberDevitaion,
                moldRepairs,
                orderJob,
                materialVerified,
                numberDryer,
                technicalVal,
                comments,
                alarms,
                temperatures,
                employee,
                status,
                noCheckValidation,
            },
        }
    );
    if (!updatedAssemblyStartQuality) {
        res.status(403).json({ status: "403", message: "assembly quality not updated", body: "" });
    }
    res.status(200).json({ status: "200", message: "assembly quality updated", body: updatedAssemblyStartQuality });
}
//method to get/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getAssemblyStartQuality = async (req, res) => {
    const assemblyStartQuality = await AssemblyStartQuality.find().sort({
        sheetVerification: 1,
    });
    res.json({ status: "200", message: "assembly quality loaded", body: assemblyStartQuality });
}

module.exports = {
    createAssemblyStartQuality,
    updateAssemblyStartQuality,
    getAssemblyStartQuality
};