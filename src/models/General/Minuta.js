const mongoose = require('mongoose')

const minutaSchema = new mongoose.Schema(
    {
        consecutive: {
            type: String,
        },
        theme: {
            type: String,
        },
        date: {
            type: Date,
        },
        asistentes:  [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        ausentes:  [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        lugar: {
            type: String,
        },
        nextMinuta:  [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        resumen: {
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

module.exports = mongoose.model("Minuta", minutaSchema);





