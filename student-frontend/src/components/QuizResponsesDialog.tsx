
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getQuestionById } from '@/api/quizzes';
import { toast } from "sonner";

interface QuestionResponse {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  questionText?: string;
  options?: string[];
}

interface QuizResponsesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responses: QuestionResponse[];
  quizTitle: string;
}

const QuizResponsesDialog: React.FC<QuizResponsesDialogProps> = ({
  open,
  onOpenChange,
  responses,
  quizTitle,
}) => {
  const [questionDetails, setQuestionDetails] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [fetchErrors, setFetchErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // When dialog opens, fetch question details for each response
    if (open && responses && responses.length > 0) {
      // Reset states when dialog reopens
      setQuestionDetails({});
      setLoading({});
      setFetchErrors({});
      
      responses.forEach((response) => {
        if (response.questionId && !questionDetails[response.questionId]) {
          fetchQuestionDetails(response.questionId);
        }
      });
    }
  }, [open, responses]);

  const fetchQuestionDetails = async (questionId: string) => {
    if (!questionId) return;
    
    try {
      setLoading(prev => ({ ...prev, [questionId]: true }));
      setFetchErrors(prev => ({ ...prev, [questionId]: '' }));
      
      const questionData = await getQuestionById(questionId);
      console.log("Fetched question details:", questionData);
      
      if (questionData) {
        setQuestionDetails(prev => ({
          ...prev,
          [questionId]: questionData
        }));
      } else {
        throw new Error("No question data returned");
      }
    } catch (error) {
      console.error(`Failed to fetch details for question ${questionId}:`, error);
      setFetchErrors(prev => ({ 
        ...prev, 
        [questionId]: error instanceof Error ? error.message : 'Failed to fetch question details' 
      }));
      toast.error(`Failed to fetch question details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const getQuestionText = (questionId: string): string => {
    return questionDetails[questionId]?.questionText || '';
  };

  const getQuestionOptions = (questionId: string): string[] => {
    return questionDetails[questionId]?.options || [];
  };

  const isQuestionLoading = (questionId: string): boolean => {
    return !!loading[questionId];
  };

  const hasError = (questionId: string): boolean => {
    return !!fetchErrors[questionId];
  };

  const retry = (questionId: string) => {
    toast.info("Retrying question fetch...");
    fetchQuestionDetails(questionId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Quiz Responses</DialogTitle>
          <DialogDescription>
            Your answers for "{quizTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
          {responses.map((response, index) => (
            <Card key={response.questionId || index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {response.isCorrect ? (
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">
                      <span className="text-sm">Question {index + 1}</span>
                    </h3>
                    <Badge variant={response.isCorrect ? "success" : "destructive"}>
                      {response.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    {isQuestionLoading(response.questionId) ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Loading question...</span>
                      </div>
                    ) : hasError(response.questionId) ? (
                      <div className="flex flex-col gap-2 py-2">
                        <div className="flex items-center gap-1.5 text-sm text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="italic">Error loading question: {fetchErrors[response.questionId]}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => retry(response.questionId)}
                          className="w-fit"
                        >
                          Retry
                        </Button>
                      </div>
                    ) : getQuestionText(response.questionId) ? (
                      <div>
                        <p className="text-sm font-medium">{getQuestionText(response.questionId)}</p>
                        {getQuestionDetails(response.questionId)?.marks && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Marks: {getQuestionDetails(response.questionId)?.marks}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-sm text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="italic">Question text not available</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Selected Option:</span> {response.selectedOption + 1}
                    {getQuestionOptions(response.questionId).length > 0 && (
                      <span className="ml-2">
                        ({getQuestionOptions(response.questionId)[response.selectedOption]})
                      </span>
                    )}
                  </div>
                  
                  {getQuestionOptions(response.questionId).length > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="font-medium mb-1">All options:</div>
                      <ul className="space-y-1 pl-5 list-disc">
                        {getQuestionOptions(response.questionId).map((option, i) => (
                          <li 
                            key={i} 
                            className={`${response.selectedOption === i ? 'font-medium' : ''} ${
                              getCorrectOptionIndex(response.questionId) === i ? 'text-green-600' : ''
                            }`}
                          >
                            {option}
                            {getCorrectOptionIndex(response.questionId) === i && (
                              <span className="ml-1 text-xs text-green-600">(Correct answer)</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  // Helper functions
  function getQuestionDetails(questionId: string) {
    return questionDetails[questionId] || null;
  }
  
  function getCorrectOptionIndex(questionId: string): number | null {
    const details = getQuestionDetails(questionId);
    return details && typeof details.correctOption === 'number' ? details.correctOption : null;
  }
};

export default QuizResponsesDialog;
