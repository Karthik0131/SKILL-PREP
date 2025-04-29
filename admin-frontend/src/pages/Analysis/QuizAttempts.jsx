import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizAttemptTable from "../../components/QuizAttemptTable";
import Layout from "../../components/Layout";

export default function QuizAttempts() {
  const [attemptsData, setAttemptsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/analysis/admin/attempts"
        );
        const data = await response.json();
        setAttemptsData(data.attempts);
      } catch (error) {
        console.error("Error fetching quiz attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">All Quiz Attempts</h1>

        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => navigate("/analysis")}
        >
          ⬅ Back to Dashboard
        </button>

        {loading ? (
          <p>Loading quiz attempts...</p>
        ) : attemptsData.length === 0 ? (
          <p>No quiz attempts found.</p>
        ) : (
          <QuizAttemptTable data={attemptsData} />
        )}
      </div>
    </Layout>
  );
}
