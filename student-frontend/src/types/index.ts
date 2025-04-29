
export interface Quiz {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  category?: string;
  subcategory?: string;
  questionCount?: number;
  numQuestions?: number;
  timeLimit?: number;
  createdAt?: string;
  updatedAt?: string;
  resources?: QuizResource[];
}

export interface QuizResource {
  minScore: number;
  maxScore: number;
  recommendation: string;
  resourceLink: string;
}

export interface ApiQuestion {
  _id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  marks: number;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId?: string;
}

export interface QuizDetail extends Quiz {
  questions: Question[];
}

export interface QuizSubmission {
  quizId: string;
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  answers: {
    questionId: string;
    selectedOptionId: string;
    correctOptionId: string;
    isCorrect: boolean;
  }[];
}

export interface QuizStudentSubmission {
  quizId: string;
  timeTaken: number;
  responses: {
    questionId: string;
    selectedOption: number;
  }[];
}

export interface PerformanceData {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  totalMarks?: number;
}

export interface PerformanceAnalysisResponse {
  weakAreas: Record<string, number>;
  strongAreas: Record<string, number>;
  totalAttempts: number;
  lastAttempt?: {
    quizId: string;
    score: number;
    timeTaken: number;
    responses: {
      questionId: string;
      selectedOption: number;
      isCorrect: boolean;
      _id: string;
    }[];
    _id: string;
    attemptedAt: string;
  };
}

export interface PerformanceAnalysis {
  student: {
    rollno: string;
    name: string;
    email: string;
  };
  overall: {
    totalQuizzes: number;
    averageScore: number;
    totalTime: number;
    strongCategories: string[];
    weakCategories: string[];
  };
  categoryPerformance: {
    [category: string]: {
      averageScore: number;
      quizCount: number;
    };
  };
}

export interface RecommendationItem {
  resourceId?: string; // Changed from _id to resourceId
  quizId?: string;
  quizTitle?: string;
  category?: string;
  subcategory?: string;
  recommendation?: string;
  resourceLink?: string;
  score?: number;
  isCompleted?: boolean;
}

export interface Recommendation {
  category: string;
  subcategory: string;
  score: number;
  resources: {
    title: string;
    description: string;
    url: string;
  }[];
}

export interface QuizHistoryItem {
  quizId: string;
  title: string;
  category: string;
  subcategory: string;
  score: number;
  timeTaken: number;
  completedAt: string;
  attemptedAt?: string;
  totalMarks?: number;
  totalQuestions?: number;
  responses?: Array<{
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    _id: string;
  }>;
}
