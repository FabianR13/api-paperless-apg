const mongoose = require('mongoose');

const operationsSchema = new mongoose.Schema({
  partnumber: [{
    type: String
  }],
  partName: [{
    type: String
  }],
  partEcl: {
    type: String
  },
  customer: [{
    ref: "Customer",
    type: mongoose.Schema.Types.ObjectId
  }],
  company: [{
    ref: "Company",
    type: mongoose.Schema.Types.ObjectId
  }],
  mould: {
    type: String
  },
  status: {
    type: Boolean
  },
  documents: {
    type: Array
  }
});
module.exports = mongoose.model("Parts", partSchema);