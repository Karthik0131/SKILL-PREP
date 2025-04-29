
import { useEffect, useCallback } from 'react';
import { toast } from "sonner";

interface QuizSecurityHandlerProps {
  isActive: boolean;
  onQuizSubmit: () => void;
}

const QuizSecurityHandler = ({ isActive, onQuizSubmit }: QuizSecurityHandlerProps) => {
  // Handle context menu (right click)
  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (isActive) {
      e.preventDefault();
      e.stopPropagation();
      
      // Don't trigger quiz submission on right-click, just prevent the menu
      toast.warning("Right-clicking is disabled during the quiz", {
        duration: 1500
      });
      
      return false;
    }
  }, [isActive]);

  // Handle tab visibility change
  const handleVisibilityChange = useCallback(() => {
    if (isActive && document.visibilityState === 'hidden') {
      toast.warning("Tab switching detected! Quiz will be submitted.", {
        duration: 800 // 0.8 second duration
      });
      
      // Give time for the state to update before submission
      setTimeout(() => {
        onQuizSubmit();
      }, 1000);
    }
  }, [isActive, onQuizSubmit]);

  useEffect(() => {
    if (isActive) {
      // Set up event listeners
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, handleContextMenu, handleVisibilityChange]);

  return null; // This is a non-visual component
};

export default QuizSecurityHandler;
