const Student = require("../models/Student");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const axios = require("axios");

// 1️⃣ Register a new student
exports.registerStudent = async (req, res) => {
  try {
    const { rollno, name, email } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ rollno });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    // Create new student
    const newStudent = new Student({
      rollno,
      name,
      email,
    });

    await newStudent.save();
    res.status(201).json({
      message: "Student registered successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2️⃣ Get student details
exports.getStudentDetails = async (req, res) => {
  try {
    const { rollno } = req.params;
    const student = await Student.findOne({ rollno }).populate(
      "quizAttempts.quizId"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3️⃣ Submit Quiz Attempt

exports.submitQuiz = async (req, res) => {
  try {
    const { rollno } = req.params;
    const { quizId, responses, timeTaken } = req.body;

    // Validate input
    if (
      !quizId ||
      !responses ||
      !Array.isArray(responses) ||
      responses.length === 0
    ) {
      return res.status(400).json({ message: "Invalid quiz submission data" });
    }

    // Fetch student and quiz
    const student = await Student.findOne({ rollno });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Fetch all questions for this quiz
    const questions = await Question.find({ quizId });

    let score = 0;
    const updatedResponses = responses
      .map((resp) => {
        const question = questions.find(
          (q) => q._id.toString() === resp.questionId.toString()
        );
        if (!question) return null;

        const isCorrect = question.correctOption === resp.selectedOption;
        if (isCorrect) score += question.marks;

        return {
          questionId: question._id,
          selectedOption: resp.selectedOption,
          isCorrect,
        };
      })
      .filter(Boolean); // Remove null values

    // Update student's quiz attempts
    student.quizAttempts.push({
      quizId,
      score,
      timeTaken,
      responses: updatedResponses,
    });

    // Update Weak & Strong Areas
    const categoryScores = {};

    // Loop through each question in the quiz
    questions.forEach((question) => {
      const category = quiz.category;
      const subcategory = quiz.subcategory || category; // Use subcategory if available

      const key = `${category} - ${subcategory}`; // Create a unique key for tracking

      if (!categoryScores[key]) categoryScores[key] = { correct: 0, total: 0 };

      categoryScores[key].total += question.marks;

      // Check if student answered correctly (FIXED ObjectId Comparison)
      const response = updatedResponses.find(
        (resp) => resp.questionId.toString() === question._id.toString()
      );
      if (response && response.isCorrect) {
        categoryScores[key].correct += question.marks;
      }
    });

    // 🚀 Debug: Log category scores before updating weak areas
    console.log("Category Scores:", categoryScores);

    // Preserve existing weak & strong areas
    const previousWeakAreas = new Map(student.performance.weakAreas);
    const previousStrongAreas = new Map(student.performance.strongAreas);

    // New maps to store updated values
    const updatedWeakAreas = new Map(previousWeakAreas);
    const updatedStrongAreas = new Map(previousStrongAreas);

    // Update weak & strong areas based on scores
    for (const key in categoryScores) {
      const percentage =
        (categoryScores[key].correct / categoryScores[key].total) * 100;

      if (percentage < 40) {
        updatedWeakAreas.set(key, percentage); // Add to weak areas
        updatedStrongAreas.delete(key); // Ensure it’s removed from strong areas
      } else if (percentage > 80) {
        updatedStrongAreas.set(key, percentage); // Add to strong areas
        updatedWeakAreas.delete(key); // Ensure it’s removed from weak areas
      }
    }

    // Save the updated weak and strong areas
    student.performance.weakAreas = updatedWeakAreas;
    student.performance.strongAreas = updatedStrongAreas;

    // 🚀 Debug logs
    console.log("Updated Weak Areas:", student.performance.weakAreas);
    console.log("Updated Strong Areas:", student.performance.strongAreas);

    await student.save();
    // ✅ **CALL ANALYSIS API INTERNALLY**
    try {
      await axios.post(`http://localhost:5000/api/analysis/${rollno}/submit`, {
        quizId,
        responses: updatedResponses,
        score,
        timeTaken,
      });
      console.log("✅ Analysis Data Submitted Successfully");
    } catch (analysisError) {
      console.error(
        "❌ Error submitting analysis:",
        analysisError.response?.data || analysisError.message
      );
    }

    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      weakAreas: student.performance.weakAreas,
      strongAreas: student.performance.strongAreas,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 4️⃣ Get Student Performance (Weak & Strong Areas)
exports.getStudentPerformance = async (req, res) => {
  try {
    const { rollno } = req.params;

    // Fetch student
    const student = await Student.findOne({ rollno });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Extract performance details
    const performanceData = {
      weakAreas: Object.fromEntries(student.performance.weakAreas), // Convert Map to JSON
      strongAreas: Object.fromEntries(student.performance.strongAreas), // Convert Map to JSON
      totalAttempts: student.quizAttempts.length,
      lastAttempt:
        student.quizAttempts.length > 0
          ? student.quizAttempts[student.quizAttempts.length - 1]
          : null,
    };

    res.status(200).json(performanceData);
  } catch (error) {
    console.error("Error fetching student performance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 5️⃣ Get Student Quiz History
exports.getQuizHistory = async (req, res) => {
  try {
    const { rollno } = req.params;

    // Fetch student
    const student = await Student.findOne({ rollno }).populate(
      "quizAttempts.quizId"
    );
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Format response with quiz details
    const history = student.quizAttempts.map((attempt) => ({
      quizId: attempt.quizId._id,
      title: attempt.quizId.title,
      category: attempt.quizId.category,
      subcategory: attempt.quizId.subcategory || "N/A",
      score: attempt.score,
      attemptedAt: attempt.attemptedAt,
      timeTaken: attempt.timeTaken,
      responses: attempt.responses,
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 6️⃣ Get Study Recommendations Based on Latest Quiz Score
exports.getStudyRecommendations = async (req, res) => {
  try {
    const { rollno } = req.params;

    // Fetch student
    const student = await Student.findOne({ rollno }).populate(
      "quizAttempts.quizId"
    );
    if (!student) return res.status(404).json({ message: "Student not found" });

    let recommendations = [];
    let latestAttempts = new Map(); // Stores the latest attempt per quiz

    // Find latest attempt per quiz
    student.quizAttempts.forEach((attempt) => {
      latestAttempts.set(attempt.quizId._id.toString(), attempt); // Stores the latest attempt (as the last one in order)
    });

    // Loop through latest quiz attempts & find matching resources
    latestAttempts.forEach((attempt, quizId) => {
      const quiz = attempt.quizId;
      if (!quiz || !quiz.resources) return;

      const matchingResource = quiz.resources.find(
        (resource) =>
          attempt.score >= resource.minScore &&
          attempt.score <= resource.maxScore
      );

      if (matchingResource) {
        recommendations.push({
          quizTitle: quiz.title,
          category: quiz.category,
          subcategory: quiz.subcategory || "N/A",
          score: attempt.score,
          recommendation: matchingResource.recommendation,
          resourceLink: matchingResource.resourceLink,
        });
      }
    });

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching study recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
