
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { ChartPie } from "lucide-react";
import resourcesData from "@/data/resourcesData";
import ResourceCategoryCard from "@/components/ResourceCategoryCard";
import { Button } from "@/components/ui/button";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import ResourceSidebar from "@/components/ResourceSidebar";

const ResourcesPage = () => {
  const { user } = useUser();
  const { getCategoryProgress } = useResourceProgress();
  const firstName = user?.firstName || "there";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ResourceSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h1 className="text-4xl font-bold mb-4">Learning Resources</h1>
                <p className="text-xl max-w-3xl opacity-90">
                  Hi {firstName}! Explore our comprehensive learning materials to enhance your skills and prepare for interviews.
                </p>
                
                <Link to="/resources/progress">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="mt-6 bg-white text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <ChartPie className="h-5 w-5" />
                    View Progress
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="relative h-36 w-36">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-4xl font-bold">{overallPercentage}%</div>
                      <div className="text-sm opacity-90">Completed</div>
                    </div>
                  </div>
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="white"
                      strokeWidth="6"
                      strokeDasharray={`${overallPercentage * 2.83} ${283 - overallPercentage * 2.83}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <p className="text-sm mt-2">
                  {overallProgress.completed} of {overallProgress.total} resources
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Categories</h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {resourcesData.map((category) => (
                <motion.div key={category.id} variants={item}>
                  <ResourceCategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourcesPage;
