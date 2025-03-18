const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz", // References the Quiz model
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctOption: {
    type: Number, // Index of the correct option (0, 1, 2, or 3 for MCQs)
    required: true,
  },
  explanation: {
    type: String, // Explanation for the correct answer
    default: "",
  },
  marks: {
    type: Number, // Marks assigned for this question
    required: true,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);

module.exports = Question;
