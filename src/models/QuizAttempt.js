// src/models/QuizAttempt.js
const { Schema, model } = require("mongoose");

const quizAttemptSchema = new Schema({
    employeeDiscordId: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    type: { type: String, enum: ['QUIZ', 'FINAL_EXAM'], required: true },
    
    // Array con los índices de las respuestas que eligió el usuario
    answers: [{ type: Number }], 
    
    score: { type: Number, required: true }, // Ej: 80
    passed: { type: Boolean, required: true }, // true/false
    attemptDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = model("QuizAttempt", quizAttemptSchema);