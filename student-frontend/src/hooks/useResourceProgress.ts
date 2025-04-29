
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

interface ProgressState {
  [resourceId: string]: boolean;
}

export const useResourceProgress = () => {
  const { user } = useUser();
  const [progress, setProgress] = useState<ProgressState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const userId = user?.id || 'guest';
  const storageKey = `progress_${userId}`;

  // Load progress from localStorage on component mount
  useEffect(() => {
    if (user) {
      try {
        const storedProgress = localStorage.getItem(storageKey);
        if (storedProgress) {
          setProgress(JSON.parse(storedProgress));
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading progress:', error);
        setIsLoaded(true);
      }
    }
  }, [user, storageKey]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && user) {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [progress, isLoaded, storageKey, user]);

  // Check if a resource is marked as completed
  const isCompleted = (resourceId: string): boolean => {
    return progress[resourceId] === true;
  };

  // Mark a resource as completed
  const markAsCompleted = (resourceId: string) => {
    setProgress(prev => ({
      ...prev,
      [resourceId]: true
    }));
  };

  // Mark a resource as not completed
  const markAsIncomplete = (resourceId: string) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[resourceId];
      return newProgress;
    });
  };

  // Toggle the completion status of a resource
  const toggleCompletion = (resourceId: string) => {
    if (isCompleted(resourceId)) {
      markAsIncomplete(resourceId);
    } else {
      markAsCompleted(resourceId);
    }
  };

  // Get the completion count for a category's subtopics
  const getCategoryProgress = (categoryId: string, subtopics: { id: string; resources: { id: string }[] }[]) => {
    let completed = 0;
    let total = 0;

    subtopics.forEach(subtopic => {
      subtopic.resources.forEach(resource => {
        total++;
        if (isCompleted(`${categoryId}-${subtopic.id}-${resource.id}`)) {
          completed++;
        }
      });
    });

    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  // Get the completion count for a subtopic's resources
  const getSubtopicProgress = (categoryId: string, subtopicId: string, resources: { id: string }[]) => {
    let completed = 0;
    const total = resources.length;

    resources.forEach(resource => {
      if (isCompleted(`${categoryId}-${subtopicId}-${resource.id}`)) {
        completed++;
      }
    });

    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  return {
    isCompleted,
    markAsCompleted,
    markAsIncomplete,
    toggleCompletion,
    getCategoryProgress,
    getSubtopicProgress,
    isLoaded
  };
};
