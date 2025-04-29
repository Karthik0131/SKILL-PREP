import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQuizzes } from "@/api/quizzes";
import QuizCard from "@/components/QuizCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter, SlidersHorizontal, Tag, X } from "lucide-react";

const QuizzesPage = () => {
  const {
    data: quizzes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique category + subcategory values
  const categories = quizzes
    ? [...new Set(quizzes.map((quiz) => quiz.category).filter(Boolean))]
    : [];

  // Filter quizzes
  const filteredQuizzes = quizzes
    ? quizzes.filter((quiz) => {
        const matchesSearch =
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (quiz.description &&
            quiz.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const quizTags = [quiz.category, quiz.subcategory].filter(Boolean);
        const matchesCategories =
          selectedCategories.length === 0 ||
          selectedCategories.some((cat) => quizTags.includes(cat));

        return matchesSearch && matchesCategories;
      })
    : [];

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
  };

  return (
    <div className="container px-4 mx-auto py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Explore All Quizzes</h1>
        <p className="text-muted-foreground">
          Discover quizzes tailored to enhance your skills and knowledge
        </p>
      </motion.div>

      {/* Search and Filter Toggle */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="🔍 Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-skill focus:border-skill"
            />
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" /> */}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-4"
          >
            <Label className="mb-2 block">Categories & Subcategories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                    selectedCategories.includes(category)
                      ? "bg-skill text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <Tag className="h-3 w-3" />
                  {category}
                  {selectedCategories.includes(category) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Active Filters */}
        {(selectedCategories.length > 0 || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>

            {searchTerm && (
              <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <span>Search: {searchTerm}</span>
                <button onClick={() => setSearchTerm("")}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {selectedCategories.map((cat) => (
              <div
                key={cat}
                className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                <span>{cat}</span>
                <button onClick={() => toggleCategory(cat)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            <button
              onClick={clearFilters}
              className="text-xs text-skill underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredQuizzes.length}{" "}
        {filteredQuizzes.length === 1 ? "quiz" : "quizzes"}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-destructive/10 rounded-lg border border-destructive/20">
          <p className="text-destructive font-medium">
            Failed to load quizzes.
          </p>
          <p className="text-muted-foreground mt-2">Please try again later.</p>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <Button onClick={clearFilters}>Clear all filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id || quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <QuizCard quiz={quiz} index={index} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
export default QuizzesPage;
