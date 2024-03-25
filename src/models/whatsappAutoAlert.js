const mongoose = require('mongoose')

const whatsappAutoAlertSchema = new mongoose.Schema(
  {
    createdBy: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    modifiedDate: {
      type: Date,
      required: true,
    },
    alertStatus: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    receivers: {
      type: Array,
      required: true,
    },
    notificationDays: {
      type: Array,
      required: true,
    },
    timeAlert: {
      type: Array,
      required: true,
    }
  }
);

module.exports = mongoose.model("whatsappAutoAlert", whatsappAutoAlertSchema);
