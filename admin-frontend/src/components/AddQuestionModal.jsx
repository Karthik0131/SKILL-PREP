import { useState, useEffect } from "react";

export default function AddQuestionModal({ isOpen, onClose, onAddQuestion }) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");

  useEffect(() => {
    if (isOpen) {
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectOption("");
    }
  }, [isOpen]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim() || !correctOption) {
      alert("Please fill in the question and select the correct answer.");
      return;
    }

    const newQuestion = { 
      id: Date.now().toString(), 
      questionText, 
      options, 
      correctOption 
    };

    onAddQuestion(newQuestion);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Question</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Question</label>
            <textarea
              className="w-full p-2 border rounded"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                <input
                  type="radio"
                  name="correctOption"
                  value={option}
                  checked={correctOption === option}
                  onChange={() => setCorrectOption(option)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
