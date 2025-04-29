import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // Icons for Edit & Delete
import Layout from "../../components/Layout";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]); // Store quizzes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all quizzes & calculate total marks
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/quizzes");
        console.log(response);

        // // Fetch total marks for each quiz
        const quizzesWithMarks = await Promise.all(
          response.data.map(async (quiz) => {
            const questionsRes = await axios.get(
              `http://localhost:5000/api/quizzes/${quiz._id}/questions`
            );
            const totalMarks = questionsRes.data.totalMarks;
            return { ...quiz, totalMarks };
          })
        );

        setQuizzes(quizzesWithMarks);
      } catch (err) {
        setError("Failed to fetch quizzes");
      }
      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  // ✅ Handle deleting a quiz
  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${quizId}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setError("Failed to delete quiz");
    }
  };
  console.log(quizzes);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Manage Quizzes</h1>

        {/* Show error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Add Quiz Button (Redirects to CreateQuiz page) */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
          onClick={() => navigate("/create-quiz")}
        >
          ➕ Add Quiz
        </button>

        {/* Display quizzes */}
        {loading ? (
          <p className="text-gray-500">Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-gray-500">No quizzes added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="p-4 border rounded-lg shadow bg-white relative"
              >
                {/* Top-right Edit & Delete Icons */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button onClick={() => navigate(`/edit-quiz/${quiz._id}`)}>
                    <FaEdit className="text-yellow-500 hover:text-yellow-600 text-lg" />
                  </button>
                  <button onClick={() => handleDeleteQuiz(quiz._id)}>
                    <FaTrash className="text-red-500 hover:text-red-600 text-lg" />
                  </button>
                </div>

                {/* Quiz Details */}
                <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                <p className="text-gray-600">
                  <strong>Category:</strong> {quiz.category}
                </p>
                {quiz.subcategory && (
                  <p className="text-gray-500">
                    <strong>Subcategory:</strong> {quiz.subcategory}
                  </p>
                )}
                {quiz.timeLimit && (
                  <p className="text-gray-500">
                    <strong>Time Limit:</strong> {quiz.timeLimit} min
                  </p>
                )}
                <p className="text-gray-500">
                  <strong>Total Marks:</strong> {quiz.totalMarks}
                </p>

                {/* Buttons: Manage Questions & Analysis */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded flex-1"
                    onClick={() => navigate(`/manage-questions/${quiz._id}`)}
                  >
                    Manage Questions
                  </button>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded flex-1"
                    onClick={() => navigate(`/analysis/${quiz._id}`)}
                  >
                    📊 Quiz Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
