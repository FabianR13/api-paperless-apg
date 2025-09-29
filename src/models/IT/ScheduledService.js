const mongoose = require('mongoose')

const scheduledServiceSchema = new mongoose.Schema(
    {
        selectedDate: {
            type: Date,
        },
        employee:
        {
            ref: "Employees",
            type: mongoose.Schema.Types.ObjectId,
        },
        company:
        {
            ref: "Company",
            type: mongoose.Schema.Types.ObjectId,
        },
        modifiedBy:
        {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        },
        serviceStatus: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ScheduledService", scheduledServiceSchema);





