const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");

// 📌 4️⃣ Admin Dashboard: Get total quizzes, total attempts, average scores, most attempted quiz, etc.
router.get("/admin/summary", analysisController.getAdminSummary);

// 📌 5️⃣ Fetch all quiz attempts by students (used in the table view)
router.get("/admin/attempts", analysisController.getAllStudentAttempts);

// 📌 1️⃣ Stores a detailed quiz attempt (called from submitQuiz)
router.post("/:rollno/submit", analysisController.submitQuizAnalysis);




// 📌 6️⃣ Fetch all student performances for a specific quiz
router.get("/admin/quiz/:quizId", analysisController.getQuizPerformance);

// 📌 7️⃣ Fetch a student’s full quiz history & performance insights
router.get("/admin/student/:rollno", analysisController.getStudentFullAnalysis);

// 📌 2️⃣ Fetch student’s detailed analysis for a specific quiz
router.get("/:rollno/:quizId", analysisController.getQuizAnalysis);

// 📌 3️⃣ Fetch student’s overall quiz performance trends
router.get("/:rollno", analysisController.getStudentPerformance);
module.exports = router;
