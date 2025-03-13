const Question = require("../models/question");
const mongoose = require("mongoose");
// 🟢 Create a new question (Requires quizId)
const createQuestion = async (req, res) => {
  try {
    const { quizId, questionText, options, correctOption, explanation } = req.body;

    if (!quizId || !questionText || !options || !correctOption) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newQuestion = new Question({
      quizId,
      questionText,
      options,
      correctOption,
      explanation,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error creating question", error: error.message });
  }
};

// 🔵 Get a specific question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question", error: error.message });
  }
};

// 🟡 Get all questions for a quiz using query parameter (?quizId=xyz)
const getQuestionsByQuizId = async (req, res) => {
  try {
    const { quizId } = req.query;
    if (!quizId) {
      return res.status(400).json({ message: "quizId query parameter is required." });
    }

    const questions = await Question.find({ quizId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
};

// 🟣 Update a question
const updateQuestion = async (req, res) => {
  try {
    const { questionText, options, correctOption, explanation } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { questionText, options, correctOption, explanation },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error updating question", error: error.message });
  }
};

// 🔴 Delete a single question
const deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error: error.message });
  }
};

// ⚫ Delete all questions for a specific quiz using query parameter (?quizId=xyz)
const deleteQuestionsByQuizId = async (req, res) => {
  try {
    const { quizId } = req.query;
    
    if (!quizId) {
      return res.status(400).json({ message: "quizId query parameter is required." });
    }

    // Convert quizId string to ObjectId
    const objectIdQuizId = new mongoose.Types.ObjectId(quizId);

    const result = await Question.deleteMany({ quizId: objectIdQuizId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No questions found for this quiz." });
    }

    res.json({ message: `${result.deletedCount} questions deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting questions", error: error.message });
  }
};

module.exports = {
  createQuestion,
  getQuestionById,
  getQuestionsByQuizId,
  updateQuestion,
  deleteQuestion,
  deleteQuestionsByQuizId,
};
