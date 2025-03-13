import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">🏠 Dashboard</Link>
          <Link to="/quizzes" className="hover:bg-gray-700 p-2 rounded">📋 Manage Quizzes</Link>
          <Link to="/analysis" className="hover:bg-gray-700 p-2 rounded">📊 Student Analysis</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <UserButton />
        </div>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
