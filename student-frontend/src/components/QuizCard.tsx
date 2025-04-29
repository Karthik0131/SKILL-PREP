
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Quiz } from "@/types";

interface QuizCardProps {
  quiz: Quiz;
  index: number;
}

const QuizCard = ({ quiz, index }: QuizCardProps) => {
  // Handle either id or _id from the API
  const quizId = quiz.id || quiz._id;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg group border border-border/50 hover:border-skill/50">
        <CardHeader className="relative p-4 bg-secondary/50">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center rounded-full bg-skill-light/50 px-2.5 py-0.5 text-xs font-medium text-skill-dark">
              {quiz.category || "Quiz"}
            </span>
            {quiz.subcategory && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-muted/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {quiz.subcategory}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold mt-2 text-balance">{quiz.title}</h3>
        </CardHeader>
        <CardContent className="p-4 text-sm text-muted-foreground">
          <p className="line-clamp-3">
            {quiz.description || "Test your knowledge with this quiz. Click to start and see how well you know the subject."}
          </p>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center border-t border-border/50 bg-background/50">
          <div className="text-sm text-muted-foreground">
            {quiz.questionCount || quiz.numQuestions || "Multiple"} questions
          </div>
          <Link to={`/quiz/${quizId}`}>
            <Button 
              size="sm" 
              className="transition-all bg-skill hover:bg-skill-dark group-hover:shadow-md"
            >
              Start Quiz
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuizCard;
