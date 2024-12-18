const Company = require("../../../models/Company.js");

const TemporalStop = require("../../../models/General/TemporalStop.js"); //method to post temporal stop//////////////////////////////////////////////////////////////////////////////////////////


const createTemporalStop = async (req, res) => {
  const {
    date1,
    date2,
    date3,
    timeStart,
    turn,
    initalValidation,
    newSendPart,
    workStation,
    noCheckValidation,
    company,
    employeeT,
    employeeQ,
    employeeP,
    status
  } = req.body;
  const newTemporalStop = new TemporalStop({
    date1,
    date2,
    date3,
    timeStart,
    turn,
    initalValidation,
    newSendPart,
    workStation,
    noCheckValidation,
    employeeT,
    employeeQ,
    employeeP,
    status
  });

  if (company) {
    const foundCompany = await Company.find({
      _id: {
        $in: company
      }
    });
    newTemporalStop.company = foundCompany.map(company => company._id);
  }

  const savedTemporalStop = await newTemporalStop.save();
  res.json({
    status: "200",
    message: "Run data created",
    savedTemporalStop
  });
}; // method to update temporal stop///////////////////////////////////////////////////////////////////////////////////////////////////


const updateTemporalStop = async (req, res) => {
  const {
    temporalStopId
  } = req.params;
  const {
    date1,
    date2,
    date3,
    timeStart,
    turn,
    initalValidation,
    newSendPart,
    workStation,
    noCheckValidation,
    employeeT,
    employeeQ,
    employeeP,
    status
  } = req.body;
  const updatedTemporalStop = await TemporalStop.updateOne({
    _id: temporalStopId
  }, {
    $set: {
      date1,
      date2,
      date3,
      timeStart,
      turn,
      initalValidation,
      newSendPart,
      workStation,
      noCheckValidation,
      employeeT,
      employeeQ,
      employeeP,
      status
    }
  });

  if (!updatedTemporalStop) {
    res.status(403).json({
      status: "403",
      message: "mold Reset not updated",
      body: ""
    });
  }

  res.status(200).json({
    status: "200",
    message: "mold reset updated",
    body: updatedTemporalStop
  });
}; //method to get  temporalstop/////////////////////////////////////////////////////////////////////////////////////////////////////


const getTemporalStop = async (req, res) => {
  const temporalStop = await TemporalStop.find().sort({
    initalValidation: 1
  });
  res.json({
    status: "200",
    message: " temporal stop is loaded",
    body: temporalStop
  });
};

module.exports = {
  createTemporalStop,
  updateTemporalStop,
  getTemporalStop
};