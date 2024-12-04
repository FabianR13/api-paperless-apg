const mongoose = require('mongoose');

const assemblyStartProductionSchema = new mongoose.Schema({
  trainOperator: {
    type: String
  },
  materialsRemoved: {
    type: String
  },
  comments: {
    type: String
  },
  packingComponents: {
    type: String
  },
  workStation: {
    type: String
  },
  containerScrap: {
    type: String
  },
  docEstation: {
    type: String
  },
  correctComponent: {
    type: String
  },
  workCell: {
    type: String
  },
  aditionalComments: {
    type: String
  },
  employee: [{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  }],
  status: {
    type: Boolean
  },
  noCheckValidation: {
    type: Number
  },
  company: [{
    ref: "Company",
    type: mongoose.Schema.Types.ObjectId
  }]
});
module.exports = mongoose.model("AssemblyStartProduction", assemblyStartProductionSchema);