const mongoose = require('mongoose');

const kaizenSchema = new mongoose.Schema({
  kaizenName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  area: {
    type: String
  },
  implementArea: {
    type: String
  },
  implementDate: {
    type: Date
  },
  takenPlant: {
    type: String
  },
  teamKaizen: {
    type: String
  },
  money: {
    type: String
  },
  space: {
    type: String
  },
  security: {
    type: String
  },
  ergonomy: {
    type: String
  },
  fiveS: {
    type: String
  },
  environment: {
    type: String
  },
  process: {
    type: String
  },
  motivation: {
    type: String
  },
  other: {
    type: String
  },
  beforeKaizen: {
    type: String
  },
  afterKaizen: {
    type: String
  },
  status: {
    type: String
  },
  montlyRank: {
    type: String
  },
  observations: {
    type: String
  },
  lastModifyBy: {
    type: String
  },
  consecutive: {
    type: Number
  },
  implementationCost: {
    type: Number
  },
  company: [{
    ref: "Company",
    type: mongoose.Schema.Types.ObjectId
  }],
  version: {
    type: Number
  },
  kaizenImagesB: [{
    img: {
      type: String
    }
  }],
  kaizenImagesA: [{
    img: {
      type: String
    }
  }]
}, {
  timestamps: true
});
module.exports = mongoose.model("Kaizen", kaizenSchema);