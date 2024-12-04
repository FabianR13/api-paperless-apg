const mongoose = require('mongoose');

const accountsSchema = new mongoose.Schema({
  responsible: [{
    ref: "Employees",
    type: mongoose.Schema.Types.ObjectId
  }],
  responsibleAlt: {
    type: String
  },
  responsibleGroup: [{
    ref: "GenericAccount",
    type: mongoose.Schema.Types.ObjectId
  }],
  modifiedBy: [{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  }],
  modified: {
    type: Boolean
  },
  prismUser: {
    type: String
  },
  email: {
    type: String
  },
  windowsUser: {
    type: String
  },
  paperlessUser: {
    type: String
  },
  printerUser: {
    type: String
  },
  ext: {
    type: String
  },
  status: {
    type: String
  },
  responsibeLetter: {
    type: String
  },
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
module.exports = mongoose.model("Accounts", accountsSchema);