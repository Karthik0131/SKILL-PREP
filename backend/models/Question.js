const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true, // Ensures each question belongs to a quiz
  },
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // Array of 4 options
    validate: {
      validator: function (arr) {
        return arr.length === 4; // Ensures exactly 4 options
      },
      message: "A question must have exactly 4 options.",
    },
    required: true,
  },
  correctOption: {
    type: String,
    required: true,
  },
  explanation: {
    type: String, // Optional field to explain the correct answer
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
