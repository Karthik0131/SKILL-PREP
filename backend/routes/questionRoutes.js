const express = require("express");
const {
  createQuestion,
  getQuestionById,
  getQuestionsByQuizId,
  updateQuestion,
  deleteQuestion,
  deleteQuestionsByQuizId,
} = require("../controllers/questionController");

const router = express.Router();

// 🟢 Create a new question (Requires quizId)
router.post("/", createQuestion);

// 🔵 Get a specific question by ID
router.get("/:id", getQuestionById);

// 🟡 Get all questions for a quiz using query parameter (?quizId=xyz)
router.get("/", getQuestionsByQuizId);

// 🟣 Update a question
router.put("/:id", updateQuestion);

// 🔴 Delete a single question
router.delete("/:id", deleteQuestion);

// ⚫ Delete all questions for a specific quiz using query parameter (?quizId=xyz)
router.delete("/", deleteQuestionsByQuizId);

module.exports = router;
