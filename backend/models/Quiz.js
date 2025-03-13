const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
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
    type: Number, // Time in minutes
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
