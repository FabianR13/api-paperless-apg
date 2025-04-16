const mongoose = require('mongoose');

const labelPrinterSchema = new mongoose.Schema({
  printerName: {
    type: String
  },
  location: {
    type: String
  },
  marca: {
    type: String
  },
  model: {
    type: String
  },
  serialNo: {
    type: String
  },
  macAddress: {
    type: String
  },
  ipAddress: {
    type: String
  },
  status: {
    type: String
  },
  printerCondition: {
    type: String
  },
  comments: {
    type: String
  },
  modifiedBy: [{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  }],
  version: {
    type: Number
  },
  company: [{
    ref: "Company",
    type: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true
});
module.exports = mongoose.model("LabelPrinter", labelPrinterSchema);