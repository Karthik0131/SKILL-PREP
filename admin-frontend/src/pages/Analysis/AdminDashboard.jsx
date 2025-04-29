import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CategoryPerformanceChart from "../../components/CategoryPerformanceChart";
import Layout from "../../components/Layout";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/analysis/admin/stats"
        );
        setStats(response.data);
      } catch (err) {
        setError("Failed to load stats. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card title="Total Quizzes" value={stats.totalQuizzes} />
          <Card title="Total Attempts" value={stats.totalAttempts} />
          <Card
            title="Quiz Completion Rate"
            value={`${stats.quizCompletionRate}%`}
          />
        </div>

        {/* View All Attempts Button */}
        <div className="mt-6 mb-2">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
            onClick={() => navigate("/analysis/attempts")}
          >
            📜 View All Attempts
          </button>
        </div>

        {/* Category-Wise Insights */}
        <div className="bg-white p-6 shadow-md rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Category-Wise Performance
          </h2>

          {/* Ensure ALL categories (even with "No quizzes created yet.") are inside cards */}
          {Object.entries(stats.categoryStats).map(([category, data]) => (
            <div key={category} className="border p-4 rounded-md mb-4">
              <h3 className="text-lg font-bold text-blue-600">{category}</h3>

              {typeof data === "string" ? (
                <p className="text-gray-500">{data}</p> // Handle "No quizzes created yet."
              ) : (
                <>
                  <p>Total Attempts: {data.totalAttempts}</p>
                  <p>Highest Score: {data.highestScore}</p>
                  <p>Lowest Score: {data.lowestScore}</p>
                  <p>Average Score: {data.averageScore}</p>

                  {/* Subcategories */}
                  {data.subcategories &&
                    Object.keys(data.subcategories).length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-md font-semibold text-gray-700">
                          Quizzes
                        </h4>
                        <ul className="list-disc ml-5">
                          {Object.entries(data.subcategories).map(
                            ([sub, details]) => (
                              <li key={sub} className="text-gray-600">
                                {sub}:{" "}
                                {details.totalAttempts > 0
                                  ? `Attempts: ${details.totalAttempts}, Avg Score: ${details.averageScore}`
                                  : "No attempts yet"}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Category Performance Chart */}
        <CategoryPerformanceChart categoryStats={stats.categoryStats} />
      </div>
    </Layout>
  );
}

// Simple Card Component for Summary Stats
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg text-center">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
}
