const mongoose = require('mongoose');

const chromebookSchema = new mongoose.Schema({
  chromebookName: {
    type: String
  },
  location: {
    type: String
  },
  model: {
    type: String
  },
  serialNo: {
    type: String
  },
  macAddressWifi: {
    type: String
  },
  macAddressAdaptador: {
    type: String
  },
  status: {
    type: String
  },
  chromebookCondition: {
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
module.exports = mongoose.model("Chromebook", chromebookSchema);