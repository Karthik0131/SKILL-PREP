import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";

export default function EditQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  // State for form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    minScore: "",
    maxScore: "",
    recommendation: "",
    resourceLink: "",
  });
  const [error, setError] = useState("");

  // Fetch quiz data on component mount
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${quizId}`);
        const quiz = response.data;

        setTitle(quiz.title);
        setCategory(quiz.category);
        setSubcategory(quiz.subcategory || "");
        setTimeLimit(quiz.timeLimit);
        setResources(quiz.resources || []);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz details.");
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Handle adding a new resource
  const handleAddResource = () => {
    if (
      !newResource.minScore ||
      !newResource.maxScore ||
      !newResource.recommendation ||
      !newResource.resourceLink
    ) {
      return alert("Please fill all resource fields before adding.");
    }
    setResources([...resources, newResource]);
    setNewResource({
      minScore: "",
      maxScore: "",
      recommendation: "",
      resourceLink: "",
    });
  };

  // ✅ Subcategory management
  const [customSubcategories, setCustomSubcategories] = useState({
    Coding: ["Data Structures", "Algorithms", "DBMS"],
    Aptitude: ["Quantitative", "Logical Reasoning"],
    Verbal: ["Grammar", "Comprehension"],
  });
  const [newSubcategory, setNewSubcategory] = useState("");

  // ✅ Handle adding new subcategory
  const handleAddSubcategory = () => {
    if (!newSubcategory.trim()) return;
    setCustomSubcategories((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), newSubcategory],
    }));
    setNewSubcategory("");
  };

  // Handle deleting a resource
  const handleDeleteResource = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  // Handle form submission (Update Quiz)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/quizzes/${quizId}`, {
        title,
        category,
        subcategory,
        timeLimit,
        resources,
      });

      navigate("/quizzes"); // Redirect after successful update
    } catch (err) {
      console.error("Error updating quiz:", err);
      setError("Failed to update quiz.");
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Edit Quiz</h1>

        {error && <p className="text-red-500">{error}</p>}

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
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Coding">Coding</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Verbal">Verbal</option>
            </select>
          </div>

          {/* Subcategory (Dropdown + Add Option) */}
          {category && (
            <div>
              <label className="block text-gray-700">
                Subcategory (Optional)
              </label>
              <select
                className="w-full p-2 border rounded"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              >
                <option value="">None</option>
                {customSubcategories[category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>

              {/* Manual Subcategory Input */}
              <div className="flex items-center mt-2 space-x-2">
                <input
                  type="text"
                  placeholder="New Subcategory"
                  className="w-full p-2 border rounded"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-green-600 text-white px-3 py-2 rounded"
                  onClick={handleAddSubcategory}
                >
                  ➕
                </button>
              </div>
            </div>
          )}

          {/* Time Limit */}
          <div>
            <label className="block text-gray-700">Time Limit (Minutes)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              required
            />
          </div>

          {/* Study Resources */}
          <div>
            <label className="block text-gray-700">
              Study Resources (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                className="w-1/4 p-2 border rounded"
                placeholder="Min Score"
                value={newResource.minScore}
                onChange={(e) =>
                  setNewResource({ ...newResource, minScore: e.target.value })
                }
              />
              <input
                type="number"
                className="w-1/4 p-2 border rounded"
                placeholder="Max Score"
                value={newResource.maxScore}
                onChange={(e) =>
                  setNewResource({ ...newResource, maxScore: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Recommendation"
                value={newResource.recommendation}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    recommendation: e.target.value,
                  })
                }
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Resource Link"
                value={newResource.resourceLink}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    resourceLink: e.target.value,
                  })
                }
              />
              <button
                type="button"
                className="bg-green-500 text-white px-3 py-2 rounded"
                onClick={handleAddResource}
              >
                ➕
              </button>
            </div>

            {/* Show Added Resources */}
            {resources.length > 0 && (
              <ul className="border p-3 rounded bg-gray-50">
                {resources.map((res, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 border rounded bg-white shadow-sm"
                  >
                    <div>
                      <b>Score:</b> {res.minScore} - {res.maxScore} |
                      <b> Recommendation:</b> {res.recommendation} |
                      <a
                        href={res.resourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        Resource Link
                      </a>
                    </div>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded ml-3"
                      onClick={() => handleDeleteResource(index)}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => navigate("/quizzes")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
