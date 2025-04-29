import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";

export default function ManageQuestions() {
  const { quizId } = useParams(); // Get quiz ID from URL
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]); // Default 4 options
  const [correctOption, setCorrectOption] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [marks, setMarks] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState(null);

  // Fetch all questions for the quiz
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);

        const quizRes = await axios.get(
          `http://localhost:5000/api/quizzes/${quizId}`
        );
        setQuizData(quizRes.data);

        const res = await axios.get(
          `http://localhost:5000/api/quizzes/${quizId}/questions`
        );

        if (Array.isArray(res.data.questions)) {
          setQuestions(res.data.questions); // ✅ Only update if it's an array
        } else {
          console.error("Invalid response format:", res.data);
          setQuestions([]); // ✅ Ensure it's always an array
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setQuestions([]); // ✅ Ensure fallback
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [quizId]);
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  // Handle adding a new question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionText || correctOption === null || options.includes("")) {
      setError("Please fill in all fields and select a correct option.");
      return;
    }

    const newQuestion = {
      quizId,
      questionText,
      options,
      correctOption,
      explanation,
      marks,
    };
    console.log(newQuestion);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/questions",
        newQuestion
      );
      console.log(res.data);
      setQuestions([...questions, res.data]);
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectOption(null);
      setExplanation("");
      setMarks(1);
      setError("");
    } catch (err) {
      console.error("Error adding question:", err);
      setError("Failed to add question.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a question
  const handleEditQuestion = (index) => {
    setEditIndex(index); // Set the question being edited
    setEditedQuestion({ ...questions[index] }); // Clone question data
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `/api/questions/${editedQuestion._id}`,
        editedQuestion
      );

      setQuestions((prevQuestions) =>
        prevQuestions.map((q, i) => (i === editIndex ? response.data : q))
      );

      setEditIndex(null); // Exit edit mode
      setEditedQuestion(null);
    } catch (err) {
      console.error("Error updating question:", err);
    }
  };

  // Handle deleting a question
  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`/api/questions/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        {quizData && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{quizData.title}</h1>
            <p className="text-gray-600">
              Category: <span className="font-medium">{quizData.category}</span>{" "}
              {quizData.subcategory && ` - ${quizData.subcategory}`}
            </p>
            <p className="text-gray-500">Total Marks: {totalMarks}</p>
          </div>
        )}

        {/* Add Question Form */}
        <form
          onSubmit={handleAddQuestion}
          className="space-y-4 p-4 border rounded-lg shadow-sm bg-gray-100"
        >
          <h2 className="text-xl font-semibold">Add a New Question</h2>

          {/* Question Input */}
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Enter question text..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />

          {/* Options Input */}
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...options];
                  updatedOptions[index] = e.target.value;
                  setOptions(updatedOptions);
                }}
                required
              />
              <input
                type="radio"
                name="correctOption"
                checked={correctOption === index}
                onChange={() => setCorrectOption(index)}
              />
            </div>
          ))}

          {/* Explanation */}
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Explanation (optional)"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />

          {/* Marks Input */}
          <div className="mt-2">
            <label className="block text-gray-700 font-medium">
              Marks for this Question
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded mt-1"
              min="1"
              max="10"
              placeholder="Enter marks (e.g., 1-10)"
              value={marks === 0 ? "" : marks} // Show empty if it's 0 to avoid confusion
              onChange={(e) => setMarks(Number(e.target.value))}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Adding..." : "➕ Add Question"}
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </form>

        {/* Questions List */}
        <h2 className="text-xl font-semibold mt-6">Existing Questions</h2>
        <div className="space-y-4 mt-4">
          {questions.length === 0 ? (
            <p className="text-gray-500">No questions added yet.</p>
          ) : (
            questions.map((question, index) => (
              <div
                key={question._id}
                className="p-4 border rounded shadow bg-white"
              >
                {editIndex === index ? (
                  // Edit Mode (Show Input Fields)
                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mb-2"
                      value={editedQuestion.questionText}
                      onChange={(e) =>
                        setEditedQuestion({
                          ...editedQuestion,
                          questionText: e.target.value,
                        })
                      }
                    />

                    {/* Options */}
                    {editedQuestion.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={option}
                          onChange={(e) => {
                            const updatedOptions = [...editedQuestion.options];
                            updatedOptions[optIndex] = e.target.value;
                            setEditedQuestion({
                              ...editedQuestion,
                              options: updatedOptions,
                            });
                          }}
                        />
                        <input
                          type="radio"
                          name="correctOption"
                          checked={editedQuestion.correctOption === optIndex}
                          onChange={() =>
                            setEditedQuestion({
                              ...editedQuestion,
                              correctOption: optIndex,
                            })
                          }
                        />
                      </div>
                    ))}

                    {/* Marks Input */}
                    <input
                      type="number"
                      className="w-full p-2 border rounded mt-2"
                      value={editedQuestion.marks}
                      onChange={(e) =>
                        setEditedQuestion({
                          ...editedQuestion,
                          marks: Number(e.target.value),
                        })
                      }
                    />

                    {/* Explanation Input */}
                    <textarea
                      className="w-full p-2 border rounded mt-2"
                      value={editedQuestion.explanation}
                      onChange={(e) =>
                        setEditedQuestion({
                          ...editedQuestion,
                          explanation: e.target.value,
                        })
                      }
                    />

                    {/* Save & Cancel Buttons */}
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal Display Mode
                  <div>
                    <p className="font-semibold">{question.questionText}</p>
                    <ul className="mt-2">
                      {question.options.map((option, optIndex) => (
                        <li
                          key={optIndex}
                          className={`p-2 border rounded ${
                            optIndex === question.correctOption
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">
                      Marks: {question.marks}
                    </p>
                    <p className="text-sm text-gray-600">
                      Explanation: {question.explanation}
                    </p>

                    {/* Edit & Delete Buttons */}
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => handleEditQuestion(index)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div>Total Marks : {totalMarks}</div>
        {/* Back to Quizzes Button */}
        <button
          onClick={() => navigate("/quizzes")}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
        >
          SAVE QUIZ ☑️
        </button>
      </div>
    </Layout>
  );
}
