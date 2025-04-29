import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Register required Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CategoryPerformanceChart({ categoryStats }) {
  if (!categoryStats || Object.keys(categoryStats).length === 0) {
    return <p className="text-gray-500 text-center">No quizzes created yet.</p>;
  }

  // Extracting category names and total attempts
  const categories = Object.keys(categoryStats).filter(
    (category) => typeof categoryStats[category] === "object"
  );
  const attempts = categories.map(
    (category) => categoryStats[category].totalAttempts || 0
  );

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Total Attempts",
        data: attempts,
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
        barThickness: 30, // ✅ Controls the bar width (thinner bars)
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        type: "category",
        title: { display: true, text: "Categories" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // ✅ Ensures whole numbers (0, 1, 2, 3...) instead of decimals
          precision: 0, // ✅ Removes unnecessary decimal points
        },
        title: { display: true, text: "Total Attempts" },
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Category Performance
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}
