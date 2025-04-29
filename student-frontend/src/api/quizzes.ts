import { Quiz, QuizDetail, QuizSubmission, QuizResult, QuizStudentSubmission, PerformanceAnalysisResponse, RecommendationItem } from '@/types';
import { toast } from "sonner";

const API_BASE_URL = 'http://localhost:5000';

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `API error: ${response.status}`;
    
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  return response.json();
}

async function makeRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    return handleResponse(response);
  } catch (error) {
    toast.error('Network error. Please check your connection.');
    throw error;
  }
}

export async function registerStudent(studentData: {
  rollno: string;
  name: string;
  email: string;
}): Promise<any> {
  try {
    console.log("Registering student:", studentData);
    return await makeRequest<any>('/api/students/register', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  } catch (error: any) {
    if (error.message && error.message.includes('Student already registered')) {
      console.log("Student was already registered");
      return { message: "Student already registered" };
    }
    throw error;
  }
}

export async function getStudentProfile(rollNumber: string): Promise<any> {
  try {
    console.log(`Fetching profile for student with roll number: ${rollNumber}`);
    return await makeRequest<any>(`/api/students/${rollNumber}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error(`Error fetching student profile for ${rollNumber}:`, error);
    toast.error('Failed to fetch student profile. Please try again later.');
    throw error;
  }
}

export async function getStudentQuizHistory(rollNumber: string): Promise<any> {
  try {
    console.log(`Fetching quiz history for student with roll number: ${rollNumber}`);
    const response = await fetch(`${API_BASE_URL}/api/students/${rollNumber}/quiz-history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `API error: ${response.status}`;
      toast.error(errorMessage);
      console.error(`Error fetching quiz history: ${errorMessage}`);
      return [];
    }
    
    const data = await response.json();
    
    const quizHistory = Array.isArray(data) ? data : (data.quizHistory || []);
    
    const normalizedQuizHistory = quizHistory.map((quiz: any) => {
      if (quiz.category) {
        quiz.category = quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1).toLowerCase();
      }
      return quiz;
    });
    
    console.log("Normalized quiz history:", normalizedQuizHistory);
    
    return normalizedQuizHistory;
  } catch (error) {
    console.error(`Error fetching quiz history for ${rollNumber}:`, error);
    toast.error('Failed to fetch quiz history. Please try again later.');
    return [];
  }
}

