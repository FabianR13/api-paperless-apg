const Company = require("../../../models/Company.js");
const EndRun = require("../../../models/General/EndRun.js");
const User = require("../../../models/User.js");

//method to post endrun//////////////////////////////////////////////////////////////////////////////////////////////
const createEndRun = async (req, res) => {
  const {
    verWatherMold,
    temperatures,
    lastPieces,
    cleanMold,
    watherConection,
    machinePurge,
    labelEnclosed,
    numberOrder,
    shootCounter,
    employeeT,
    dateT,
    hours,
    lastPiecesTaken,
    removeDocument,
    motiveStopMachine,
    employeeQ,
    dateQ,
    tools,
    workStationClean,
    formatAcumulation,
    aditionalComments,
    employeeP,
    dateP,
    status,
    company,
    noCheckValidation,
  } = req.body;
  const newEndRun = new EndRun({
    verWatherMold,
    temperatures,
    lastPieces,
    cleanMold,
    watherConection,
    machinePurge,
    labelEnclosed,
    numberOrder,
    shootCounter,
    dateT,
    hours,
    lastPiecesTaken,
    removeDocument,
    motiveStopMachine,
    dateQ,
    tools,
    workStationClean,
    formatAcumulation,
    aditionalComments,
    dateP,
    status,
    noCheckValidation,
  });
  if (employeeT) {
    const foundEmployees = await User.find({
      username: { $in: employeeT },
    });
    newEndRun.employeeT = foundEmployees.map((employeeT) => employeeT._id);
  }
  if (employeeQ) {
    const foundEmployees = await User.find({
      username: { $in: employeeQ },
    });
    newEndRun.employeeQ = foundEmployees.map((employeeQ) => employeeQ._id);
  }
  if (employeeP) {
    const foundEmployees = await User.find({
      username: { $in: employeeP },
    });
    newEndRun.employeeP = foundEmployees.map((employeeP) => employeeP._id);
  }
  if (company) {
    const foundCompany = await Company.find({
      _id: { $in: company },
    });
    newEndRun.company = foundCompany.map((company) => company._id);
  }

  const savedEndRun = await newEndRun.save();
  res.json({ status: "200", message: "change mold created", savedEndRun });
}
//method to update end run/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateEndRun = async (req, res) => {
  const { endRunId } = req.params;

  if (!req.body.employeeT) {
    return res.json({ status: "403", message: "the employeeT is empty", body: "" });
  }
  const foundEmployeesT = await User.find({
    username: { $in: req.body.employeeT },
  });
  if (foundEmployeesT.length === 0) {
    return res.json({ status: "403", message: "not employeeT founded", body: "" });
  }
  const employeeT = foundEmployeesT.map((employeeT) => employeeT._id);
  if (!req.body.employeeQ) {
    return res.json({ status: "403", message: "the employeeQ is empty", body: "" });
  }
  const foundEmployeesQ = await User.find({
    username: { $in: req.body.employeeQ },
  });
  if (foundEmployeesQ.length === 0) {
    return res.json({ status: "403", message: "not employeeQ founded", body: "" });
  }
  const employeeQ = foundEmployeesQ.map((employeeQ) => employeeQ._id);
  if (!req.body.employeeP) {
    return res.json({ status: "403", message: "the employeeP is empty", body: "" });
  }
  const foundEmployeesP = await User.find({
    username: { $in: req.body.employeeP },
  });
  if (foundEmployeesP.length === 0) {
    return res.json({ status: "403", message: "not employeeP founded", body: "" });
  }
  const employeeP = foundEmployeesP.map((employeeP) => employeeP._id);
  const {
    verWatherMold,
    temperatures,
    lastPieces,
    cleanMold,
    watherConection,
    machinePurge,
    labelEnclosed,
    numberOrder,
    shootCounter,
    dateT,
    hours,
    lastPiecesTaken,
    removeDocument,
    motiveStopMachine,
    dateQ,
    tools,
    workStationClean,
    formatAcumulation,
    aditionalComments,
    dateP,
    status,
    noCheckValidation,
  } = req.body;
  const updatedEndRun = await EndRun.updateOne(
    { _id: endRunId },
    {
      $set: {
        verWatherMold,
        temperatures,
        lastPieces,
        cleanMold,
        watherConection,
        machinePurge,
        labelEnclosed,
        numberOrder,
        shootCounter,
        employeeT,
        dateT,
        hours,
        lastPiecesTaken,
        removeDocument,
        motiveStopMachine,
        employeeQ,
        dateQ,
        tools,
        workStationClean,
        formatAcumulation,
        aditionalComments,
        employeeP,
        dateP,
        status,
        noCheckValidation,
      },
    }
  );
  if (!updatedEndRun) {
    res.status(403).json({ status: "403", message: "change mold not updated", body: "" });
  }
  res.status(200).json({ status: "200", message: "change mold updated", body: updatedEndRun });
}
//method to get end run///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getEndRun = async (req, res) => {
  const endRun = await EndRun.find().sort({
    verWatherMold: 1,
  });
  res.json({ status: "200", message: "change mold loaded", body: endRun });
}

module.exports = {
  createEndRun,
  updateEndRun,
  getEndRun
};