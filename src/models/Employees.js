const mongoose = require('mongoose')
const { Schema, model } = mongoose;

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
        discordId: { type: String, unique: true, sparse: true },
        enrolledCourses: [{
            courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
            enrolledAt: { type: Date, default: Date.now },
            progress: { type: Number, default: 0 },
            status: { type: String, default: 'In Progress' },
            currentPhase: { type: Number, default: 0 },
            completedAt: { type: Date }
        }],
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
    }
);

module.exports = mongoose.model("Employees", employeesSchema);