// models/PushToken.js
const mongoose = require("mongoose");

const pushTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  isSupplier: { type: Boolean, default: false },
  isErrorProofingInteres: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model("PushToken", pushTokenSchema);