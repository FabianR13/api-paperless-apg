const mongoose = require('mongoose')

const kaizenSchema = new mongoose.Schema(
  {
    idKaizen: {
      type: String
    },
    kaizenName: {
      type: String,
      required: true,
    },
    createdBy: [
      {
        ref: "Employees",
        type: mongoose.Schema.Types.ObjectId,
      },

    ],
    modifiedBy: [
      {
        ref: "Employees",
        type: mongoose.Schema.Types.ObjectId,
      },

    ],
    teamKaizen: {
      type: String,
    },
    area: [
      {
        ref: "Department",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    createdDate: {
      type: Date,
      required: true,
    },
    implementDate: {
      type: Date,
    },
    takenPlant: {
      type: String,
    },
    implementArea: {
      type: String,
    },
    implementationCost: {
      type: Number,
    },
    savedMoney: {
      type: Number,
    },
    savedSpace: {
      type: Number,
    },
    savingsUnmeasured: [{
      type: String,
    }],
    beforeKaizen: {
      type: String,
    },
    kaizenImagesB: [{ img: { type: String } }],
    afterKaizen: {
      type: String,
    },
    kaizenImagesA: [{ img: { type: String } }],
    status: {
      type: String,
    },
    montlyRank: {
      type: String,
    },
    observations: {
      type: String,
    },
    consecutive: {
      type: Number,
    },
    company: [
      {
        ref: "Company",
        type: mongoose.Schema.Types.ObjectId,
      }
    ],
    version: {
      type: Number,
    },
    rpnBefore: {
      type: Number,
      default: 0
    },
    rpnAfter: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Kaizen", kaizenSchema);