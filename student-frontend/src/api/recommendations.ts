
import { RecommendationItem } from "@/types";

// Function to fetch recommendations for a student
export const getRecommendations = async (rollNumber: string): Promise<RecommendationItem[]> => {
  try {
    // In a real implementation, this would make an API call to a backend
    // For now, we'll return mock data
    const response = await fetch(`/api/recommendations/${rollNumber}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    
    // Return mock data if API call fails
    return [
      {
        resourceId: "rec1",
        category: "Data Structures",
        subcategory: "Arrays",
        recommendation: "Practice more array manipulation problems",
        resourceLink: "https://leetcode.com/tag/array/",
        isCompleted: false
      },
      {
        resourceId: "rec2",
        category: "Algorithms",
        subcategory: "Sorting",
        recommendation: "Review quick sort algorithm",
        resourceLink: "https://www.geeksforgeeks.org/quick-sort/",
        isCompleted: false
      },
      {
        resourceId: "rec3",
        category: "Programming",
        subcategory: "JavaScript",
        recommendation: "Learn about closures and scoping",
        resourceLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
        isCompleted: true
      }
    ];
  }
};

// Function to mark a resource as complete
export const markResourceAsComplete = async (resourceId: string): Promise<void> => {
  if (!resourceId) {
    throw new Error("Resource ID is required");
  }
  
  try {
    // In a real implementation, this would make an API call to a backend
    // For now, we'll just simulate a successful response
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Resource ${resourceId} marked as complete`);
    
    // In a real implementation, this would be:
    // const response = await fetch(`/api/recommendations/mark-complete/${resourceId}`, {
    //   method: 'POST'
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to mark resource as complete');
    // }
    
    return;
  } catch (error) {
    console.error("Error marking resource as complete:", error);
    throw error;
  }
};
