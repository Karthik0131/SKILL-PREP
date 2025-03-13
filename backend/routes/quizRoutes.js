const express = require("express");
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  getQuizWithQuestions,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

const router = express.Router();

// 🟢 Create a Quiz
router.post("/", createQuiz);

// 🔵 Get All Quizzes
router.get("/", getAllQuizzes);

// 🟡 Get a Single Quiz (Without Questions)
router.get("/:id", getQuizById);

// 🟠 Get a Quiz with Questions (Populated)
router.get("/:id/full", getQuizWithQuestions);

// 🟣 Update a Quiz
router.put("/:id", updateQuiz);

// 🔴 Delete a Quiz (and its questions)
router.delete("/:id", deleteQuiz);

module.exports = router;
