import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (Fixed) */}
      <aside className="w-64 bg-gray-900 text-white p-5 fixed h-full">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">
            🏠 Dashboard
          </Link>
          <Link to="/quizzes" className="hover:bg-gray-700 p-2 rounded">
            📋 Manage Quizzes
          </Link>
          <Link to="/analysis" className="hover:bg-gray-700 p-2 rounded">
            📊 Student Analysis
          </Link>
        </nav>
      </aside>

      {/* Main Content (Scrollable) */}
      <main className="ml-64 flex-1 p-6 overflow-y-auto h-screen bg-amber-50">
        <div className="flex justify-between items-right">
          <h1 className="text-3xl font-semibold text-blue-600">Skill Prep</h1>

          <UserButton />
        </div>
        {/* Scrollable Content Area */}
        <div className="mt-6 h-[calc(100vh-80px)] overflow-y-auto p-4 bg-white shadow-md rounded">
          {children}
        </div>
      </main>
    </div>
  );
}
