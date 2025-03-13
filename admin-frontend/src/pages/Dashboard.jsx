import { UserButton } from "@clerk/clerk-react";

import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome, Admin!</h2>
        <p className="text-gray-700">This is your dashboard where you can manage quizzes and analyze student performance.</p>
        <UserButton />
      </div>
    </Layout>
  );
}

