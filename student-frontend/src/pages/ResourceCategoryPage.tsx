
import { useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import resourcesData from "@/data/resourcesData";
import SubtopicCard from "@/components/SubtopicCard";
import { Progress } from "@/components/ui/progress";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import ResourceSidebar from "@/components/ResourceSidebar";
import { Button } from "@/components/ui/button";

const ResourceCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getCategoryProgress } = useResourceProgress();

  const category = useMemo(() => 
    resourcesData.find((c) => c.id === categoryId),
    [categoryId]
  );

  if (!category) {
    return <Navigate to="/resources" replace />;
  }

  const { completed, total, percentage } = getCategoryProgress(
    category.id,
    category.subtopics
  );

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
      <ResourceSidebar categoryId={categoryId} />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex items-center">
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-3">{category.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{category.description}</p>
            <div className="bg-card border rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-3">Your Progress</h3>
              <div className="flex justify-between items-center mb-2 text-sm">
                <span>Overall Completion</span>
                <span className="font-medium">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">
                You've completed {completed} out of {total} resources in this category.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-6">Subtopics</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {category.subtopics.map((subtopic) => (
              <motion.div key={subtopic.id} variants={item}>
                <SubtopicCard categoryId={category.id} subtopic={subtopic} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourceCategoryPage;
