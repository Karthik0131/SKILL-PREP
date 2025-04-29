
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, BarChart2, Clock, Award, BookOpen } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { extractRollNumber } from "@/lib/utils";

const PerformanceAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  
  // Get performance data from location state
  const performanceData = location.state?.performanceData;
  console.log(performanceData);
  
  // If no performance data is available, redirect to home
  useEffect(() => {
    if (!performanceData && !loading) {
      navigate('/', { replace: true });
    }
  }, [performanceData, navigate, loading]);
  
  if (!performanceData) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  const { 
    score, 
    totalQuestions, 
    correctAnswers, 
    timeTaken,
    totalMarks
  } = performanceData;
  
  // Calculate score percentage based on marks obtained out of total marks
  // Fix: Calculate percentage properly based on available data
  let scorePercentage = 0;
  if (totalMarks && totalMarks > 0) {
    scorePercentage = Math.round((score / totalMarks) * 100);
  } else if (totalQuestions && totalQuestions > 0 && totalMarks === undefined) {
    scorePercentage = Math.round((score / totalQuestions) * 100);
  } else {
    scorePercentage = score; // If score is already a percentage
  }
  
  // Format time taken (seconds to mm:ss)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const rollNumber = user ? extractRollNumber(user) : '';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
          <h1 className="text-3xl font-bold">Performance Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Review your quiz results and performance metrics
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Award className="mr-2 h-5 w-5 text-skill" />
                Score Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center my-4">
                <span className="text-5xl font-bold text-skill">
                  {score} / {totalMarks || totalQuestions}
                </span>
                <p className="text-muted-foreground mt-2">
                  {scorePercentage}% Score
                </p>
              </div>
              <Progress value={scorePercentage} className="h-2 mb-6" />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-medium">{totalQuestions}</p>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Marks Obtained</p>
                  <p className="text-2xl font-medium text-green-500">{score}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Clock className="mr-2 h-5 w-5 text-skill" />
                Time Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center my-4">
                <span className="text-5xl font-bold">{formatTime(timeTaken)}</span>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg text-center mb-4">
                <p className="text-sm text-muted-foreground">Average Time per Question</p>
                <p className="text-2xl font-medium">
                  {formatTime(Math.round(timeTaken / totalQuestions))}
                </p>
              </div>
              <Alert>
                <BarChart2 className="h-4 w-4" />
                <AlertTitle>Performance Insight</AlertTitle>
                <AlertDescription>
                  {scorePercentage > 80 
                    ? "Excellent work! You've mastered this quiz." 
                    : scorePercentage > 60 
                      ? "Good job! Consider reviewing the questions you missed." 
                      : "Keep practicing! Review the material again for better results."}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 justify-center mb-8">
          <Button onClick={() => navigate("/performance")} className="bg-skill hover:bg-skill-dark">
            <BarChart2 className="mr-2 h-4 w-4" />
            Full Performance Analysis
          </Button>
          <Button onClick={() => navigate("/recommendations")} variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            View Recommendations
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Continue your learning journey with these options
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" className="h-auto py-4 px-4 justify-start" onClick={() => navigate("/")}>
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">Take Another Quiz</span>
                <span className="text-sm text-muted-foreground">Practice with different questions</span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4 px-4 justify-start" onClick={() => {
              if (rollNumber) {
                navigate(`/profile/${rollNumber}`);
              } else {
                navigate("/profile");
              }
            }}>
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">View Your Profile</span>
                <span className="text-sm text-muted-foreground">See your overall performance</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PerformanceAnalysis;
