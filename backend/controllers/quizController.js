const Quiz = require("../models/quiz");
const Question = require("../models/question");

// 🟢 Create a Quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, category, subcategory, timeLimit } = req.body;

    // Validate request body
    if (!title || !category || !timeLimit) {
      return res.status(400).json({ error: "Title, category, and time limit are required." });
    }

    // Create a new quiz
    const newQuiz = new Quiz({ title, category, subcategory, timeLimit });
    await newQuiz.save();

    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to create quiz", details: error.message });
  }
};

// 🔵 Get All Quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes", details: error.message });
  }
};

// 🟡 Get a Single Quiz (Without Questions)
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    console.log(id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz", details: error.message });
  }
};

// 🟠 Get a Quiz with Questions (Populated)
exports.getQuizWithQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
    
        if (!quiz) {
          return res.status(404).json({ message: "Quiz not found" });
        }
    
        // Fetch all questions related to this quiz
        const questions = await Question.find({ quizId: quiz._id });
    
        res.status(200).json({ ...quiz.toObject(), questions }); // Merge quiz and questions
      } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
      }
};

// 🟣 Update a Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params; // Get quiz ID from URL
    const { title, category, subcategory, timeLimit } = req.body; // Get new values

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { title, category, subcategory, timeLimit },
      { new: true, runValidators: true } // Ensure it returns updated object
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to update quiz", details: error.message });
  }
};

// 🔴 Delete a Quiz (and its questions)
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete all questions related to the quiz
    await Question.deleteMany({ id });

    // Delete the quiz
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz and associated questions deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete quiz", details: error.message });
  }
};
