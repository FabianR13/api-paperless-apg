const mongoose = require('mongoose')

const faqSchema = new mongoose.Schema(
    {
        category: [
            {
                ref: "Dashboard",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        subCategory: [
            {
                ref: "Forms",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        title: {
            type: String,
        },
        subtitle: {
            type: String,
        },
        createdBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        modifiedBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        steps: [{
            type: String
        }],
        images: [{ img: { type: String } }],
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

module.exports = mongoose.model("FAQ", faqSchema);





