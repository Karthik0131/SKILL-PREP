
import { useNavigate } from "react-router-dom";
import { ChevronLeft, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceNavigationProps {
  title: string;
  back?: string;
  home?: boolean;
}

const ResourceNavigation = ({ title, back, home = true }: ResourceNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center mb-6">
      <div className="flex items-center space-x-2">
        {back && (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 mr-2 hover:bg-transparent hover:text-skill"
            onClick={() => navigate(back)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        )}
        {home && (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 hover:bg-transparent hover:text-skill"
            onClick={() => navigate("/resources")}
          >
            <HomeIcon className="h-4 w-4" />
            <span>Resources Home</span>
          </Button>
        )}
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};

export default ResourceNavigation;
