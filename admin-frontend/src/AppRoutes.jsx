import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Quizzes from "./pages/Quiz/Quizzes";
import ManageQuestions from "./pages/Quiz/ManageQuestions"; // Import the new page
import CreateQuiz from "./pages/Quiz/CreateQuiz";
import EditQuiz from "./pages/Quiz/EditQuiz";
import AdminDashboard from "./pages/Analysis/AdminDashboard";
import QuizAttempts from "./pages/Analysis/QuizAttempts";
import QuizAnalysis from "./pages/Analysis/QuizAnalysis";
import StudentPerformance from "./pages/Analysis/StudentPerformance";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/sign-in"
        element={
          <SignedOut>
            <SignIn redirectUrl="/" />
          </SignedOut>
        }
      />
      <Route
        path="/sign-up"
        element={
          <SignedOut>
            <SignUp redirectUrl="/" />
          </SignedOut>
        }
      />
      <Route
        path="/dashboard"
        element={
          <SignedIn>
            <Dashboard />
          </SignedIn>
        }
      />
      <Route
        path="/quizzes"
        element={
          <SignedIn>
            <Quizzes />
          </SignedIn>
        }
      />
      <Route
        path="/create-quiz"
        element={
          <SignedIn>
            <CreateQuiz />
          </SignedIn>
        }
      />
      <Route
        path="/manage-questions/:quizId"
        element={
          <SignedIn>
            <ManageQuestions />
          </SignedIn>
        }
      />
      <Route
        path="/edit-quiz/:quizId"
        element={
          <SignedIn>
            <EditQuiz />
          </SignedIn>
        }
      />
      {/* 📌 Admin Analysis Routes */}
      <Route //
        path="/analysis"
        element={
          <SignedIn>
            <AdminDashboard />
          </SignedIn>
        }
      />
      <Route
        path="/analysis/attempts"
        element={
          <SignedIn>
            <QuizAttempts />
          </SignedIn>
        }
      />
      <Route
        path="/analysis/:quizId"
        element={
          <SignedIn>
            <QuizAnalysis />
          </SignedIn>
        }
      />
      <Route
        path="/analysis/student/:rollno"
        element={
          <SignedIn>
            <StudentPerformance />
          </SignedIn>
        }
      />

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
