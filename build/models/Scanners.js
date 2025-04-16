const mongoose = require('mongoose');

const scannerSchema = new mongoose.Schema({
  scannerName: {
    type: String
  },
  location: {
    type: String
  },
  model: {
    type: String
  },
  serialNoScanner: {
    type: String
  },
  serialNoBase: {
    type: String
  },
  pairCode: {
    type: String
  },
  status: {
    type: String
  },
  scannerCondition: {
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
module.exports = mongoose.model("Scanner", scannerSchema);