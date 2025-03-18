const express = require("express");
const { 
  createQuestion, 
  createQuestionsBulk,
  getQuestionById, 
  updateQuestion, 
  deleteQuestion,
  deleteQuestionsByQuizId
} = require("../controllers/questionController");

const router = express.Router();

// 1️⃣ Create a new question for a quiz
router.post("/", createQuestion);

// 2️⃣ Bulk upload questions for a quiz
router.post("/bulk", createQuestionsBulk);

// 3️⃣ Fetch a specific question by ID
router.get("/:id", getQuestionById);

// 4️⃣ Update a question by ID
router.put("/:id", updateQuestion);

// 5️⃣ Delete a question by ID
router.delete("/:id", deleteQuestion);

// 6️⃣ Delete all questions for a specific quiz
router.delete("/quiz/:quizId", deleteQuestionsByQuizId);

module.exports = router;
