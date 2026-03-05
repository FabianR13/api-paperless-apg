const mongoose = require('mongoose');
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
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },
        position: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Position",
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },
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
    }
);

module.exports = mongoose.model("Employees", employeesSchema);