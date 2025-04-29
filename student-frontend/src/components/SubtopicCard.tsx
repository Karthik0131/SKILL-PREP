
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Subtopic } from "@/data/resourcesData";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import { Badge } from "@/components/ui/badge";

interface SubtopicCardProps {
  categoryId: string;
  subtopic: Subtopic;
}

const SubtopicCard = ({ categoryId, subtopic }: SubtopicCardProps) => {
  const { getSubtopicProgress } = useResourceProgress();
  const { completed, total, percentage } = getSubtopicProgress(
    categoryId,
    subtopic.id,
    subtopic.resources
  );

  return (
    <Link to={`/resources/${categoryId}/${subtopic.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div 
            className="h-40 bg-cover bg-center" 
            style={{ backgroundImage: `url(${subtopic.image})` }}
          >
            <div className="w-full h-full bg-black bg-opacity-30 flex items-end p-4">
              <Badge variant="secondary" className="mb-2">
                {completed === total && total > 0 ? "Completed" : `${completed}/${total} resources`}
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{subtopic.title}</CardTitle>
            <CardDescription className="line-clamp-2">{subtopic.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Progress value={percentage} className="h-2" />
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground pt-0">
            {completed === total && total > 0 
              ? "All resources completed" 
              : `${completed} of ${total} resources completed`}
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};

export default SubtopicCard;
