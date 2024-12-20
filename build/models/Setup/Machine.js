const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  machineNumber: {
    type: Number
  },
  machineZise: {
    type: String
  },
  nozzleOrifice: {
    type: String
  },
  nozzleRadius: {
    type: String
  },
  nozzleType: {
    type: String
  },
  partInfo: [{
    ref: "PartsInfo",
    type: mongoose.Schema.Types.ObjectId
  }],
  company: [{
    ref: "Company",
    type: mongoose.Schema.Types.ObjectId
  }]
});
module.exports = mongoose.model("Machine", machineSchema);