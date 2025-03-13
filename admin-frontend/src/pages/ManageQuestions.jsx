import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import AddQuestionModal from "../components/AddQuestionModal";
import ManageQuestionModal from "../components/ManageQuestionsModal";

export default function ManageQuestions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quizDetails, setQuizDetails] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    // ✅ Fetch quiz details (title, category, subcategory)
    useEffect(() => {
      const fetchQuizDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/quizzes/${quizId}`);
          setQuizDetails(response.data);
        } catch (err) {
          console.error("Failed to fetch quiz details:", err);
          setError("Failed to fetch quiz details");
        }
      };
  
      fetchQuizDetails();
    }, [quizId]);

  // ✅ Fetch questions from backend when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/questions?quizId=${quizId}`);
        setQuestions(response.data);
      } catch (err) {
        setError("Failed to fetch questions");
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [quizId]);

  // Open Add Question Modal
  const openAddModal = () => {
    setSelectedQuestion(null);
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => setIsAddModalOpen(false);

  // Open Manage (Edit) Modal
  const openManageModal = (question) => {
    setSelectedQuestion({ ...question });
    setIsManageModalOpen(true);
  };
  const closeManageModal = () => setIsManageModalOpen(false);

  // ✅ Add new question via API (POST request)
  const handleAddQuestion = async (newQuestion) => {
    try {
      const response = await axios.post("http://localhost:5000/api/questions", {
        ...newQuestion,
        quizId, // Ensure question is linked to the correct quiz
      });
      setQuestions([...questions, response.data]); // Add to state
      closeAddModal();
    } catch (err) {
      console.error("Error adding question:", err);
      setError("Failed to add question");
    }
  };

  // ✅ Edit question via API (PUT request)
  const handleEditQuestion = async (updatedQuestion) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/questions/${updatedQuestion._id}`,
        updatedQuestion
      );
      setQuestions(questions.map((q) => (q._id === updatedQuestion._id ? response.data : q)));
      closeManageModal();
    } catch (err) {
      console.error("Error editing question:", err);
      setError("Failed to edit question");
    }
  };

  // ✅ Delete question via API (DELETE request)
  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/questions/${questionId}`);
      setQuestions(questions.filter((q) => q._id !== questionId));
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question");
    }
  };

  // ✅ Save quiz and redirect
  const handleSaveQuiz = () => {
    alert("Quiz saved successfully!");
    navigate("/quizzes");
  };

  return (
    <Layout>
    <div className="p-6">
      {/* Show Quiz Details */}
      {quizDetails ? (
        <div className="mb-6 p-4 border rounded bg-gray-100">
          <h1 className="text-3xl font-bold">{quizDetails.title}</h1>
          <p className="text-gray-700">Category: {quizDetails.category}</p>
          {quizDetails.subcategory && <p className="text-gray-600">Subcategory: {quizDetails.subcategory}</p>}
        </div>
      ) : (
        <p className="text-red-500">Loading quiz details...</p>
      )}

      {/* Show error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Add Question Button */}
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={openAddModal}>
        ➕ Add Question
      </button>

      {/* Display Questions */}
      {loading ? (
        <p className="text-gray-500">Loading questions...</p>
      ) : questions.length === 0 ? (
        <p className="text-gray-500">No questions added yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {questions.map((question) => (
            <div key={question._id} className="p-4 border rounded shadow">
              <p className="font-semibold">{question.questionText}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => openManageModal(question)}
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
          ))}
        </div>
      )}

      {/* Save Quiz Button */}
      <button className="bg-green-600 text-white px-4 py-2 rounded mt-4" onClick={handleSaveQuiz}>
        ✅ Save Quiz
      </button>

      {/* Modals */}
      <AddQuestionModal isOpen={isAddModalOpen} onClose={closeAddModal} onAddQuestion={handleAddQuestion} />
      {isManageModalOpen && selectedQuestion && (
        <ManageQuestionModal
          isOpen={isManageModalOpen}
          onClose={closeManageModal}
          question={selectedQuestion}
          onEditQuestion={handleEditQuestion}
        />
      )}
    </div>
  </Layout>
  );
}
