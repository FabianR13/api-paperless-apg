const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  direction: {
    type: String
  },
  location: {
    type: String
  }
});
module.exports = mongoose.model("Company", companySchema);