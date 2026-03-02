const mongoose = require('mongoose');

const endRunSchema = new mongoose.Schema({
  verWatherMold: {
    type: String
  },
  temperatures: {
    type: String
  },
  lastPieces: {
    type: String
  },
  cleanMold: {
    type: String
  },
  watherConection: {
    type: String
  },
  machinePurge: {
    type: String
  },
  labelEnclosed: {
    type: String
  },
  numberOrder: {
    type: String
  },
  shootCounter: {
    type: String
  },
  employeeT: [{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  }],
  dateT: {
    type: Date
  },
  hours: {
    type: String
  },
  lastPiecesTaken: {
    type: String
  },
  removeDocument: {
    type: String
  },
  motiveStopMachine: {
    type: String
  },
  employeeQ: [{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  }],
  dateQ: {
    type: Date
  },
  tools: {
    type: String
  },
  workStationClean: {
    type: String
  },
  formatAcumulation: {
    type: String
  },
  aditionalComments: {
    type: String
  },
  employeeP: [{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  }],
  dateP: {
    type: Date
  },
  status: {
    type: Boolean
  },
  company: [{
    ref: "Company",
    type: mongoose.Schema.Types.ObjectId
  }],
  noCheckValidation: {
    type: Number
  }
});
module.exports = mongoose.model("EndRun", endRunSchema);