
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3"
};

const LoadingSpinner = ({ className, size = "md" }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-primary border-t-transparent",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
