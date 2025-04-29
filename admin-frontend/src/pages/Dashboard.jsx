import { UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import Layout from "../components/Layout";

// Assuming these would be populated with real data in your application
const mockRecentQuizzes = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    date: "April 25, 2025",
    participants: 42,
  },
  { id: 2, title: "React Hooks", date: "April 20, 2025", participants: 38 },
  {
    id: 3,
    title: "CSS Grid & Flexbox",
    date: "April 15, 2025",
    participants: 45,
  },
];

const mockStats = [
  {
    title: "Total Students",
    value: "256",
    icon: "👥",
    color: "bg-blue-100 text-blue-800",
  },
  {
    title: "Active Quizzes",
    value: "12",
    icon: "📝",
    color: "bg-green-100 text-green-800",
  },
  {
    title: "Completion Rate",
    value: "87%",
    icon: "📊",
    color: "bg-purple-100 text-purple-800",
  },
  {
    title: "Avg. Score",
    value: "76/100",
    icon: "🎯",
    color: "bg-yellow-100 text-yellow-800",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Layout>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage quizzes and track student performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center">
              <span className="mr-2">+ Create Quiz</span>
            </button>
            <div className="relative">
              <UserButton />
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transition-transform duration-200 hover:transform hover:scale-105"
            >
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-2xl`}
                >
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === "overview"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("quizzes")}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === "quizzes"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Quizzes
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === "students"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === "analytics"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quiz Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockRecentQuizzes.map((quiz) => (
                        <tr key={quiz.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {quiz.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {quiz.date}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {quiz.participants}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              View
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Activity feed */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Recent Activity
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                            ✓
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Quiz "React Hooks" completed by 12 students
                          </p>
                          <p className="text-xs text-gray-500">
                            Today, 10:30 AM
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                            +
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            5 new students registered
                          </p>
                          <p className="text-xs text-gray-500">
                            Yesterday, 3:45 PM
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                            🔄
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Quiz "JavaScript Fundamentals" was updated
                          </p>
                          <p className="text-xs text-gray-500">
                            April 26, 2025, 2:15 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quizzes" && (
              <div>
                <h2 className="text-xl font-semibold">Quizzes Management</h2>
                <p className="text-gray-600">Manage all your quizzes here.</p>
              </div>
            )}

            {activeTab === "students" && (
              <div>
                <h2 className="text-xl font-semibold">Student Management</h2>
                <p className="text-gray-600">
                  View and manage student profiles.
                </p>
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <h2 className="text-xl font-semibold">Performance Analytics</h2>
                <p className="text-gray-600">
                  View detailed analytics about quiz performance.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions footer */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 flex flex-col items-center transition duration-200">
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm">Export Reports</span>
            </button>
            <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 flex flex-col items-center transition duration-200">
              <span className="text-2xl mb-2">👥</span>
              <span className="text-sm">Invite Students</span>
            </button>
            <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 flex flex-col items-center transition duration-200">
              <span className="text-2xl mb-2">🗓️</span>
              <span className="text-sm">Schedule Quiz</span>
            </button>
            <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 flex flex-col items-center transition duration-200">
              <span className="text-2xl mb-2">⚙️</span>
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
