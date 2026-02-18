const mongoose = require('mongoose')

const formsSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    back: String,
    path: String,
    pos: Number,
    dashboard: [
      {
        ref: "Dashboard",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Forms", formsSchema);
