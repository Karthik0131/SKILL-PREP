const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// Step 1: Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, category, subcategory, timeLimit, resources } = req.body;

    // Validate input
    if (!title || !category || !timeLimit) {
      return res
        .status(400)
        .json({ message: "Title, category, and time limit are required" });
    }

    const newQuiz = new Quiz({
      title,
      category,
      subcategory: subcategory || null,
      timeLimit,
      resources: resources || [],
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Step 2: Fetch all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Step 3: Fetch a specific quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Step 4: Update quiz details
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, subcategory, timeLimit, resources } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { title, category, subcategory, timeLimit, resources },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Step 5: Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all questions for a specific quiz
exports.getQuestionsForQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch quiz details along with questions
    const quiz = await Quiz.findById(id).select(
      "title category subcategory timeLimit"
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Find all questions linked to this quiz ID
    const questions = await Question.find({ quizId: id });

    if (!questions.length) {
      return res.status(200).json({
        quizDetails: quiz, // Send quiz details
        questions: [], // Return empty questions array instead of 404
        timeLimit: quiz.timeLimit,
      });
    }

    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

    res.status(200).json({
      quizDetails: quiz, // Send quiz title, category, and subcategory
      questions,
      totalMarks, // Optional: If needed in frontend
      timeLimit: quiz.timeLimit,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
