import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Quizzes from "./pages/Quizzes";
import ManageQuestions from "./pages/ManageQuestions"; // Import the new page

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
        path="/manage-questions/:quizId"
        element={
          <SignedIn>
            <ManageQuestions />
          </SignedIn>
        }
      />
      

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
