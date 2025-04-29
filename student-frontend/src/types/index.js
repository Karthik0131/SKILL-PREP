

export const Quiz = {
  id: undefined,
  _id: undefined,
  title: "",
  description: "",
  category: "",
  subcategory: "",
  questionCount: 0,
  numQuestions: 0,
  timeLimit: 0,
  createdAt: "",
  updatedAt: "",
  resources: []
};

export const QuizResource = {
  minScore: 0,
  maxScore: 0,
  recommendation: "",
  resourceLink: ""
};

export const ApiQuestion = {
  _id: "",
  quizId: "",
  questionText: "",
  options: [],
  correctOption: 0,
  explanation: "",
  marks: 0,
  createdAt: ""
};

export const Question = {
  id: "",
  text: "",
  options: [],
  correctOptionId: ""
};

export const QuizDetail = {
  ...Quiz,
  questions: []
};

export const QuizResponse = {
  quizDetails: {
    _id: "",
    title: "",
    category: "",
    subcategory: "",
    timeLimit: 0
  },
  questions: [],
  totalMarks: 0,
  timeLimit: 0
};

export const QuizSubmission = {
  quizId: "",
  answers: []
};

export const QuizResult = {
  quizId: "",
  score: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  answers: []
};

export const QuizStudentSubmission = {
  quizId: "",
  timeTaken: 0,
  responses: []
};

export const PerformanceData = {
  score: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  timeTaken: 0,
  totalMarks: 0
};

export const PerformanceAnalysisResponse = {
  weakAreas: {},
  strongAreas: {},
  totalAttempts: 0,
  lastAttempt: undefined
};

export const PerformanceAnalysis = {
  student: {
    rollno: "",
    name: "",
    email: ""
  },
  overall: {
    totalQuizzes: 0,
    averageScore: 0,
    totalTime: 0,
    strongCategories: [],
    weakCategories: []
  },
  categoryPerformance: {}
};

export const RecommendationItem = {
  quizTitle: "",
  category: "",
  subcategory: "",
  score: 0,
  recommendation: "",
  resourceLink: ""
};

export const Recommendation = {
  category: "",
  subcategory: "",
  score: 0,
  resources: []
};

export const QuizHistoryItem = {
  quizId: "",
  title: "",
  category: "",
  subcategory: "",
  score: 0,
  timeTaken: 0,
  completedAt: "",
  attemptedAt: "",
  totalMarks: 0,
  totalQuestions: 0,
  responses: []
};

