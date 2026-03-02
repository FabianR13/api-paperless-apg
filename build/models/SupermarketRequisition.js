const mongoose = require('mongoose');

const supermarketRequsitionSchema = new mongoose.Schema({
  consecutive: {
    type: Number
  },
  responsible: [{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  }],
  machine: {
    type: String
  },
  status: {
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
module.exports = mongoose.model("Laptops", laptopsSchema);