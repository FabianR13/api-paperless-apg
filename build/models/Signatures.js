const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  signature: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
});
module.exports = mongoose.model("Signature", signatureSchema);