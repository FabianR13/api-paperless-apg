const mongoose = require('mongoose')

const laptopsSchema = new mongoose.Schema(
    {
        laptopName: {
            type: String,
        },
        responsible: [
            {
                ref: "Employees",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        responsibleAlt: {
            type: String,
        },
        responsibleGroup: [
            {
                ref: "GenericAccount",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        modifiedBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        modified: {
            type: Boolean,
        },
        location: {
            type: String,
        },
        monitor: {
            type: String,
        },
        ram: {
            type: String,
        },
        osName: {
            type: String,
        },
        model: {
            type: String,
        },
        system: {
            type: String,
        },
        processor: {
            type: String,
        },
        serialNo: {
            type: String,
        },
        macAddress: {
            type: String,
        },
        initialCost: {
            type: Number,
        },
        purchaseDate: {
            type: Date,
        },
        status: {
            type: String,
        },
        responsibeLetter: {
            type: String
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

module.exports = mongoose.model("Laptops", laptopsSchema);





