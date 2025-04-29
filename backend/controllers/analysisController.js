const Analysis = require("../models/Analysis");
const Student = require("../models/Student");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// 📌 1️⃣ Submit Quiz Analysis
exports.submitQuizAnalysis = async (req, res) => {
  try {
    const { rollno } = req.params;
    const { quizId, responses, score, timeTaken } = req.body;

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

    // Fetch all questions for the quiz
    const questions = await Question.find({ quizId });

    // Calculate category performance
    const categoryPerformance = {};

    // Loop through each question in the quiz
    questions.forEach((question) => {
      const category = quiz.category;
      const subcategory = quiz.subcategory || category;
      const key = `${category} - ${subcategory}`;

      if (!categoryPerformance[key])
        categoryPerformance[key] = { correct: 0, total: 0 };

      categoryPerformance[key].total += question.marks;

      const response = responses.find(
        (resp) => resp.questionId.toString() === question._id.toString()
      );
      if (response && response.isCorrect) {
        categoryPerformance[key].correct += question.marks;
      }
    });

    // 🚀 Fix: Convert to Percentage Before Saving
    const formattedCategoryPerformance = {};
    for (const key in categoryPerformance) {
      formattedCategoryPerformance[key] =
        (categoryPerformance[key].correct / categoryPerformance[key].total) *
        100; // ✅ Store only percentage
    }

    // Calculate improvement trend
    const previousAnalysis = await Analysis.findOne({ rollno, quizId });
    let improvementTrend = 0;
    let averageScore = score;

    if (previousAnalysis) {
      // Update previous scores
      const previousScores = [
        ...previousAnalysis.previousScores,
        { quizId, score },
      ];
      const totalScore = previousScores.reduce(
        (sum, attempt) => sum + attempt.score,
        0
      );
      averageScore = totalScore / previousScores.length;

      // Calculate improvement trend (difference from last attempt)
      improvementTrend = score - previousAnalysis.score;
    }

    // Store Analysis
    const newAnalysis = new Analysis({
      rollno,
      quizId,
      responses,
      score,
      timeTaken,
      previousScores: previousAnalysis
        ? [...previousAnalysis.previousScores, { quizId, score }]
        : [{ quizId, score }],
      averageScore,
      improvementTrend,
      categoryPerformance: formattedCategoryPerformance, // ✅ Fix applied
    });

    await newAnalysis.save();

    res.status(200).json({
      message: "Quiz analysis submitted successfully",
      analysis: newAnalysis,
    });
  } catch (error) {
    console.error("Error submitting quiz analysis:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Analysis for a specific rollno and quizId
exports.getQuizAnalysis = async (req, res) => {
  try {
    const { rollno, quizId } = req.params;

    // Fetch analysis data for the student and quiz
    const analysis = await Analysis.findOne({ rollno, quizId }).populate(
      "quizId"
    );

    if (!analysis) {
      return res
        .status(404)
        .json({ message: "Analysis not found for this quiz" });
    }

    res.status(200).json({
      quizTitle: analysis.quizId.title,
      category: analysis.quizId.category,
      subcategory: analysis.quizId.subcategory,
      score: analysis.score,
      timeTaken: analysis.timeTaken,
      improvementTrend: analysis.improvementTrend,
      categoryPerformance: analysis.categoryPerformance,
      responses: analysis.responses, // Question-wise details
    });
  } catch (error) {
    console.error("❌ Error fetching quiz analysis:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all analysis for a specific rollno
exports.getStudentPerformance = async (req, res) => {
  try {
    const { rollno } = req.params;

    // Fetch all analysis records for this student
    const analyses = await Analysis.find({ rollno }).populate("quizId");

    if (!analyses.length) {
      return res.status(404).json({ message: "No performance data found" });
    }

    // Calculate overall average score
    const totalScore = analyses.reduce(
      (sum, attempt) => sum + attempt.score,
      0
    );
    const averageScore = totalScore / analyses.length;

    // Calculate overall category performance
    // Calculate overall category performance
    const categoryPerformance = {};
    analyses.forEach((analysis) => {
      const categoryData = Object.fromEntries(analysis.categoryPerformance); // ✅ Convert Map to Object
      for (const category in categoryData) {
        if (!categoryPerformance[category]) {
          categoryPerformance[category] = { total: 0, count: 0 };
        }
        categoryPerformance[category].total += categoryData[category];
        categoryPerformance[category].count += 1;
      }
    });

    // Convert total category scores to percentages
    const formattedCategoryPerformance = {};
    for (const category in categoryPerformance) {
      formattedCategoryPerformance[category] =
        categoryPerformance[category].total /
        categoryPerformance[category].count;
    }

    res.status(200).json({
      rollno,
      totalAttempts: analyses.length,
      averageScore,
      categoryPerformance: formattedCategoryPerformance,
      quizHistory: analyses.map((analysis) => ({
        quizTitle: analysis.quizId.title,
        category: analysis.quizId.category,
        subcategory: analysis.quizId.subcategory,
        score: analysis.score,
        timeTaken: analysis.timeTaken,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching student performance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Get Admin Dashboard Summary
exports.getAdminSummary = async (req, res) => {
  try {
    // Count total quizzes
    const totalQuizzes = await Quiz.countDocuments();

    // Fetch all quiz attempts
    const allAttempts = await Analysis.find();

    // Count total quiz attempts
    const totalAttempts = allAttempts.length;

    // Calculate overall average score
    const totalScore = allAttempts.reduce(
      (sum, attempt) => sum + attempt.score,
      0
    );
    const averageScore =
      totalAttempts > 0 ? Number((totalScore / totalAttempts).toFixed(2)) : 0;

    // Find the most attempted quiz
    const quizAttemptCounts = {};
    allAttempts.forEach((attempt) => {
      const quizId = attempt.quizId.toString();
      quizAttemptCounts[quizId] = (quizAttemptCounts[quizId] || 0) + 1;
    });

    let mostAttemptedQuiz = { title: "No attempts yet", attempts: 0 };
    if (Object.keys(quizAttemptCounts).length > 0) {
      const mostAttemptedQuizId = Object.keys(quizAttemptCounts).reduce(
        (a, b) => (quizAttemptCounts[a] > quizAttemptCounts[b] ? a : b)
      );

      const mostAttemptedQuizData = await Quiz.findById(mostAttemptedQuizId);
      if (mostAttemptedQuizData) {
        mostAttemptedQuiz = {
          title: mostAttemptedQuizData.title,
          attempts: quizAttemptCounts[mostAttemptedQuizId],
        };
      }
    }

    res.status(200).json({
      totalQuizzes,
      totalAttempts,
      averageScore, // ✅ Fixed: Always a number
      mostAttemptedQuiz,
    });
  } catch (error) {
    console.error("❌ Error fetching admin summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// //get all student attempts
exports.getAllStudentAttempts = async (req, res) => {
  try {
    // Fetch all students with quiz attempts populated
    const students = await Student.find().populate("quizAttempts.quizId");

    // Format data for table view
    const attempts = [];
    students.forEach((student) => {
      student.quizAttempts.forEach((attempt) => {
        attempts.push({
          rollno: student.rollno,
          name: student.name,
          quizId: attempt.quizId._id,
          quizTitle: attempt.quizId?.title || "Unknown Quiz",
          category: attempt.quizId?.category || "N/A",
          subcategory: attempt.quizId?.subcategory || "N/A",
          score: attempt.score,
          responses: attempt.responses,
          timeTaken: attempt.timeTaken,
          attemptedAt: attempt.attemptedAt,
        });
      });
    });

    res.status(200).json({ totalAttempts: attempts.length, attempts });
  } catch (error) {
    console.error("❌ Error fetching student attempts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all students performance for a specific quiz
exports.getQuizPerformance = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Fetch all analysis records for the given quizId
    const analyses = await Analysis.find({ quizId }).populate("quizId");

    if (!analyses.length) {
      return res
        .status(404)
        .json({ message: "No performance data found for this quiz" });
    }

    // Fetch student details for each analysis record
    const studentRollNumbers = analyses.map((a) => a.rollno);
    const students = await Student.find({
      rollno: { $in: studentRollNumbers },
    });

    // Convert to a map for quick access
    const studentMap = {};
    students.forEach((student) => {
      studentMap[student.rollno] = student.name;
    });

    // Format the response data
    const performanceData = analyses.map((analysis) => ({
      rollno: analysis.rollno,
      name: studentMap[analysis.rollno] || "Unknown",
      score: analysis.score,
      timeTaken: analysis.timeTaken,
      categoryPerformance: Object.fromEntries(analysis.categoryPerformance),
      attemptedAt: analysis.createdAt,
    }));

    res.status(200).json({
      quizTitle: analyses[0].quizId.title,
      category: analyses[0].quizId.category,
      subcategory: analyses[0].quizId.subcategory,
      totalAttempts: analyses.length,
      performanceData,
    });
  } catch (error) {
    console.error("❌ Error fetching quiz performance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get full analysis for a student
exports.getStudentFullAnalysis = async (req, res) => {
  try {
    const { rollno } = req.params;

    // Fetch all analysis records for the given student roll number
    const analyses = await Analysis.find({ rollno }).populate("quizId");

    if (!analyses.length) {
      return res
        .status(404)
        .json({ message: "No analysis data found for this student" });
    }

    // Calculate overall category performance
    const categoryPerformance = {};
    analyses.forEach((analysis) => {
      const categoryData = Object.fromEntries(analysis.categoryPerformance); // Convert Mongoose Map to Object
      for (const category in categoryData) {
        if (!categoryPerformance[category]) {
          categoryPerformance[category] = { total: 0, count: 0 };
        }
        categoryPerformance[category].total += categoryData[category];
        categoryPerformance[category].count += 1;
      }
    });

    // Convert total category scores to percentages
    const formattedCategoryPerformance = {};
    for (const category in categoryPerformance) {
      formattedCategoryPerformance[category] =
        categoryPerformance[category].total /
        categoryPerformance[category].count;
    }

    res.status(200).json({
      rollno,
      totalAttempts: analyses.length,
      averageScore:
        analyses.reduce((sum, attempt) => sum + attempt.score, 0) /
        analyses.length,
      categoryPerformance: formattedCategoryPerformance,
      quizHistory: analyses.map((analysis) => ({
        quizTitle: analysis.quizId.title,
        category: analysis.quizId.category,
        subcategory: analysis.quizId.subcategory,
        score: analysis.score,
        timeTaken: analysis.timeTaken,
        attemptedAt: analysis.createdAt,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching student analysis:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get category wise Stats
exports.getCategoryWiseStats = async (req, res) => {
  try {
    // Fetch all quizzes and analysis records
    const allAnalyses = await Analysis.find().populate("quizId");
    const allQuizzes = await Quiz.find();

    // Initialize stats object
    const categoryStats = {};

    // Step 1: Add **all** categories & subcategories (even if no attempts)
    allQuizzes.forEach((quiz) => {
      const category = quiz.category;
      const subcategory = quiz.subcategory || "General";

      if (!categoryStats[category]) {
        categoryStats[category] = {
          totalAttempts: 0,
          totalScore: 0,
          highestScore: 0,
          lowestScore: Number.MAX_VALUE,
          totalTimeTaken: 0,
          subcategories: {},
        };
      }

      if (!categoryStats[category].subcategories[subcategory]) {
        categoryStats[category].subcategories[subcategory] = {
          totalAttempts: 0,
        };
      }
    });

    // Step 2: Process **only attempted** quizzes
    allAnalyses.forEach((analysis) => {
      const category = analysis.quizId.category;
      const subcategory = analysis.quizId.subcategory || "General";

      const categoryData = categoryStats[category];
      const subcategoryData = categoryData.subcategories[subcategory];

      categoryData.totalAttempts++;
      categoryData.totalScore += analysis.score;
      categoryData.highestScore = Math.max(
        categoryData.highestScore,
        analysis.score
      );
      categoryData.lowestScore = Math.min(
        categoryData.lowestScore,
        analysis.score
      );
      categoryData.totalTimeTaken += analysis.timeTaken.reduce(
        (a, b) => a + b,
        0
      );

      subcategoryData.totalAttempts++;
      subcategoryData.totalScore =
        (subcategoryData.totalScore || 0) + analysis.score;
      subcategoryData.highestScore = Math.max(
        subcategoryData.highestScore || 0,
        analysis.score
      );
      subcategoryData.lowestScore = Math.min(
        subcategoryData.lowestScore || Number.MAX_VALUE,
        analysis.score
      );
      subcategoryData.totalTimeTaken =
        (subcategoryData.totalTimeTaken || 0) +
        analysis.timeTaken.reduce((a, b) => a + b, 0);
    });

    // Step 3: Convert totals to averages & filter unnecessary fields
    for (const category in categoryStats) {
      const data = categoryStats[category];

      if (data.totalAttempts > 0) {
        data.averageScore = (data.totalScore / data.totalAttempts).toFixed(2);
        data.averageTimeTaken = (
          data.totalTimeTaken / data.totalAttempts
        ).toFixed(2);
        data.lowestScore =
          data.lowestScore === Number.MAX_VALUE ? 0 : data.lowestScore;
      } else {
        delete data.totalScore;
        delete data.highestScore;
        delete data.lowestScore;
        delete data.totalTimeTaken;
        delete data.averageScore;
        delete data.averageTimeTaken;
      }

      for (const subcategory in data.subcategories) {
        const subData = data.subcategories[subcategory];

        if (subData.totalAttempts === 0) {
          data.subcategories[subcategory] = {
            totalAttempts: 0,
            message: "No attempts yet",
          };
        } else {
          subData.averageScore = (
            subData.totalScore / subData.totalAttempts
          ).toFixed(2);
          subData.averageTimeTaken = (
            subData.totalTimeTaken / subData.totalAttempts
          ).toFixed(2);
          subData.lowestScore =
            subData.lowestScore === Number.MAX_VALUE ? 0 : subData.lowestScore;

          delete subData.totalScore;
          delete subData.totalTimeTaken;
        }
      }
    }

    // Step 4: Add **missing categories** (if no quizzes exist in that category)
    const allCategories = ["Coding", "Aptitude", "Verbal"];
    allCategories.forEach((category) => {
      if (!categoryStats[category]) {
        categoryStats[category] = "No quizzes created yet.";
      }
    });

    // Step 5: Calculate quiz completion rate
    const totalQuizzes = allQuizzes.length;
    const totalAttempts = allAnalyses.length;
    const quizCompletionRate = totalQuizzes
      ? ((totalAttempts / totalQuizzes) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      totalQuizzes,
      totalAttempts,
      quizCompletionRate,
      categoryStats,
    });
  } catch (error) {
    console.error("❌ Error fetching category stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
