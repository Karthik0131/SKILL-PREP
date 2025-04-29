
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getStudentData, getStudentPerformance, getQuizQuestions } from "@/api/quizzes";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Book, Calendar, Clock, Eye, User, BarChart2, 
  LineChart, Award, Zap, AlertCircle, BarChart, ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";
import QuizResponsesDialog from "@/components/QuizResponsesDialog";
import { Separator } from "@/components/ui/separator";

const StudentProfile = () => {
  const { rollNumber: paramRollNumber } = useParams<{ rollNumber?: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentRollNumber, setCurrentRollNumber] = useState<string | null>(null);
  const [selectedQuizResponses, setSelectedQuizResponses] = useState<any>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any>({});

  useEffect(() => {
    if (paramRollNumber) {
      setCurrentRollNumber(paramRollNumber);
    } else if (user && user.username) {
      console.log("Using username as roll number:", user.username);
      setCurrentRollNumber(user.username);
    }
  }, [paramRollNumber, user]);

  const { data: studentData, isLoading: studentLoading } = useQuery({
    queryKey: ["student-data", currentRollNumber],
    queryFn: async () => {
      if (!currentRollNumber) return null;
      try {
        const data = await getStudentData(currentRollNumber);
        console.log("Student data received:", data);
        return data;
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load student data");
        return null;
      }
    },
    enabled: !!currentRollNumber,
    retry: 2,
  });

  const { data: performanceData } = useQuery({
    queryKey: ["performance-analysis", currentRollNumber],
    queryFn: () => (currentRollNumber ? getStudentPerformance(currentRollNumber) : Promise.resolve(null)),
    enabled: !!currentRollNumber,
  });

  const isLoading = studentLoading;

  const renderPerformanceIndicator = (score: number) => {
    if (score >= 80) return { color: "bg-green-500", label: "Strong" };
    if (score >= 50) return { color: "bg-blue-500", label: "Moderate" };
    return { color: "bg-yellow-500", label: "Needs Improvement" };
  };

  const showQuizResponses = async (quizAttempt: any) => {
    try {
      if (quizAttempt.quizId?._id && !quizQuestions[quizAttempt.quizId._id]) {
        const quizData = await getQuizQuestions(quizAttempt.quizId._id);
        
        setQuizQuestions(prev => ({
          ...prev,
          [quizAttempt.quizId._id]: quizData
        }));
      }
      
      setSelectedQuizResponses(quizAttempt);
      setResponseDialogOpen(true);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      setSelectedQuizResponses(quizAttempt);
      setResponseDialogOpen(true);
    }
  };

  const formatQuizTitle = (quiz: any) => {
    if (!quiz) return "Unknown Quiz";
    return quiz.title || quiz.category || "Quiz";
  };

  const calculatePercentageScore = (score: number, maxPossibleScore: number) => {
    if (!maxPossibleScore || maxPossibleScore === 0) return 0;
    return Math.round((score / maxPossibleScore) * 100);
  };

  const viewPerformance = (attempt: any) => {
    if (!attempt) return;
    
    const performanceData = {
      score: attempt.score || 0,
      totalQuestions: attempt.totalQuestions || attempt.responses?.length || 0,
      correctAnswers: attempt.score || 0, // Since score is usually the number of correct answers
      timeTaken: attempt.timeTaken || 0,
      totalMarks: attempt.totalMarks || 0
    };
    
    navigate(`/performance/${attempt.quizId?._id || attempt.quizId}`, { 
      state: { performanceData }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-4">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
        <p className="text-muted-foreground text-center mb-6">
          Could not find student profile.
        </p>
        <Button onClick={() => navigate("/")}>
          Return to home page
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Student information</CardDescription>
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{studentData.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Roll Number</p>
                <p className="font-medium">{studentData.rollno || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{studentData.email || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Performance Overview
              </CardTitle>
              <CardDescription>Summary of your quiz performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {performanceData ? (
                <>
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-green-500" />
                      Strong Areas
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(performanceData.strongAreas || {}).length > 0 ? (
                        Object.entries(performanceData.strongAreas || {}).map(([area, score]) => (
                          <div key={area} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{area}</span>
                              <span>{typeof score === "number" ? Math.round(score) : 0}%</span>
                            </div>
                            <Progress 
                              value={typeof score === "number" ? score : 0} 
                              max={100}
                              className="h-2"
                              indicatorClassName="bg-gradient-to-r from-blue-500 to-green-500"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No strong areas identified yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Areas to Improve
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(performanceData.weakAreas || {}).length > 0 ? (
                        Object.entries(performanceData.weakAreas || {}).map(([area, score]) => (
                          <div key={area} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{area}</span>
                              <span>{typeof score === "number" ? Math.round(score) : 0}%</span>
                            </div>
                            <Progress 
                              value={typeof score === "number" ? score : 0} 
                              max={100}
                              className="h-2"
                              indicatorClassName="bg-gradient-to-r from-yellow-500 to-blue-500"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No weak areas identified yet</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No performance data available yet</p>
                  <p className="text-sm">Complete more quizzes to see your performance analysis</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/performance")}
              >
                View Full Performance Report
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Quiz History
            </CardTitle>
            <CardDescription>Your recent quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {studentData.quizAttempts && studentData.quizAttempts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-muted-foreground border-b">
                      <th className="text-left font-medium py-2 pl-2">Quiz</th>
                      <th className="text-left font-medium py-2">Score</th>
                      <th className="text-left font-medium py-2">Time Taken</th>
                      <th className="text-left font-medium py-2">Date</th>
                      <th className="text-left font-medium py-2">Attempted At</th>
                      <th className="text-right font-medium py-2 pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.quizAttempts
                      .sort((a: any, b: any) => {
                        const dateA = new Date(a.attemptedAt || a.completedAt || 0).getTime();
                        const dateB = new Date(b.attemptedAt || b.completedAt || 0).getTime();
                        return dateB - dateA; // Most recent first
                      })
                      .map((attempt: any, index: number) => {
                        const totalMarks = attempt.totalMarks || attempt.quizId?.totalMarks || 0;
                        const scorePercentage = totalMarks > 0 
                          ? Math.round((attempt.score / totalMarks) * 100)
                          : 0;
                        
                        return (
                          <tr key={attempt._id || index} className="border-b last:border-none hover:bg-muted/50">
                            <td className="py-3 pl-2">
                              <div className="font-medium">{formatQuizTitle(attempt.quizId)}</div>
                              {attempt.quizId?.category && (
                                <div className="text-xs text-muted-foreground">
                                  {attempt.quizId.category}
                                </div>
                              )}
                            </td>
                            <td className="py-3">
                              <Badge 
                                variant={
                                  scorePercentage >= 80 ? "success" : 
                                  scorePercentage >= 50 ? "default" : "warning"
                                }
                              >
                                {scorePercentage}%
                              </Badge>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>
                                  {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                                </span>
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>
                                  {attempt.completedAt && format(new Date(attempt.completedAt), "MMM d, yyyy")}
                                </span>
                              </div>
                            </td>
                            <td className="py-3">
                              {attempt.attemptedAt && (
                                <div className="text-sm">
                                  {format(new Date(attempt.attemptedAt), "h:mm a")}
                                </div>
                              )}
                            </td>
                            <td className="py-3 pr-2 text-right">
                              <div className="space-x-2">
                                {attempt.responses && attempt.responses.length > 0 && (
                                  <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => showQuizResponses(attempt)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => viewPerformance(attempt)}
                                >
                                  <BarChart className="h-4 w-4 mr-1" />
                                  Performance
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No quiz history available
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-skill hover:bg-skill-dark" onClick={() => navigate("/")}>
              Take More Quizzes
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {selectedQuizResponses && (
        <QuizResponsesDialog
          open={responseDialogOpen}
          onOpenChange={setResponseDialogOpen}
          responses={selectedQuizResponses.responses}
          quizTitle={formatQuizTitle(selectedQuizResponses.quizId)}
        />
      )}
    </>
  );
};

export default StudentProfile;
