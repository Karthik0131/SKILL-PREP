const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Register a new student
router.post("/register", studentController.registerStudent);

// Fetch student details
router.get("/:rollno", studentController.getStudentDetails);

// Submit a quiz (stores attempt, updates performance, and calls analysis API)
router.post("/:rollno/submit", studentController.submitQuiz);

// Get student performance (weak & strong areas)
router.get("/:rollno/performance", studentController.getStudentPerformance);

// Get all quiz attempts with scores, time, and responses
router.get("/:rollno/quiz-history", studentController.getQuizHistory);

// Fetch study resources based on **student's quiz score**
router.get("/:rollno/recommendations", studentController.getStudyRecommendations);

module.exports = router;
