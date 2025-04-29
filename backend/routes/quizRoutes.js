const express = require("express");
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuestionsForQuiz,
} = require("../controllers/quizController");

const router = express.Router();

// Step 1: Create a new quiz
router.post("/", createQuiz);

// Step 2: Fetch all quizzes
router.get("/", getAllQuizzes);

// Step 3: Fetch a specific quiz by ID
router.get("/:id", getQuizById);

// Step 4: Update quiz details
router.put("/:id", updateQuiz);

// Step 5: Delete a quiz
router.delete("/:id", deleteQuiz);

// Step 6: Fetch questions for a specific quiz
router.get("/:id/questions", getQuestionsForQuiz);

module.exports = router;
