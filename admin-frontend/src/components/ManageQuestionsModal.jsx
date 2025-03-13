import { useState, useEffect } from "react";
import axios from "axios";

export default function ManageQuestionModal({ isOpen, onClose, question, onEditQuestion }) {
  const [editedQuestion, setEditedQuestion] = useState(question || {});

  // Update state when modal opens with a new question
  useEffect(() => {
    if (question) {
      setEditedQuestion(question);
    }
  }, [question]);

  if (!isOpen) return null;

  // Handle question text change
  const handleQuestionChange = (e) => {
    setEditedQuestion({ ...editedQuestion, questionText: e.target.value });
  };

  // Handle option change
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: updatedOptions });
  };

  // Handle correct option selection
  const handleCorrectOptionChange = (value) => {
    setEditedQuestion({ ...editedQuestion, correctOption: value });
  };

  // Save changes (API call)
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/questions/${editedQuestion._id}`,
        editedQuestion
      );

      onEditQuestion(response.data);
      onClose();
    } catch (err) {
      console.error("Error updating question:", err);
      alert("Failed to update question.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[40rem]">
        <h2 className="text-2xl font-bold mb-4">Edit Question</h2>

        <div className="space-y-2">
          <label className="block text-gray-700">Question:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={editedQuestion.questionText || ""}
            onChange={handleQuestionChange}
          />

          <label className="block text-gray-700 mt-2">Options:</label>
          {editedQuestion.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <input
                type="radio"
                name="correctOption"
                checked={editedQuestion.correctOption === option}
                onChange={() => handleCorrectOptionChange(option)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
