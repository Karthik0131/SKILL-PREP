
import { Link, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, Home, BookOpen, CheckCircle, BarChart } from "lucide-react";
import resourcesData from "@/data/resourcesData";
import { useResourceProgress } from "@/hooks/useResourceProgress";

interface ResourceSidebarProps {
  categoryId?: string;
  subtopicId?: string;
}

const ResourceSidebar = ({ categoryId, subtopicId }: ResourceSidebarProps) => {
  const { isCompleted } = useResourceProgress();
  const location = useLocation();
  const category = resourcesData.find((c) => c.id === categoryId);
  
  // Check if we're on the progress page
  const isProgressPage = location.pathname.includes("/progress");

  // Main Resources Page Sidebar
  if (!categoryId) {
    return (
      <div className="h-full w-64 border-r bg-white">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Resources</h3>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 mb-2">MAIN</p>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-100">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/resources/progress" 
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-100 ${isProgressPage ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <BarChart className="h-4 w-4" />
                  <span>Progress</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">CATEGORIES</p>
            <ul className="space-y-1">
              {resourcesData.map((cat) => (
                <li key={cat.id}>
                  <Link 
                    to={`/resources/${cat.id}`} 
                    className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-100 ${categoryId === cat.id ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>{cat.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-4 text-xs text-gray-500 border-t mt-auto">
          <p>Data stored locally in browser</p>
        </div>
      </div>
    );
  }

  // Category Page Sidebar - When viewing a category
  if (categoryId && !subtopicId) {
    return (
      <div className="h-full w-64 border-r bg-white">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">{category?.title || "Technical Skills"}</h3>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 mb-2">MAIN</p>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-100">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/resources/progress" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-100">
                  <BarChart className="h-4 w-4" />
                  <span>Progress</span>
                </Link>
              </li>
              <li>
                <Link to="/resources" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-100">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Resources</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Available Topics</p>
            <ul className="space-y-1">
              {category?.subtopics.map((subtopic) => (
                <li key={subtopic.id}>
                  <Link 
                    to={`/resources/${categoryId}/${subtopic.id}`} 
                    className="flex items-center justify-between text-sm px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    <span>{subtopic.title}</span>
                    {subtopic.resources.some(resource => 
                      isCompleted(`${categoryId}-${subtopic.id}-${resource.id}`)
                    ) && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-4 text-xs text-gray-500 border-t mt-auto">
          <p>Track your progress as you learn</p>
        </div>
      </div>
    );
  }

  // Subtopic Page Sidebar - When viewing a specific resource
  return (
    <div className="h-full w-64 border-r bg-white">
      <div className="p-4 border-b">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{category?.title || "Learning Portal"}</h3>
          {subtopicId && (
            <p className="text-sm text-gray-500 mt-1">
              {category?.subtopics.find(s => s.id === subtopicId)?.title}
            </p>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500 mb-2">MAIN</p>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-100">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to={`/resources/${categoryId}`} className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
                <span>Back to {category?.title}</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Available Topics</p>
          <ul className="space-y-1">
            {category?.subtopics.map((subtopic) => (
              <li key={subtopic.id}>
                <Link 
                  to={`/resources/${categoryId}/${subtopic.id}`}
                  className={`flex items-center justify-between text-sm px-3 py-2 rounded-md hover:bg-gray-100 ${subtopicId === subtopic.id ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <span>{subtopic.title}</span>
                  {subtopic.resources.some(resource => 
                    isCompleted(`${categoryId}-${subtopic.id}-${resource.id}`)
                  ) && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-4 text-xs text-gray-500 border-t mt-auto">
        <p>Track your progress as you learn</p>
      </div>
    </div>
  );
};

export default ResourceSidebar;
