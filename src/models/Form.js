const mongoose = require('mongoose')

const formSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,
    imgURL: String,
    description: String
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Form", formSchema);