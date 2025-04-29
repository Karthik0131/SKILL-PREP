import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getStudentRecommendations, getStudentPerformance, updateResourceCompletion } from "@/api/quizzes";
import { RecommendationItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BookOpen, CheckCircle2, ExternalLink, ListChecks, ClipboardList } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [rollNumber, setRollNumber] = useState<string | null>(null);
  const [hasAttemptedQuizzes, setHasAttemptedQuizzes] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"todo" | "completed">("todo");

  useEffect(() => {
    if (user) {
      const username = user.username;
      console.log("Using username as roll number:", username);
      setRollNumber(username || null);
    }
  }, [user]);

  const { data: performanceData } = useQuery({
    queryKey: ["performance-analysis", rollNumber],
    queryFn: () => rollNumber ? getStudentPerformance(rollNumber) : Promise.resolve(null),
    enabled: !!rollNumber,
  });

  useEffect(() => {
    if (performanceData && (
      performanceData.totalAttempts > 0 ||
      performanceData.lastAttempt ||
      Object.keys(performanceData.strongAreas || {}).length > 0 ||
      Object.keys(performanceData.weakAreas || {}).length > 0
    )) {
      setHasAttemptedQuizzes(true);
    }
  }, [performanceData]);

  const { 
    data: recommendationsData = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["recommendations", rollNumber],
    queryFn: async () => {
      if (!rollNumber) return Promise.resolve([]);
      
      try {
        const data = await getStudentRecommendations(rollNumber);
        console.log("Recommendations data:", data);
        return data || [];
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        toast.error("Failed to fetch recommendations");
        return [];
      }
    },
    enabled: !!rollNumber && hasAttemptedQuizzes,
    retry: 2
  });
  
  const updateCompletionMutation = useMutation({
    mutationFn: (params: { resourceId: string; isCompleted: boolean }) => {
      if (!params.resourceId || params.resourceId.trim() === "") {
        toast.error("Cannot update: Missing resource ID");
        throw new Error("Resource ID is required");
      }
      return updateResourceCompletion(rollNumber || "", params.resourceId, params.isCompleted);
    },
    onSuccess: () => {
      refetch();
      toast.success(`Resource marked as ${viewMode === "todo" ? "completed" : "to-do"}`);
    },
    onError: (error: Error) => {
      console.error("Error updating resource status:", error);
      toast.error(`Failed to update resource status: ${error.message || "Unknown error"}`);
    }
  });

  const handleToggleCompletion = (resourceId: string, currentStatus: boolean) => {
    if (!resourceId || resourceId.trim() === "") {
      console.error("Invalid resource ID provided to handleToggleCompletion:", resourceId);
      toast.error("Cannot update: Missing resource ID");
      return;
    }
    
    console.log(`Toggling completion for resource ${resourceId}, current status: ${currentStatus}`);
    updateCompletionMutation.mutate({
      resourceId,
      isCompleted: !currentStatus
    });
  };

  const recommendations = useMemo(() => {
    return Array.isArray(recommendationsData) ? recommendationsData : [];
  }, [recommendationsData]);

  const normalizeCategory = (category: string | undefined): string => {
    if (!category) return 'Other';
    
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  const organizedRecommendations = useMemo(() => {
    const todoItems: Record<string, Record<string, RecommendationItem[]>> = {};
    const completedItems: Record<string, Record<string, RecommendationItem[]>> = {};
    
    ['Coding', 'Aptitude', 'Verbal'].forEach(category => {
      todoItems[category] = {};
      completedItems[category] = {};
    });

    recommendations.forEach(recommendation => {
      if (!recommendation) return;
      
      const category = normalizeCategory(recommendation.category);
      const subcategory = recommendation.subcategory || 'General';
      const targetCollection = recommendation.isCompleted ? completedItems : todoItems;
      
      if (!targetCollection[category]) {
        targetCollection[category] = {};
      }
      
      if (!targetCollection[category][subcategory]) {
        targetCollection[category][subcategory] = [];
      }
      
      targetCollection[category][subcategory].push(recommendation);
    });
    
    return { todoItems, completedItems };
  }, [recommendations]);
  
  const { todoItems, completedItems } = organizedRecommendations;
  
  const currentItems = viewMode === "todo" ? todoItems : completedItems;
  
  const activeCategories = useMemo(() => {
    return Object.keys(currentItems).filter(category => 
      Object.values(currentItems[category]).some(items => items.length > 0)
    );
  }, [currentItems]);

  const defaultCategory = activeCategories.length > 0 ? activeCategories[0] : 'Coding';
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);

  const todoCount = useMemo(() => 
    Object.values(todoItems).reduce((sum, category) => 
      sum + Object.values(category).reduce((catSum, items) => catSum + items.length, 0), 0
    )
  , [todoItems]);

  const completedCount = useMemo(() => 
    Object.values(completedItems).reduce((sum, category) => 
      sum + Object.values(category).reduce((catSum, items) => catSum + items.length, 0), 0
    )
  , [completedItems]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasAttemptedQuizzes) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-4">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Quiz Data Available</h1>
        <p className="text-muted-foreground text-center mb-6">
          You haven't attempted any quizzes yet. Complete some quizzes to get personalized recommendations.
        </p>
        <Button onClick={() => navigate("/")}>
          Take a Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Learning Recommendations</h1>
          <p className="text-muted-foreground">Personalized resources to improve your skills</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "todo" | "completed")}>
            <ToggleGroupItem value="todo" className="flex gap-1 items-center">
              <ClipboardList className="h-4 w-4" />
              <span>To-Do <Badge variant="outline">{todoCount}</Badge></span>
            </ToggleGroupItem>
            <ToggleGroupItem value="completed" className="flex gap-1 items-center">
              <ListChecks className="h-4 w-4" />
              <span>Completed <Badge variant="outline">{completedCount}</Badge></span>
            </ToggleGroupItem>
          </ToggleGroup>

          <Button onClick={() => navigate("/performance")} variant="outline">
            View Performance
          </Button>
        </div>
      </div>
      
      {(todoCount === 0 && viewMode === "todo") && (
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-medium mb-2">All Resources Completed!</h2>
            <p className="text-center text-muted-foreground mb-6">
              You have completed all recommended resources. Check the completed tab to review them.
            </p>
          </CardContent>
        </Card>
      )}
      
      {(completedCount === 0 && viewMode === "completed") && (
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No Completed Resources</h2>
            <p className="text-center text-muted-foreground mb-6">
              You haven't marked any resources as complete yet. Mark resources as complete in the To-Do section to see them here.
            </p>
            <Button onClick={() => setViewMode("todo")} className="bg-skill hover:bg-skill-dark">
              View To-Do Resources
            </Button>
          </CardContent>
        </Card>
      )}
      
      {activeCategories.length > 0 ? (
        <>
          <Tabs defaultValue={selectedCategory} value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="mb-6">
              {activeCategories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {activeCategories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="space-y-8">
                  {Object.keys(currentItems[category]).map(subcategory => {
                    const items = currentItems[category][subcategory];
                    if (items.length === 0) return null;
                    
                    return (
                      <div key={subcategory} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{subcategory}</h3>
                          <Badge variant="outline">{items.length}</Badge>
                          <Separator className="flex-1" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {items.map((recommendation, idx) => (
                            <Card key={idx} className={`overflow-hidden border-l-4 transition-all hover:shadow-md ${viewMode === "todo" ? "border-l-skill" : "border-l-green-500"}`}>
                              <CardHeader className="bg-secondary/10 pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-lg">{recommendation.quizTitle || subcategory}</CardTitle>
                                    <CardDescription>
                                      {category} - {subcategory}
                                    </CardDescription>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      if (recommendation.resourceId) {
                                        handleToggleCompletion(recommendation.resourceId, !!recommendation.isCompleted);
                                      } else {
                                        toast.error("Cannot update: Missing resource ID");
                                        console.error("Missing _id in recommendation object:", recommendation);
                                      }
                                    }}
                                    className={`rounded-full h-8 w-8 p-0 ${updateCompletionMutation.isPending ? 'opacity-50' : ''}`}
                                    disabled={updateCompletionMutation.isPending}
                                  >
                                    <CheckCircle2 className={`h-5 w-5 ${viewMode === "completed" ? "text-green-500 fill-green-500" : ""}`} />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4">
                                <p className="mb-3 text-sm">{recommendation.recommendation}</p>
                              </CardContent>
                              <CardFooter className="pt-0 pb-3 px-4 flex justify-between">
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto text-skill" 
                                  asChild
                                >
                                  <a 
                                    href={recommendation.resourceLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Open Resource
                                  </a>
                                </Button>
                                {recommendation.score !== undefined && (
                                  <Badge variant="outline">Score: {recommendation.score}</Badge>
                                )}
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No {viewMode === "todo" ? "Pending" : "Completed"} Resources</h2>
            <p className="text-center text-muted-foreground mb-6">
              {viewMode === "todo" 
                ? "You don't have any pending resources to work on." 
                : "You haven't marked any resources as complete yet."}
            </p>
            {viewMode === "completed" && (
              <Button onClick={() => setViewMode("todo")} className="bg-skill hover:bg-skill-dark">
                View To-Do Resources
              </Button>
            )}
            {viewMode === "todo" && completedCount > 0 && (
              <Button onClick={() => setViewMode("completed")} className="bg-skill hover:bg-skill-dark">
                View Completed Resources
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecommendationsPage;