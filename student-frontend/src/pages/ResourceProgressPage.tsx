
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import resourcesData from "@/data/resourcesData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ArrowRight } from "lucide-react";
import ResourceSidebar from "@/components/ResourceSidebar";

const ResourceProgressPage = () => {
  const { user } = useUser();
  const { getCategoryProgress } = useResourceProgress();
  const firstName = user?.firstName || "User";

  // Calculate overall progress
  const overallProgress = resourcesData.reduce(
    (acc, category) => {
      const { completed, total } = getCategoryProgress(
        category.id,
        category.subtopics
      );
      return {
        completed: acc.completed + completed,
        total: acc.total + total,
      };
    },
    { completed: 0, total: 0 }
  );

  const overallPercentage = 
    overallProgress.total > 0 
      ? Math.round((overallProgress.completed / overallProgress.total) * 100) 
      : 0;

  // Format current date for display
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });

  // Prepare data for category-specific progress
  const categoryProgressData = resourcesData.map((category) => {
    const { completed, total, percentage } = getCategoryProgress(
      category.id,
      category.subtopics
    );
    return {
      id: category.id,
      name: category.title,
      completed,
      total,
      percentage,
    };
  });

  // Get icons for each category
  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, string> = {
      "technical": "📱", // Document icon for technical
      "verbal": "💬",    // Chat icon for verbal
      "behavioral": "🧠", // Brain icon for behavioral
      "company": "🏢",    // Building icon for company
      "interview": "🎯"   // Target icon for interview
    };
    
    return iconMap[categoryId] || "📚";
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <ResourceSidebar />
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="flex items-center gap-1"
            >
              <Link to="/resources">
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Resources</span>
              </Link>
            </Button>
          </div>
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Progress</h1>
            <p className="text-gray-600 text-lg">
              Track your learning journey, {firstName}
            </p>
            <div className="flex justify-end">
              <p className="text-sm text-gray-500">Last updated: {formattedDate}</p>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-8 mb-8 shadow-sm">
            <h2 className="text-xl font-bold mb-3">Overall Progress</h2>
            <p className="text-gray-500 mb-6">Your progress across all categories</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
              <div className="flex justify-center">
                <div className="relative h-48 w-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600">{overallPercentage}%</div>
                      <div className="text-gray-500 mt-2">Completed</div>
                    </div>
                  </div>
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${overallPercentage * 2.83} ${
                        283 - overallPercentage * 2.83
                      }`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryProgressData.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start mb-3">
                      <div className="text-2xl mr-3">{getCategoryIcon(category.id)}</div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                          {category.completed} / {category.total} completed
                        </p>
                      </div>
                    </div>
                    <Progress 
                      value={category.percentage} 
                      className="h-2 bg-gray-200" 
                      indicatorClassName={category.id === "verbal" ? "bg-green-500" : 
                                        category.id === "technical" ? "bg-blue-500" :
                                        category.id === "behavioral" ? "bg-purple-500" :
                                        category.id === "company" ? "bg-amber-500" : "bg-red-500"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {categoryProgressData.map((category) => (
              <div key={category.id} className="bg-white border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">{getCategoryIcon(category.id)}</div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{category.percentage}%</span>
                  </div>
                  <Progress 
                    value={category.percentage} 
                    className="h-2 bg-gray-200" 
                    indicatorClassName={category.id === "verbal" ? "bg-green-500" : 
                                    category.id === "technical" ? "bg-blue-500" :
                                    category.id === "behavioral" ? "bg-purple-500" :
                                    category.id === "company" ? "bg-amber-500" : "bg-red-500"}
                  />
                </div>
                
                <p className="text-sm text-gray-600 mb-5">
                  {category.completed} of {category.completed + (category.total - category.completed)} topics completed
                </p>
                
                <div className="flex items-center text-xs text-gray-500">
                  <span className="inline-block w-4 h-4 mr-2 bg-blue-100 rounded-full items-center justify-center">
                    <span className="text-blue-600">📊</span>
                  </span>
                  <span>In progress</span>
                  
                  <Link 
                    to={`/resources/${category.id}`} 
                    className="ml-auto text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceProgressPage;
