const mongoose = require('mongoose')

const positionSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    department: {
      ref: "Department",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Position", positionSchema);