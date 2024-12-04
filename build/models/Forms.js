const mongoose = require('mongoose');

const formsSchema = new mongoose.Schema({
  name: String,
  description: String,
  back: String,
  dashboard: [{
    ref: "Dashboard",
    type: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true,
  versionKey: false
});
module.exports = mongoose.model("Forms", formsSchema);