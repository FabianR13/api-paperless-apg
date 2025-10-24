const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
  minuta: [{
    ref: "Minuta",
    type: mongoose.Schema.Types.ObjectId
  }],
  item: {
    type: Number
  },
  task: {
    type: String
  },
  priority: {
    type: String
  },
  status: {
    type: String
  },
  owner: [{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  }],
  createdBy: [{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  }],
  updatedBy: [{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  }],
  startDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  originalDueDate: {
    type: Date
  },
  realDate: {
    type: Date
  },
  expired: {
    type: String
  },
  complete: {
    type: Number
  },
  notes: {
    type: String
  },
  version: {
    type: Number
  },
  company: [{
    ref: "Company",
    type: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true
});
module.exports = mongoose.model("Tasks", tasksSchema);