const mongoose = require('mongoose')

const employeesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
        },
        numberEmployee: {
            type: String,
            required: true,
            unique: true,
        },
        department: [
            {
                ref: "Department",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        position: [
            {
                ref: "Position",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        active: {
            type: Boolean,
        },
        picture: {
            type: String
        },
        group: {
            type: String
        },
        visualWeakness: {
            type: String
        },
        user: {
            type: Boolean
        },
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
    }
);

module.exports = mongoose.model("Employees", employeesSchema);