const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String
  }
});
module.exports = mongoose.model("Customer", customerSchema);