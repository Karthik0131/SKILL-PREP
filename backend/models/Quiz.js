const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Coding", "Aptitude", "Verbal"], // Main categories
    required: true,
  },
  subcategory: {
    type: String, // Optional subcategory (e.g., "Data Structures", "Probability", etc.)
    default: null,
  },
  timeLimit: {
    type: Number, // Time limit in minutes
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  resources: [
    {
      minScore: { type: Number, required: true }, // Minimum score range
      maxScore: { type: Number, required: true }, // Maximum score range
      recommendation: { type: String, required: true }, // Recommendation text
      resourceLink: { type: String, required: true }, // URL to the study material
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quiz", QuizSchema);
