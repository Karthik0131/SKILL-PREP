import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQuizzes } from "@/api/quizzes";
import QuizCard from "@/components/QuizCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  BarChart2,
  BookOpen,
  User,
  Library,
  TrendingUp,
  Users,
  BookMarked,
  Target,
  Zap,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
  >
    <div
      className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 ${color}`}
    >
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ name, role, content }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
  >
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
        {name.charAt(0)}
      </div>
      <div className="ml-3">
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
    <p className="text-sm italic text-muted-foreground">"{content}"</p>
  </motion.div>
);

const StatCard = ({ icon: Icon, value, label, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center"
  >
    <Icon className={`h-8 w-8 mb-2 ${color}`} />
    <h3 className="text-2xl font-bold">{value}</h3>
    <p className="text-xs text-muted-foreground">{label}</p>
  </motion.div>
);

const LandingPage = () => {
  const {
    data: quizzes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });

  // For featured quizzes section - just show the first 3
  const featuredQuizzes = quizzes?.slice(0, 3) || [];

  return (
    <div className="container px-4 mx-auto">
      {/* Hero Section */}
      <section className="mb-12 text-center pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-skill-dark via-skill to-skill-light">
              Master Your Skills
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Prepare for your next challenge with our carefully crafted quizzes
            designed to test and enhance your knowledge.
          </p>

          <SignedOut>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Link to="/sign-up">
                <Button
                  size="lg"
                  className="bg-skill hover:bg-skill-dark transition-colors w-full sm:w-auto"
                >
                  Get Started
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-all hover:border-skill hover:text-skill w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </SignedOut>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            value="10,000+"
            label="ACTIVE USERS"
            color="text-blue-500"
          />
          <StatCard
            icon={BookMarked}
            value="500+"
            label="UNIQUE QUIZZES"
            color="text-green-500"
          />
          <StatCard
            icon={Target}
            value="95%"
            label="SUCCESS RATE"
            color="text-yellow-500"
          />
          <StatCard
            icon={Zap}
            value="24/7"
            label="LEARNING ACCESS"
            color="text-purple-500"
          />
        </div>
      </section>

      {/* Featured Quizzes */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Quizzes</h2>
          <Link
            to="/quiz"
            className="text-skill hover:text-skill-dark flex items-center"
          >
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-destructive font-medium">
              Failed to load quizzes.
            </p>
            <p className="text-muted-foreground mt-2">
              Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredQuizzes.map((quiz, index) => (
              <QuizCard key={quiz.id || quiz._id} quiz={quiz} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Why Choose Skill-Prep?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform offers comprehensive tools to enhance your skills and
            prepare for your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={BarChart2}
            title="Performance Tracking"
            description="Monitor your progress with detailed analytics and performance insights."
            color="bg-blue-500"
          />
          <FeatureCard
            icon={BookOpen}
            title="Personalized Recommendations"
            description="Get customized suggestions based on your strengths and areas for improvement."
            color="bg-yellow-500"
          />
          <FeatureCard
            icon={Library}
            title="Extensive Resource Library"
            description="Access a vast collection of learning materials and practice exercises."
            color="bg-green-500"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
            <p className="text-muted-foreground">
              Sign up and customize your learning preferences to get started.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <BookMarked className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Take Practice Quizzes
            </h3>
            <p className="text-muted-foreground">
              Challenge yourself with our extensive collection of skill-focused
              quizzes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track & Improve</h3>
            <p className="text-muted-foreground">
              Monitor your progress and receive personalized recommendations to
              improve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            name="Sarah Johnson"
            role="Software Developer"
            content="Skill-Prep helped me ace my technical interviews. The focused quizzes and personalized recommendations were exactly what I needed."
          />
          <TestimonialCard
            name="Michael Chen"
            role="Data Scientist"
            content="I've tried several platforms, but Skill-Prep stands out with its comprehensive resources and intuitive performance tracking."
          />
          <TestimonialCard
            name="Jessica Williams"
            role="Product Manager"
            content="The variety of quizzes across different domains helped me broaden my knowledge and prepare for my career transition."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Advance Your Skills?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who are improving their technical
            knowledge with Skill-Prep.
          </p>

          <SignedOut>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/sign-up">
                <Button
                  size="lg"
                  className="bg-white text-indigo-900 hover:bg-gray-100 transition-colors"
                >
                  Get Started Now
                </Button>
              </Link>
              <Link to="/quiz">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10 transition-colors"
                >
                  Explore Quizzes
                </Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <Link to="/recommendations">
              <Button
                size="lg"
                className="bg-white text-indigo-900 hover:bg-gray-100 transition-colors"
              >
                View My Recommendations
              </Button>
            </Link>
          </SignedIn>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
