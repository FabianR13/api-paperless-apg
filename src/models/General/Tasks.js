const mongoose = require('mongoose')

const tasksSchema = new mongoose.Schema(
    {
        minuta: [
            {
                ref: "Minuta",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        item: {
            type: Number,
        },
        status: {
            type: String,
        },
        task: {
            type: Array,
        },
        updates: {
            type: Array,
        },
        who: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        when: {
            type: String,
        },
        version: {
            type: Number,
        },
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Tasks", tasksSchema);





