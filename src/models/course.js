const { Schema, model } = require("mongoose");

const phaseSchema = new Schema({
    order: Number,
    title: String,
    type: { type: String, enum: ['MEDIA', 'QUIZ'], required: true },
    // Si es MEDIA (Video/Imagen)
    mediaUrl: String,
    textContent: String,
    // Si es QUIZ
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' }
});

const courseSchema = new Schema({
    title: String,
    category: String,
    phases: [phaseSchema],

    // CAMPO OBLIGATORIO PARA PUBLICAR
    finalExamId: { type: Schema.Types.ObjectId, ref: 'Quiz' },

    createdByDiscordId: String,
    isActive: { type: Boolean, default: false },
    version: { type: Number, default: 1 }, // Control de versión (v1, v2...)
    isObsolete: { type: Boolean, default: false }, // Para ocultar versiones viejas
    isDisabled: { type: Boolean, default: false }, // Para que el Enroller lo bloquee/rechace
    originalCourseId: { type: Schema.Types.ObjectId, ref: 'Course' }
}, { timestamps: true });

module.exports = model("Course", courseSchema);