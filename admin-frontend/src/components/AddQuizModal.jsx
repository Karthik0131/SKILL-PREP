import { useState, useEffect } from "react";

export default function AddQuizModal({ isOpen, onClose, onAddQuiz, quizToEdit }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [timeLimit, setTimeLimit] = useState(""); // New state for time limit
  const [customSubcategories, setCustomSubcategories] = useState({
    Coding: ["Data Structures", "Algorithms", "DBMS"],
    Aptitude: ["Quantitative", "Logical Reasoning"],
    Verbal: ["Grammar", "Comprehension"],
  });

  const [newSubcategory, setNewSubcategory] = useState(""); // Store custom subcategory input

  // Populate form when editing an existing quiz
  useEffect(() => {
    if (quizToEdit) {
      setTitle(quizToEdit.title);
      setCategory(quizToEdit.category);
      setSubcategory(quizToEdit.subcategory || "");
      setTimeLimit(quizToEdit.timeLimit || ""); // Set time limit if available
    }
  }, [quizToEdit]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Quiz being submitted:", quizToEdit); // Debugging
  
    const quizData = {
      _id: quizToEdit ? quizToEdit._id : undefined, // Use _id instead of id
      title,
      category,
      subcategory,
      timeLimit,
    };
  
    onAddQuiz(quizData);
    onClose();
  };

  // Handle adding a custom subcategory
  const handleAddSubcategory = () => {
    if (newSubcategory.trim() && category) {
      setCustomSubcategories((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), newSubcategory.trim()],
      }));
      setSubcategory(newSubcategory.trim()); // Set the newly added subcategory as selected
      setNewSubcategory(""); // Clear input field
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">{quizToEdit ? "Edit Quiz" : "Add New Quiz"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quiz Title */}
          <div>
            <label className="block text-gray-700">Quiz Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700">Category</label>
            <select
              className="w-full p-2 border rounded"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory(""); // Reset subcategory when changing category
              }}
              required
            >
              <option value="">Select Category</option>
              <option value="Coding">Coding</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Verbal">Verbal</option>
            </select>
          </div>

          {/* Subcategory */}
          {category && (
            <div>
              <label className="block text-gray-700">Subcategory</label>
              <select
                className="w-full p-2 border rounded"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              >
                <option value="">Select Subcategory</option>
                {(customSubcategories[category] || []).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Add Custom Subcategory */}
          {category && (
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Add new subcategory"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
              />
              <button
                type="button"
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={handleAddSubcategory}
              >
                ➕ Add
              </button>
            </div>
          )}

          {/* Time Limit */}
          <div>
            <label className="block text-gray-700">Time Limit (minutes)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="Enter time limit (e.g., 30)"
              min="1"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {quizToEdit ? "Save Changes" : "Add Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
