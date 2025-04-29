import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getStudentPerformance, getStudentQuizHistory } from "@/api/quizzes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  AlertCircle, LineChart as LineChartIcon, BookOpen, 
  Award, Clock, BarChartHorizontal 
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { extractRollNumber } from "@/lib/utils";
import { toast } from "sonner";
import { PerformanceAnalysisResponse } from "@/types";
import SubcategoryBarChart from "@/components/SubcategoryBarChart";

const CATEGORIES = ['Coding', 'Aptitude', 'Verbal'];
const CATEGORY_COLORS = {
  Coding: '#3b82f6', // blue
  Aptitude: '#10b981', // green
  Verbal: '#8b5cf6'  // purple
};

const PerformanceAnalysisPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [rollNumber, setRollNumber] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      const extractedRoll = extractRollNumber(user);
      console.log("Extracted roll number:", extractedRoll);
      setRollNumber(extractedRoll);
    }
  }, [user]);

  const defaultEmptyPerformance: PerformanceAnalysisResponse = {
    strongAreas: {},
    weakAreas: {},
    totalAttempts: 0,
    lastAttempt: undefined
  };

  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ["performance-analysis", rollNumber],
    queryFn: () => rollNumber ? getStudentPerformance(rollNumber) : Promise.resolve(defaultEmptyPerformance),
    enabled: !!rollNumber,
    staleTime: 0,
    retry: 2
  });
  
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["quiz-history", rollNumber],
    queryFn: () => rollNumber ? getStudentQuizHistory(rollNumber) : Promise.resolve([]),
    enabled: !!rollNumber,
    staleTime: 0,
    retry: 2
  });

  const quizHistory = useMemo(() => {
    if (historyData && Array.isArray(historyData)) {
      return historyData;
    } else if (historyData && historyData.quizHistory && Array.isArray(historyData.quizHistory)) {
      return historyData.quizHistory;
    }
    return [];
  }, [historyData]);

  const isLoading = performanceLoading || historyLoading;

  useEffect(() => {
    console.log("Performance data:", performanceData);
    console.log("Quiz history:", quizHistory);
  }, [performanceData, quizHistory]);

  const getCategoryAttemptsData = () => {
    const attemptCounts: Record<string, number> = {
      Coding: 0,
      Aptitude: 0, 
      Verbal: 0
    };

    if (quizHistory && quizHistory.length > 0) {
      quizHistory.forEach(quiz => {
        if (!quiz || !quiz.category) return;
        
        const mainCategory = quiz.category.split(' - ')[0];
        const normalizedCategory = mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1).toLowerCase();
        
        if (normalizedCategory in attemptCounts) {
          attemptCounts[normalizedCategory]++;
        }
      });
    } else if (performanceData) {
      Object.keys(performanceData.strongAreas || {}).forEach(category => {
        const mainCategory = category.split(' - ')[0];
        const normalizedCategory = mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1).toLowerCase();
        
        if (normalizedCategory in attemptCounts) {
          attemptCounts[normalizedCategory]++;
        }
      });
      
      Object.keys(performanceData.weakAreas || {}).forEach(category => {
        const mainCategory = category.split(' - ')[0];
        const normalizedCategory = mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1).toLowerCase();
        
        if (normalizedCategory in attemptCounts) {
          attemptCounts[normalizedCategory]++;
        }
      });
    }
    
    console.log("Category attempt counts:", attemptCounts);
    
    return Object.entries(attemptCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || '#888888'
      }));
  };

  const getCategoryLineData = () => {
    const categoryWiseScores = {
      Coding: [] as {attempt: number, score: number}[],
      Aptitude: [] as {attempt: number, score: number}[],
      Verbal: [] as {attempt: number, score: number}[]
    };
    
    if (quizHistory && quizHistory.length > 0) {
      let codingAttempt = 1,
          aptitudeAttempt = 1,
          verbalAttempt = 1;
      
      const sortedHistory = [...quizHistory].sort((a, b) => {
        const dateA = new Date(a.completedAt || a.attemptedAt || 0).getTime();
        const dateB = new Date(b.completedAt || b.attemptedAt || 0).getTime();
        return dateA - dateB;
      });
      
      sortedHistory.forEach(quiz => {
        if (!quiz || !quiz.category || typeof quiz.score !== 'number') return;
        
        const categoryParts = quiz.category.split(' - ');
        const mainCategory = categoryParts[0].charAt(0).toUpperCase() + categoryParts[0].slice(1).toLowerCase();
        
        const actualScore = quiz.score;
        
        if (mainCategory === "Coding") {
          categoryWiseScores.Coding.push({
            attempt: codingAttempt++,
            score: actualScore
          });
        } else if (mainCategory === "Aptitude") {
          categoryWiseScores.Aptitude.push({
            attempt: aptitudeAttempt++,
            score: actualScore
          });
        } else if (mainCategory === "Verbal") {
          categoryWiseScores.Verbal.push({
            attempt: verbalAttempt++,
            score: actualScore
          });
        }
      });
    }
    
    console.log("Category-wise scores for line chart:", categoryWiseScores);
    return categoryWiseScores;
  };

  const getSubcategoryBreakdown = () => {
    if (!selectedCategory) {
      console.log("No quiz history data available for", selectedCategory, "subcategory breakdown");
      return [];
    }
    
    const subcategoryData: Record<string, { total: number, count: number }> = {};
    
    if (quizHistory && quizHistory.length > 0) {
      quizHistory.forEach(quiz => {
        if (!quiz || !quiz.category || typeof quiz.score !== 'number') return;
        
        const categoryParts = quiz.category.split(' - ');
        const mainCategory = categoryParts[0].charAt(0).toUpperCase() + categoryParts[0].slice(1).toLowerCase();
        
        if (mainCategory === selectedCategory) {
          let subcategory = "";
          
          if (quiz.subcategory) {
            subcategory = quiz.subcategory;
          } else if (categoryParts.length > 1) {
            subcategory = categoryParts[1];
          } else {
            subcategory = "General";
          }
          
          if (!subcategoryData[subcategory]) {
            subcategoryData[subcategory] = { total: 0, count: 0 };
          }
          
          subcategoryData[subcategory].total += quiz.score;
          subcategoryData[subcategory].count += 1;
        }
      });
    }
    
    if (Object.keys(subcategoryData).length === 0 && performanceData) {
      Object.entries(performanceData.strongAreas || {}).forEach(([category, score]) => {
        const categoryParts = category.split(' - ');
        const mainCategory = categoryParts[0].charAt(0).toUpperCase() + categoryParts[0].slice(1).toLowerCase();
        
        if (mainCategory === selectedCategory) {
          let subcategory = categoryParts.length > 1 ? categoryParts[1] : "General";
          
          if (!subcategoryData[subcategory]) {
            subcategoryData[subcategory] = { total: 0, count: 0 };
          }
          if (typeof score === 'number') {
            subcategoryData[subcategory].total += score;
          }
          subcategoryData[subcategory].count += 1;
        }
      });
      
      Object.entries(performanceData.weakAreas || {}).forEach(([category, score]) => {
        const categoryParts = category.split(' - ');
        const mainCategory = categoryParts[0].charAt(0).toUpperCase() + categoryParts[0].slice(1).toLowerCase();
        
        if (mainCategory === selectedCategory) {
          let subcategory = categoryParts.length > 1 ? categoryParts[1] : "General";
          
          if (!subcategoryData[subcategory]) {
            subcategoryData[subcategory] = { total: 0, count: 0 };
          }
          if (typeof score === 'number') {
            subcategoryData[subcategory].total += score;
          }
          subcategoryData[subcategory].count += 1;
        }
      });
    }
    
    console.log(`Subcategory data for ${selectedCategory}:`, subcategoryData);
    
    if (Object.keys(subcategoryData).length > 0) {
      return Object.entries(subcategoryData).map(([name, data]) => {
        const actualScore = data.count > 0 ? Math.round(data.total / data.count) : 0;
        
        let maxScore = 10;
        
        if (quizHistory && quizHistory.length > 0) {
          const relevantQuizzes = quizHistory.filter(quiz => {
            if (!quiz || !quiz.category) return false;
            
            const categoryParts = quiz.category.split(' - ');
            const mainCategory = categoryParts[0].charAt(0).toUpperCase() + categoryParts[0].slice(1).toLowerCase();
            const quizSubcategory = quiz.subcategory || (categoryParts.length > 1 ? categoryParts[1] : "General");
            
            return mainCategory === selectedCategory && quizSubcategory === name;
          });
          
          if (relevantQuizzes.length > 0) {
            maxScore = Math.max(...relevantQuizzes.map(quiz => quiz.totalMarks || 10));
          }
        }
        
        return {
          name,
          actualScore,
          averageScore: actualScore,
          maxScore: maxScore,
          color: CATEGORY_COLORS[selectedCategory as keyof typeof CATEGORY_COLORS] || '#888888'
        };
      });
    }
    
    console.log(`No subcategory data available for ${selectedCategory}`);
    return [];
  };

  const calculateAverageScore = () => {
    if (quizHistory && quizHistory.length > 0) {
      let totalScore = 0;
      let totalPossibleScore = 0;
      
      quizHistory.forEach(quiz => {
        if (!quiz || typeof quiz.score !== 'number') return;
        
        totalScore += quiz.score;
        totalPossibleScore += (quiz.totalMarks || 10);
      });
      
      if (totalPossibleScore > 0) {
        const avgScorePercentage = Math.round((totalScore / totalPossibleScore) * 100);
        console.log("Average score calculated:", avgScorePercentage, "% (", totalScore, "/", totalPossibleScore, ")");
        return avgScorePercentage;
      }
    }
    
    if (performanceData) {
      const strongScores = Object.values(performanceData.strongAreas || {})
        .reduce((sum, score) => {
          const numScore = typeof score === 'number' ? score : 0;
          return sum + numScore;
        }, 0);
      
      const weakScores = Object.values(performanceData.weakAreas || {})
        .reduce((sum, score) => {
          const numScore = typeof score === 'number' ? score : 0;
          return sum + numScore;
        }, 0);
      
      const totalCategories = Object.keys(performanceData.strongAreas || {}).length + 
        Object.keys(performanceData.weakAreas || {}).length;
      
      if (totalCategories > 0) {
        return Math.round((strongScores + weakScores) / totalCategories);
      }
      
      if (performanceData.lastAttempt) {
        return Math.round(performanceData.lastAttempt.score);
      }
    }
    
    return 0;
  };

  const calculateTotalTime = () => {
    if (quizHistory && quizHistory.length > 0) {
      return quizHistory.reduce((sum, quiz) => {
        if (!quiz || typeof quiz.timeTaken !== 'number') return sum;
        return sum + quiz.timeTaken;
      }, 0);
    }
    
    if (performanceData?.lastAttempt?.timeTaken) {
      return performanceData.lastAttempt.timeTaken;
    }
    
    return 0;
  };

  const calculateTotalAttempts = () => {
    if (quizHistory && quizHistory.length > 0) {
      return quizHistory.length;
    }
    
    if (performanceData?.totalAttempts) {
      return performanceData.totalAttempts;
    }
    
    return 0;
  };

  const categoryAttemptsData = getCategoryAttemptsData();
  const categoryLineData = getCategoryLineData();
  const totalTime = calculateTotalTime();
  const avgScore = calculateAverageScore();
  const totalAttempts = calculateTotalAttempts();
  const subcategoryData = getSubcategoryBreakdown();

  useEffect(() => {
    if (!selectedCategory && categoryAttemptsData.length > 0) {
      const mostAttemptedCategory = categoryAttemptsData.reduce(
        (prev, current) => (current.value > prev.value ? current : prev),
        categoryAttemptsData[0]
      );
      setSelectedCategory(mostAttemptedCategory.name);
    } else if (!selectedCategory && performanceData) {
      const strongCategories = Object.keys(performanceData.strongAreas || {});
      const weakCategories = Object.keys(performanceData.weakAreas || {});
      
      if (strongCategories.length > 0) {
        const firstCategory = strongCategories[0].split(' - ')[0];
        const normalizedCategory = firstCategory.charAt(0).toUpperCase() + firstCategory.slice(1).toLowerCase();
        setSelectedCategory(normalizedCategory);
      } else if (weakCategories.length > 0) {
        const firstCategory = weakCategories[0].split(' - ')[0];
        const normalizedCategory = firstCategory.charAt(0).toUpperCase() + firstCategory.slice(1).toLowerCase();
        setSelectedCategory(normalizedCategory);
      } else {
        console.log("No data available, defaulting to first category:", CATEGORIES[0]);
        setSelectedCategory(CATEGORIES[0]);
      }
    }
  }, [categoryAttemptsData, performanceData, selectedCategory]);

  const hasAttemptedQuizzes = () => {
    if (quizHistory && quizHistory.length > 0) {
      return true;
    }
    
    if (performanceData && (
      performanceData.totalAttempts > 0 ||
      performanceData.lastAttempt ||
      Object.keys(performanceData.strongAreas || {}).length > 0 ||
      Object.keys(performanceData.weakAreas || {}).length > 0
    )) {
      return true;
    }
    
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasAttemptedQuizzes()) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-4">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Quiz Data Available</h1>
        <p className="text-muted-foreground text-center mb-6">
          You haven't attempted any quizzes yet. Complete some quizzes to view your performance analysis.
        </p>
        <Button onClick={() => navigate("/")}>
          Take a Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Performance Analysis</h1>
          <p className="text-muted-foreground">Detailed insights into your quiz performance</p>
        </div>
        <Button onClick={() => navigate("/recommendations")} className="bg-skill hover:bg-skill-dark">
          <BookOpen className="mr-2 h-4 w-4" />
          View Recommendations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Award className="mr-2 h-5 w-5 text-amber-500" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center my-4">
              <span className="text-4xl font-bold text-skill">{avgScore}%</span>
            </div>
            <Progress value={avgScore} className="h-2 mb-2" max={100} />
            <p className="text-sm text-muted-foreground text-center mt-2">
              Across {totalAttempts} quizzes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <BarChartHorizontal className="mr-2 h-5 w-5 text-blue-500" />
              Quiz Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryAttemptsData.length > 0 ? categoryAttemptsData : [
                      { name: 'No Data', value: 1, color: '#d1d5db' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(categoryAttemptsData.length > 0 ? categoryAttemptsData : [
                      { name: 'No Data', value: 1, color: '#d1d5db' }
                    ]).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} attempts`, `${name}`]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Clock className="mr-2 h-5 w-5 text-indigo-500" />
              Time Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center">
              <span className="text-4xl font-bold">
                {Math.floor(totalTime / 60)}m {totalTime % 60}s
              </span>
              <p className="text-sm text-muted-foreground mt-2">Total quiz time</p>
            </div>
            <div className="mt-4 text-center">
              {totalTime > 0 && totalAttempts > 0 && (
                <>
                  <span className="text-xl font-medium">
                    {Math.floor((totalTime / totalAttempts) / 60)}m {Math.floor((totalTime / totalAttempts) % 60)}s
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">Average per quiz</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
          <CardDescription>
            Click on a category to see detailed subcategory breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => {
              const categoryData = categoryLineData[category as keyof typeof categoryLineData];
              const hasData = categoryData && categoryData.length > 0;
              
              return (
                <Card 
                  key={category}
                  className={`cursor-pointer transition hover:shadow-md ${selectedCategory === category ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <LineChartIcon className="mr-2 h-4 w-4" style={{ color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] }} />
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={hasData ? categoryData : [
                            { attempt: 1, score: 0 }, { attempt: 2, score: 0 }
                          ]}
                          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis 
                            dataKey="attempt" 
                            label={{ value: 'Attempt', position: 'insideBottom', offset: -10 }} 
                          />
                          <YAxis 
                            domain={[0, 10]} 
                            label={{ value: 'Score', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip 
                            formatter={(value) => [`${value}`, 'Score']}
                            labelFormatter={(label) => `Attempt ${label}`}
                            content={hasData ? undefined : () => null}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke={CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]} 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            hide={!hasData}
                            connectNulls
                          />
                          {!hasData && (
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground">
                              No data available
                            </text>
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-center mt-2 text-muted-foreground">
                      {categoryData ? categoryData.length : 0} attempts
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedCategory && (
        <SubcategoryBarChart 
          data={subcategoryData} 
          selectedCategory={selectedCategory} 
        />
      )}
    </div>
  );
};

export default PerformanceAnalysisPage;
