import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import QuizPage from "./pages/QuizPage";
import PerformanceAnalysis from "./pages/PerformanceAnalysis";
import PerformanceAnalysisPage from "./pages/PerformanceAnalysisPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import StudentProfile from "./pages/StudentProfile";
import ResourcesPage from "./pages/ResourcesPage";
import ResourceCategoryPage from "./pages/ResourceCategoryPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import ResourceProgressPage from "./pages/ResourceProgressPage";
import Layout from "./components/Layout";
import Quizzes from "./pages/Quizzes";

// Create the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Fixed App component to properly implement React providers
const App = () => {
  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route
                path="quiz"
                element={
                  <SignedIn>
                    <Quizzes />
                  </SignedIn>
                }
              />
              <Route
                path="quiz/:id"
                element={
                  <SignedIn>
                    <QuizPage />
                  </SignedIn>
                }
              />
              <Route
                path="performance/:quizId"
                element={
                  <SignedIn>
                    <PerformanceAnalysis />
                  </SignedIn>
                }
              />
              <Route
                path="performance"
                element={
                  <SignedIn>
                    <PerformanceAnalysisPage />
                  </SignedIn>
                }
              />
              <Route
                path="recommendations"
                element={
                  <SignedIn>
                    <RecommendationsPage />
                  </SignedIn>
                }
              />
              <Route
                path="resources"
                element={
                  <SignedIn>
                    <ResourcesPage />
                  </SignedIn>
                }
              />
              <Route
                path="resources/progress"
                element={
                  <SignedIn>
                    <ResourceProgressPage />
                  </SignedIn>
                }
              />
              <Route
                path="resources/:categoryId"
                element={
                  <SignedIn>
                    <ResourceCategoryPage />
                  </SignedIn>
                }
              />
              <Route
                path="resources/:categoryId/:subtopicId"
                element={
                  <SignedIn>
                    <ResourceDetailPage />
                  </SignedIn>
                }
              />
              <Route
                path="profile/:rollNumber?"
                element={
                  <SignedIn>
                    <StudentProfile />
                  </SignedIn>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </TooltipProvider>
  );
};

export default App;
