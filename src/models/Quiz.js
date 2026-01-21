const { Schema, model } = require("mongoose");

const questionSchema = new Schema({
    text: { type: String, required: true }, // "Cuanto es 2+2?"
    options: [{ type: String, required: true }], // ["3", "4", "5"]
    correctIndex: { type: Number, required: true } // 1 (Indice del array options)
});

const quizSchema = new Schema({
    title: String,
    type: { type: String, enum: ['QUIZ', 'FINAL_EXAM'], default: 'QUIZ' },
    questions: [questionSchema],
    createdByDiscordId: String,
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' }
}, { timestamps: true });

module.exports = model("Quiz", quizSchema);