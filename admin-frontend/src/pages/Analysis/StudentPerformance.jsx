import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import Layout from "../../components/Layout";
import PerformanceTrendChart from "../../components/PerformanceTrendChart";

export default function StudentPerformance() {
  const { rollno } = useParams(); // Get student roll number from URL
  const navigate = useNavigate(); // ✅ Navigation Hook
  const [studentData, setStudentData] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentPerformance = async () => {
      try {
        // Fetch student performance details
        const res1 = await fetch(
          `http://localhost:5000/api/students/${rollno}/performance`
        );
        const data1 = await res1.json();

        // Fetch quiz history for trend chart
        const res2 = await fetch(
          `http://localhost:5000/api/analysis/admin/student/${rollno}`
        );
        const data2 = await res2.json();

        setStudentData(data1);
        setQuizHistory(data2.quizHistory || []);
      } catch (err) {
        setError("Failed to load student performance.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentPerformance();
  }, [rollno]);

  if (loading) return <p>Loading student performance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-6">
        {/* ✅ "Back to Attempts" Button */}
        <button
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          onClick={() => navigate("/analysis/attempts")}
        >
          🔙 Back to Attempts
        </button>

        <h1 className="text-2xl font-bold">Student Performance</h1>
        <p className="text-gray-600">Roll No: {rollno}</p>

        {/* Performance Trend Chart */}
        <div className="my-6">
          <PerformanceTrendChart rollno={rollno} />
        </div>

        {/* Weak & Strong Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Weak Areas</h2>
            {Object.keys(studentData.weakAreas).length === 0 ? (
              <p className="text-gray-500">No weak areas detected.</p>
            ) : (
              <ul className="list-disc list-inside text-red-600">
                {Object.entries(studentData.weakAreas).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value.toFixed(2)}%
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Strong Areas</h2>
            {Object.keys(studentData.strongAreas).length === 0 ? (
              <p className="text-gray-500">No strong areas detected.</p>
            ) : (
              <ul className="list-disc list-inside text-green-600">
                {Object.entries(studentData.strongAreas).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value.toFixed(2)}%
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quiz History Table */}
        <h2 className="text-xl font-semibold my-4">Quiz Attempt History</h2>
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Quiz</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Score</th>
                <th className="border p-2">Time Taken </th>
                <th className="border p-2">Attempted At</th>
              </tr>
            </thead>
            <tbody>
              {quizHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-4">
                    No quiz attempts found.
                  </td>
                </tr>
              ) : (
                quizHistory.map((quiz, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border p-2">{quiz.quizTitle}</td>
                    <td className="border p-2">
                      {quiz.category} - {quiz.subcategory}
                    </td>
                    <td className="border p-2">{quiz.score}</td>
                    <td className="border p-2">{quiz.timeTaken[0]}</td>
                    <td className="border p-2">
                      {new Date(quiz.attemptedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
