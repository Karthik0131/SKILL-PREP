import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import AddQuizModal from "../components/AddQuizModal";

export default function Quizzes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [quizzes, setQuizzes] = useState([]); // Store quizzes
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Store quiz for editing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all quizzes from backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/quizzes");
        setQuizzes(response.data);
      } catch (err) {
        setError("Failed to fetch quizzes");
      }
      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  // Open & close modals
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (quiz) => {
    setSelectedQuiz(quiz);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  // ✅ Handle adding a new quiz (POST request)
  const handleAddQuiz = async (newQuiz) => {
    try {
      const response = await axios.post("http://localhost:5000/api/quizzes", newQuiz);
      setQuizzes([...quizzes, response.data]);
      closeModal();
      navigate(`/manage-questions/${response.data._id}`);
    } catch (err) {
      console.error("Error adding quiz:", err);
      setError("Failed to add quiz");
    }
  };

  // ✅ Handle editing a quiz (PUT request)
  // const handleEditQuiz = async (updatedQuiz) => {
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:5000/api/quizzes/${updatedQuiz._id}`,
  //       updatedQuiz
  //     );
  //     setQuizzes(quizzes.map((quiz) => (quiz._id === updatedQuiz._id ? response.data : quiz)));
  //     closeEditModal();
  //   } catch (err) {
  //     console.error("Error editing quiz:", err);
  //     setError("Failed to edit quiz");
  //   }
  // };
  const handleEditQuiz = async (updatedQuiz) => {
    try {
      console.log("Updated Quiz Data:", updatedQuiz); // Debugging

    if (!updatedQuiz._id) {
      console.error("Error: Quiz ID is missing!"); // Ensure ID exists
      return;
    }

    const response = await axios.put(
      `http://localhost:5000/api/quizzes/${updatedQuiz._id}`, // ✅ Use _id
      updatedQuiz
    );

    console.log("Response from Backend:", response.data); // Debugging

    setQuizzes(quizzes.map((quiz) => (quiz._id === updatedQuiz._id ? response.data : quiz)));
    closeEditModal();
    } catch (err) {
      console.error("Error editing quiz:", err.response?.data || err.message);
    }
  };

  // ✅ Handle deleting a quiz (DELETE request)
  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${quizId}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setError("Failed to delete quiz");
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Manage Quizzes</h1>

        {/* Show error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Add Quiz Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={openModal}>
          ➕ Add Quiz
        </button>

        {/* Display quizzes */}
        {loading ? (
          <p className="text-gray-500">Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-gray-500">No quizzes added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="p-4 border rounded shadow">
                <h3 className="text-xl font-semibold">{quiz.title}</h3>
                <p className="text-gray-600">Category: {quiz.category}</p>
                {quiz.subcategory && <p className="text-gray-500">Subcategory: {quiz.subcategory}</p>}
                {quiz.timeLimit && <p className="text-gray-500">Time Limit: {quiz.timeLimit} min</p>}
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => navigate(`/manage-questions/${quiz._id}`)}
                  >
                    Manage Questions
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => openEditModal(quiz)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteQuiz(quiz._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Quiz Modal */}
        <AddQuizModal isOpen={isModalOpen} onClose={closeModal} onAddQuiz={handleAddQuiz} />

        {/* Edit Quiz Modal */}
        {isEditModalOpen && selectedQuiz && (
          <AddQuizModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onAddQuiz={handleEditQuiz}
            quizToEdit={selectedQuiz}
          />
        )}
      </div>
    </Layout>
  );
}
