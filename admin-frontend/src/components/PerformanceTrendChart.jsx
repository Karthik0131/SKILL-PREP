import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PerformanceTrendChart({ rollno }) {
  const [chartData, setChartData] = useState({
    Coding: null,
    Aptitude: null,
    Verbal: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/analysis/admin/student/${rollno}`
        );
        const data = await res.json();

        if (!data.quizHistory || data.quizHistory.length === 0) {
          setError("No performance data available.");
          return;
        }

        // **New Logic for X-Axis as Attempt Number**
        const categoryWiseScores = {
          Coding: [],
          Aptitude: [],
          Verbal: [],
        };

        let codingAttempt = 1,
          aptitudeAttempt = 1,
          verbalAttempt = 1;

        const attemptLabels = [];

        data.quizHistory.forEach((attempt) => {
          let attemptNumber = "";
          if (attempt.category === "Coding") {
            attemptNumber = ` ${codingAttempt++}`;
            categoryWiseScores.Coding.push(attempt.score);
          } else if (attempt.category === "Aptitude") {
            attemptNumber = ` ${aptitudeAttempt++}`;
            categoryWiseScores.Aptitude.push(attempt.score);
          } else if (attempt.category === "Verbal") {
            attemptNumber = ` ${verbalAttempt++}`;
            categoryWiseScores.Verbal.push(attempt.score);
          }
          attemptLabels.push(attemptNumber);
        });

        setChartData({
          Coding: {
            labels: attemptLabels.filter(
              (_, i) => categoryWiseScores.Coding[i] !== undefined
            ),
            datasets: [
              {
                label: "Coding Performance",
                data: categoryWiseScores.Coding,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.3,
              },
            ],
          },
          Aptitude: {
            labels: attemptLabels.filter(
              (_, i) => categoryWiseScores.Aptitude[i] !== undefined
            ),
            datasets: [
              {
                label: "Aptitude Performance",
                data: categoryWiseScores.Aptitude,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.3,
              },
            ],
          },
          Verbal: {
            labels: attemptLabels.filter(
              (_, i) => categoryWiseScores.Verbal[i] !== undefined
            ),
            datasets: [
              {
                label: "Verbal Performance",
                data: categoryWiseScores.Verbal,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                tension: 0.3,
              },
            ],
          },
        });
      } catch (err) {
        setError("Failed to load student performance.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [rollno]);

  if (loading) return <p>Loading performance charts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(chartData).map(([category, data]) => (
        <div key={category} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">{category} Performance</h2>
          <div className="w-full h-64">
            <Line
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { title: { display: true, text: "Attempts" } },
                  y: {
                    beginAtZero: true,
                    suggestedMax: 50, // Ensures better scaling for performance scores
                  },
                },
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
