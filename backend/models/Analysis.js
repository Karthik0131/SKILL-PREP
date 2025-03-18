const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema({
  rollno: { type: String, ref: "Student", required: true }, // Reference to student (Unique Roll Number)
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },

  responses: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      selectedOption: { type: Number, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],

  score: { type: Number, required: true },
  previousScores: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
      }, // To track quiz-wise history
      score: { type: Number, required: true },
      attemptedAt: { type: Date, default: Date.now },
    },
  ],

  timeTaken: [{ type: Number, required: true }], // Array to track time variations
  averageScore: { type: Number, default: 0 }, // To track overall performance
  improvementTrend: { type: Number, default: 0 }, // Score difference from the last attempt

  categoryPerformance: {
    type: Map,
    of: Number, // Example: { "Coding": 75, "Aptitude": 60, "Verbal": 80 }
    default: {},
  },

  createdAt: { type: Date, default: Date.now },
});

const Analysis =
  mongoose.models.Analysis || mongoose.model("Analysis", AnalysisSchema);

module.exports = Analysis;