export async function getStudentPerformance(rollNumber: string): Promise<PerformanceAnalysisResponse> {
  try {
    console.log(`Fetching performance for student with roll number: ${rollNumber}`);
    const data = await makeRequest<PerformanceAnalysisResponse>(`/api/students/${rollNumber}/performance`, {
      method: 'GET',
    });
    
    if (!data) {
      return {
        strongAreas: {},
        weakAreas: {},
        totalAttempts: 0,
      };
    }
    
    if (!data.strongAreas) data.strongAreas = {};
    if (!data.weakAreas) data.weakAreas = {};
    if (!data.totalAttempts) data.totalAttempts = 0;
    
    console.log("Full performance data received:", JSON.stringify(data));
    
    const standardizeCategories = (categories: Record<string, number>) => {
      const result: Record<string, number> = {};
      
      Object.entries(categories).forEach(([category, score]) => {
        if (category.includes(' - ')) {
          const [mainCategory, subCategory] = category.split(' - ');
          const standardizedMainCategory = mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1).toLowerCase();
          result[`${standardizedMainCategory} - ${subCategory}`] = score;
        } else {
          const standardizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
          result[standardizedCategory] = score;
        }
      });
      
      return result;
    };
    
    data.strongAreas = standardizeCategories(data.strongAreas);
    data.weakAreas = standardizeCategories(data.weakAreas);
    
    console.log("Standardized categories:", {
      strongAreas: data.strongAreas,
      weakAreas: data.weakAreas
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching performance for ${rollNumber}:`, error);
    toast.error('Failed to fetch performance analysis. Please try again later.');
    return {
      strongAreas: {},
      weakAreas: {},
      totalAttempts: 0,
    };
  }
}

export async function getStudentRecommendations(rollNumber: string): Promise<RecommendationItem[]> {
  try {
    console.log(`Fetching recommendations for student with roll number: ${rollNumber}`);
    const data = await makeRequest<RecommendationItem[]>(`/api/students/${rollNumber}/recommendations`, {
      method: 'GET',
    });
    
    console.log("Raw recommendations data:", JSON.stringify(data));
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    const standardizedData = data.map(item => {
      if (item.category) {
        if (item.category.includes(' - ')) {
          const [mainCategory, subCategory] = item.category.split(' - ');
          item.category = mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1).toLowerCase();
          if (!item.subcategory) {
            item.subcategory = subCategory;
          }
        } else {
          item.category = item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase();
        }
      } else {
        item.category = 'Other';
      }
      return item;
    });
    
    return standardizedData;
  } catch (error) {
    console.error(`Error fetching recommendations for ${rollNumber}:`, error);
    toast.error('Failed to fetch recommendations. Please try again later.');
    return [];
  }
}

export async function getQuizzes(): Promise<Quiz[]> {
  return makeRequest<Quiz[]>('/api/quizzes');
}

export async function getQuizById(id: string): Promise<QuizDetail> {
  return makeRequest<QuizDetail>(`/api/quizzes/${id}`);
}

export async function getQuestionById(questionId: string): Promise<any> {
  try {
    console.log(`Fetching question details for ID: ${questionId}`);
    return await makeRequest<any>(`/api/questions/${questionId}`);
  } catch (error) {
    console.error(`Error fetching question details for ${questionId}:`, error);
    return null;
  }
}

export async function getQuizQuestions(quizId: string): Promise<any[]> {
  try {
    const response = await makeRequest<any>(`/api/quizzes/${quizId}/questions`);
    
    if (response && response.questions && Array.isArray(response.questions)) {
      return response.questions;
    } else if (Array.isArray(response)) {
      return response;
    } else {
      console.warn('Unexpected response structure from getQuizQuestions', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
}

export async function submitStudentQuiz(rollNumber: string, quizData: QuizStudentSubmission): Promise<any> {
  try {
    console.log(`Attempting to submit quiz for student with roll number: ${rollNumber}`);
    console.log("Quiz submission data:", JSON.stringify(quizData));
    
    // Format the data exactly as expected by the backend
    const formattedData = {
      quizId: quizData.quizId,
      timeTaken: quizData.timeTaken,
      responses: quizData.responses.map(response => ({
        questionId: response.questionId,
        selectedOption: Number(response.selectedOption)
      }))
    };
    
    console.log("Formatted submission data:", JSON.stringify(formattedData));
    
    try {
      const result = await makeRequest<any>(`/api/students/${rollNumber}/submit`, {
        method: 'POST',
        body: JSON.stringify(formattedData),
      });
      
      console.log("Quiz submission successful:", result);
      return result;
    } catch (submitError) {
      console.error("Error in primary submission method:", submitError);
      
      // If the primary submission fails, try the fallback method
      console.log(`Using fallback submission endpoint`);
      toast.warning("Using alternative submission method.");
      
      const fallbackSubmission: QuizSubmission = {
        quizId: quizData.quizId,
        answers: quizData.responses.map(response => ({
          questionId: response.questionId,
          selectedOptionId: response.selectedOption.toString()
        }))
      };
      
      console.log("Fallback submission data:", JSON.stringify(fallbackSubmission));
      return await submitQuiz(fallbackSubmission);
    }
  } catch (error) {
    console.error("Complete submission failure:", error);
    throw error;
  }
}

export async function submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
  console.log("Submitting to general endpoint:", submission);
  return makeRequest<QuizResult>('/api/submissions', {
    method: 'POST',
    body: JSON.stringify(submission),
  });
}

export async function getQuizResults(quizId: string): Promise<QuizResult> {
  return makeRequest<QuizResult>(`/api/results/${quizId}`);
}

export async function getStudentData(rollNumber: string): Promise<any> {
  try {
    console.log(`Fetching student data for roll number: ${rollNumber}`);
    const response = await fetch(`${API_BASE_URL}/api/students/${rollNumber}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `API error: ${response.status}`;
      toast.error(errorMessage);
      throw new Error('Failed to fetch student data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching student data:', error);
    toast.error('Failed to load student profile. Please try again later.');
    throw error;
  }
}

export async function updateResourceCompletion(rollNumber: string, resourceId: string, isCompleted: boolean): Promise<any> {
  try {
    if (!resourceId || resourceId.trim() === "") {
      console.error('Resource ID is required');
      toast.error("Missing resource ID");
      throw new Error('Resource ID is required');
    }
    
    console.log(`Updating resource completion for student ${rollNumber}, resource ${resourceId}, status: ${isCompleted}`);
    return makeRequest<any>(`/api/students/${rollNumber}/resources/${resourceId}`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted }),
    });
  } catch (error) {
    console.error('Error updating resource completion status:', error);
    throw error;
  }
}
