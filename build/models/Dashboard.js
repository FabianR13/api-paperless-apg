const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  icon: {
    type: String
  },
  back: {
    type: String
  },
  pos: {
    type: Number
  }
}, {
  timestamps: true,
  versionKey: false
});
module.exports = mongoose.model("Dashboard", dashboardSchema);