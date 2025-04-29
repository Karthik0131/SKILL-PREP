
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQuizById, getQuizQuestions, submitStudentQuiz, registerStudent } from "@/api/quizzes";
import { ApiQuestion, QuizStudentSubmission } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Clock } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { extractRollNumber } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import QuizSecurityHandler from "@/components/QuizSecurityHandler";

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [showNavigationAlert, setShowNavigationAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: quiz, isLoading: isLoadingQuiz, error: quizError } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => getQuizById(id!),
    enabled: !!id
  });
  
  const { 
    data: questions, 
    isLoading: isLoadingQuestions, 
    error: questionsError 
  } = useQuery({
    queryKey: ["quiz-questions", id],
    queryFn: () => getQuizQuestions(id!),
    enabled: !!id
  });
  
  const submitQuizMutation = useMutation({
    mutationFn: async (data: {
      rollNumber: string,
      quizData: QuizStudentSubmission
    }) => {
      if (user) {
        try {
          await registerStudent({
            rollno: data.rollNumber,
            name: user.fullName || data.rollNumber,
            email: user.primaryEmailAddress?.emailAddress || `${data.rollNumber}@example.com`
          });
        } catch (error) {
          console.error("Error ensuring student registration:", error);
        }
      }
      
      return submitStudentQuiz(data.rollNumber, data.quizData);
    },
    onSuccess: (data) => {
      toast.success("Quiz submitted successfully!");
      
      const correctAnswers = data?.score || 0;
      const totalQuestions = questions?.length || 0;
      const totalMarks = questions?.reduce((sum, q) => sum + q.marks, 0) || 0;
      
      navigate(`/performance/${id}`, { 
        state: { 
          performanceData: {
            score: data?.score || 0,
            totalQuestions,
            correctAnswers,
            timeTaken,
            totalMarks
          }
        },
        replace: true
      });
    },
    onError: (error) => {
      console.error("Quiz submission error:", error);
      
      const totalQuestions = questions?.length || 0;
      const totalMarks = questions?.reduce((sum, q) => sum + q.marks, 0) || 0;
      
      toast.error("There was an issue submitting your quiz, but we've saved your results locally.");
      
      navigate(`/performance/${id}`, { 
        state: { 
          performanceData: {
            score: 0,
            totalQuestions,
            correctAnswers: 0,
            timeTaken,
            totalMarks
          }
        },
        replace: true
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  const isLoading = isLoadingQuiz || isLoadingQuestions;
  const error = quizError || questionsError;
  
  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = questions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  
  useEffect(() => {
    setStartTime(Date.now());
    
    timerIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = Math.floor((currentTime - startTime) / 1000);
      setTimeTaken(elapsed);
    }, 1000);
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [startTime]);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    if (quiz?.timeLimit && !timerRef.current && !quizCompleted) {
      const totalSeconds = quiz.timeLimit * 60;
      setTimeLeft(totalSeconds);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            toast.error("Time's up! Your quiz is being submitted.");
            submitQuizHandler();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [quiz, quizCompleted]);
  
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
  const submitQuizHandler = useCallback(() => {
    if (!questions || !id || !user || isSubmitting) return;
    
    // Set submitting state to prevent duplicate submissions
    setIsSubmitting(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    setQuizCompleted(true);
    
    const responses = Object.keys(selectedAnswers).map(questionId => ({
      questionId,
      selectedOption: selectedAnswers[questionId]
    }));
    
    const rollNumber = extractRollNumber(user);
    
    console.log("Submitting quiz with roll number:", rollNumber);
    
    const quizData: QuizStudentSubmission = {
      quizId: id,
      timeTaken,
      responses
    };
    
    submitQuizMutation.mutate({
      rollNumber,
      quizData
    });
  }, [id, questions, selectedAnswers, timeTaken, user, submitQuizMutation, isSubmitting]);
  
  const handleNext = () => {
    if (!currentQuestion) return;
    
    if (selectedAnswers[currentQuestion._id] === undefined) {
      toast.warning("Please select an answer before proceeding.", {
        duration: 1500 // 1.5 seconds duration
      });
      return;
    }
    
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitQuizHandler();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error || !questions) {
    return (
      <div className="text-center p-10">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to load quiz</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find the quiz you were looking for. It may have been removed or you might have followed a broken link.
        </p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
        </Button>
      </div>
    );
  }
  
  if (quizCompleted && submitQuizMutation.isPending) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <LoadingSpinner size="lg" />
        <h2 className="text-xl font-medium mt-4">Submitting your quiz...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we process your answers.</p>
      </div>
    );
  }
  
  const isQuizActive = !isLoading && !error && !quizCompleted;
  
  return (
    <>
      <QuizSecurityHandler isActive={isQuizActive} onQuizSubmit={submitQuizHandler} />
      
      <div className="max-w-3xl mx-auto py-6 px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">{quiz?.title || "Quiz"}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-sm font-medium bg-secondary/50 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4 mr-1 text-skill" />
                {timeLeft !== null ? formatTime(timeLeft) : formatTime(timeTaken)}
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions?.length || 0}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass dark:glass border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b">
                <h2 className="text-xl font-medium">{currentQuestion?.questionText}</h2>
              </CardHeader>
              <CardContent className="pt-6">
                {currentQuestion && (
                  <RadioGroup
                    value={
                      selectedAnswers[currentQuestion._id] !== undefined
                        ? selectedAnswers[currentQuestion._id].toString()
                        : undefined
                    }
                    onValueChange={(value) => 
                      handleAnswerSelect(currentQuestion._id, parseInt(value))
                    }
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 rounded-lg border p-3 transition-all hover:bg-secondary/50"
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-grow cursor-pointer py-2"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="bg-skill hover:bg-skill-dark"
                  disabled={isSubmitting}
                >
                  {currentQuestionIndex === questions?.length - 1 ? (
                    isSubmitting ? "Submitting..." : "Submit"
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <AlertDialog open={showNavigationAlert} onOpenChange={setShowNavigationAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Navigation Detected</AlertDialogTitle>
            <AlertDialogDescription>
              You are attempting to navigate away from your quiz. If you leave, your current progress will be lost.
              Would you like to submit your quiz now or continue taking it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowNavigationAlert(false)}>
              Continue Quiz
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowNavigationAlert(false);
                submitQuizHandler();
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuizPage;
