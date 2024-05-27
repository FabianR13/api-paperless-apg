const mongoose = require('mongoose')

const encuestaComedorSchema = new mongoose.Schema(
    {
        encuestaDate: {
            type: Date,
        },
        qualification: {
            type: Number,
        },
        comments: {
            type: String,
        },
        consecutive: {
            type: Number,
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

module.exports = mongoose.model("EncuestaComedor", encuestaComedorSchema);





