const Student = require("../models/Student");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const axios = require("axios");
const mongoose = require("mongoose");

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

    // Create a deep copy of student document to manipulate
    const studentData = JSON.parse(JSON.stringify(student));

    // Fetch total marks for each quiz attempt
    if (studentData.quizAttempts && studentData.quizAttempts.length > 0) {
      await Promise.all(
        studentData.quizAttempts.map(async (attempt, index) => {
          if (!attempt.quizId || !attempt.quizId._id) return;

          const quizId = attempt.quizId._id;
          let totalMarks = 0;

          try {
            const response = await axios.get(
              `http://localhost:5000/api/quizzes/${quizId}/questions`
            );
            totalMarks = response.data.totalMarks || 0;
          } catch (error) {
            console.error(
              `Error fetching total marks for quiz ${quizId}:`,
              error
            );
          }

          studentData.quizAttempts[index].totalMarks = totalMarks;
        })
      );
    }

    res.status(200).json(studentData);
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

      // Check if student answered correctly
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

      if (percentage < 50) {
        updatedWeakAreas.set(key, percentage); // Add to weak areas
        updatedStrongAreas.delete(key); // Ensure it’s removed from strong areas
      } else if (percentage > 51) {
        updatedStrongAreas.set(key, percentage); // Add to strong areas
        updatedWeakAreas.delete(key); // Ensure it’s removed from weak areas
      }
    }

    // Save the updated weak and strong areas
    student.performance.weakAreas = updatedWeakAreas;
    student.performance.strongAreas = updatedStrongAreas;

    // ✅ **Add Personalized Study Resources (Ensuring One Resource Per Quiz)**
    const recommendedResources = quiz.resources
      .filter((res) => score >= res.minScore && score <= res.maxScore)
      .slice(0, 1); // Pick only **one** resource per quiz

    const newResource =
      recommendedResources.length > 0
        ? {
            quizId: quiz._id,
            category: quiz.category,
            subcategory: quiz.subcategory,
            resourceid: recommendedResources._id,
            recommendation: recommendedResources[0].recommendation,
            resourceLink: recommendedResources[0].resourceLink,
          }
        : null;

    if (newResource) {
      // Remove old resource (if any) from the same quiz
      student.personalizedResources = student.personalizedResources.filter(
        (res) => res.quizId.toString() !== quiz._id.toString()
      );

      // Add the new resource
      student.personalizedResources.push(newResource);
    }

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
      personalizedResources: student.personalizedResources, // ✅ Now returning updated resources
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

    // Fetch student with quiz attempts
    const student = await Student.findOne({ rollno }).populate(
      "quizAttempts.quizId"
    );
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Fetch total marks for each quiz
    const quizHistory = await Promise.all(
      student.quizAttempts.map(async (attempt) => {
        const quizId = attempt.quizId._id;
        let totalMarks = 0;

        try {
          // Fetch total marks from questions API
          const response = await axios.get(
            `http://localhost:5000/api/quizzes/${quizId}/questions`
          );
          totalMarks = response.data.totalMarks || 0; // Ensure default value
        } catch (error) {
          console.error(
            `Error fetching total marks for quiz ${quizId}:`,
            error
          );
        }

        return {
          quizId,
          title: attempt.quizId.title,
          category: attempt.quizId.category,
          subcategory: attempt.quizId.subcategory || "N/A",
          score: attempt.score,
          totalMarks, // ✅ Include total marks
          attemptedAt: attempt.attemptedAt,
          timeTaken: attempt.timeTaken,
          responses: attempt.responses,
        };
      })
    );

    res.status(200).json(quizHistory);
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 6️⃣ Get Study Recommendations Based on Latest Quiz Score
exports.getStudyRecommendations = async (req, res) => {
  try {
    const { rollno } = req.params;

    // Fetch student with quiz details
    const student = await Student.findOne({ rollno }).populate(
      "quizAttempts.quizId"
    );
    if (!student) return res.status(404).json({ message: "Student not found" });

    let recommendations = [];
    let latestAttempts = new Map(); // Stores the latest attempt per quiz

    // Find latest attempt per quiz
    student.quizAttempts.forEach((attempt) => {
      latestAttempts.set(attempt.quizId._id.toString(), attempt); // Stores the last (latest) attempt for each quiz
    });

    // Track quizzes to avoid duplicate recommendations
    let addedQuizzes = new Set();

    // Loop through latest quiz attempts & find matching resources
    latestAttempts.forEach((attempt, quizId) => {
      const quiz = attempt.quizId;
      if (!quiz || !quiz.resources) return;

      // Skip if a resource from this quiz has already been added
      if (addedQuizzes.has(quizId)) return;

      const matchingResource = quiz.resources.find(
        (resource) =>
          attempt.score >= resource.minScore &&
          attempt.score <= resource.maxScore
      );

      if (matchingResource) {
        // Check if this resource already exists in student's personalizedResources
        let existingResource = student.personalizedResources.find(
          (pr) =>
            pr.quizId &&
            pr.quizId.toString() === quiz._id.toString() &&
            pr.resourceLink === matchingResource.resourceLink
        );

        let resourceId;
        let isCompleted = false;

        if (existingResource) {
          // Use existing resource ID and completion status
          resourceId = existingResource._id;
          isCompleted = existingResource.isCompleted;
        } else {
          // Generate a new ID for this resource
          resourceId = new mongoose.Types.ObjectId();

          // Add to student's personalizedResources
          student.personalizedResources.push({
            _id: resourceId,
            quizId: quiz._id,
            category: quiz.category,
            subcategory: quiz.subcategory || null,
            recommendation: matchingResource.recommendation,
            resourceLink: matchingResource.resourceLink,
            isCompleted: false,
          });
        }

        recommendations.push({
          resourceId: resourceId, // Include the resource ID
          quizId: quiz._id,
          quizTitle: quiz.title,
          category: quiz.category,
          subcategory: quiz.subcategory || "N/A",
          score: attempt.score,
          isCompleted: isCompleted,
          recommendation: matchingResource.recommendation,
          resourceLink: matchingResource.resourceLink,
        });

        addedQuizzes.add(quizId); // Mark quiz as processed to prevent duplicates
      }
    });

    // Save the updated student document if new resources were added
    await student.save();

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching study recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// // update resources completion
// Controller function to update resource completion status
exports.updateResourceCompletion = async (req, res) => {
  try {
    const { rollNumber, resourceId } = req.params;
    const { isCompleted } = req.body;

    // Validate isCompleted is a boolean
    if (typeof isCompleted !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isCompleted must be a boolean value",
      });
    }

    // Find the student and update the specific resource's completion status
    const student = await Student.findOneAndUpdate(
      {
        rollno: rollNumber,
        "personalizedResources._id": resourceId,
      },
      {
        $set: { "personalizedResources.$.isCompleted": isCompleted },
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student or resource not found",
      });
    }

    // Find the updated resource to return in the response
    const updatedResource = student.personalizedResources.find(
      (resource) => resource._id.toString() === resourceId
    );

    return res.status(200).json({
      success: true,
      message: "Resource completion status updated successfully",
      data: updatedResource,
    });
  } catch (error) {
    console.error("Error updating resource completion status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
