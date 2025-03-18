const Question = require("../models/Question");

// 1️⃣ Create a new question for a quiz
const createQuestion = async (req, res) => {
  try {
    const { quizId, questionText, options, correctOption, explanation, marks } = req.body;

    if (!quizId || !questionText || !options || correctOption === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const question = new Question({ quizId, questionText, options, correctOption, explanation, marks });
    await question.save();

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2️⃣ Bulk upload questions for a quiz
const createQuestionsBulk = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Invalid questions array" });
    }

    const createdQuestions = await Question.insertMany(questions);
    res.status(201).json({ message: "Questions added successfully", data: createdQuestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3️⃣ Fetch a specific question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4️⃣ Update a question by ID
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5️⃣ Delete a question by ID
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6️⃣ Delete all questions for a specific quiz
const deleteQuestionsByQuizId = async (req, res) => {
  try {
    const { quizId } = req.params;
    await Question.deleteMany({ quizId });

    res.json({ message: "All questions for the quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createQuestion,
  createQuestionsBulk,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  deleteQuestionsByQuizId,
};
