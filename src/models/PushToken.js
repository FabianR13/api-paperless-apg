// models/PushToken.js
const mongoose = require("mongoose");

const pushTokenSchema = new mongoose.Schema({
  userId: { ref: "User", type: mongoose.Schema.Types.ObjectId, unique: true },
  token: { type: String, required: true, unique: true },
  isSupplier: { type: Boolean, default: false },
  isErrorProofingInteres: { type: Boolean, default: false },
  isCoordinator: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model("PushToken", pushTokenSchema);