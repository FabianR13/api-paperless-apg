const mongoose = require('mongoose')

const processEvaluationTemplateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        questions:{
            type:Array
        },
        answers:{
            type:Array
        },
        correctanswers:{
            type:Array
        },
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        version: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ProcessEvaluationsTemplate", processEvaluationTemplateSchema);





