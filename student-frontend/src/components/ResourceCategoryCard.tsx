
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Category } from "@/data/resourcesData";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import { Code, Brain, BookOpen, Users, Building } from "lucide-react";

interface ResourceCategoryCardProps {
  category: Category;
}

const ResourceCategoryCard = ({ category }: ResourceCategoryCardProps) => {
  const { getCategoryProgress } = useResourceProgress();
  const { completed, total } = getCategoryProgress(
    category.id,
    category.subtopics
  );

  // Map icon names to Lucide components
  const iconMap: Record<string, React.ReactNode> = {
    code: <Code className="w-6 h-6" />,
    brain: <Brain className="w-6 h-6" />,
    speech: <BookOpen className="w-6 h-6" />,
    users: <Users className="w-6 h-6" />,
    building: <Building className="w-6 h-6" />,
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500 text-blue-500",
      green: "bg-green-500 text-green-500",
      purple: "bg-purple-500 text-purple-500",
      orange: "bg-orange-500 text-orange-500",
      red: "bg-red-500 text-red-500",
    };
    return colorMap[color] || "bg-primary text-primary";
  };

  const colorClass = getColorClass(category.color);
  const bgColorClass = colorClass.split(" ")[0];
  const textColorClass = colorClass.split(" ")[1];

  return (
    <Link to={`/resources/${category.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <div className={`h-2 ${bgColorClass}`} />
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className={`p-2 rounded-full bg-opacity-10 ${bgColorClass} bg-opacity-10`}>
              {iconMap[category.icon]}
            </div>
            <div>
              <CardTitle className="text-xl">{category.title}</CardTitle>
              <CardDescription className="text-sm">{category.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2 text-sm">
              <span>Progress</span>
              <span>{completed}/{total} completed</span>
            </div>
            <Progress value={total > 0 ? (completed / total) * 100 : 0} className="h-2" />
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default ResourceCategoryCard;
