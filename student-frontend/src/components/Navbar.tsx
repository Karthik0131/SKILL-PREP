import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  BarChart2,
  BookOpen,
  User,
  Library,
  CodeXml,
  BrainCircuit,
  House,
} from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-indi w-full transition-all duration-200 ${
        isScrolled
          ? "backdrop-blur-lg bg-background/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-skill-dark to-skill bg-clip-text text-transparent mr-1 flex items-center">
                  <CodeXml className="mr-2 text-blue-900" />
                  SKILL-PREP
                </span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-skill transition-colors flex items-center"
            >
              <House className="h-4 w-4 mr-1" />
              Home
            </Link>
            <SignedIn>
              <Link
                to="/quiz"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-skill transition-colors flex items-center"
              >
                <BrainCircuit className="h-4 w-4 mr-1" />
                Quizzes
              </Link>
              <Link
                to="/performance"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-skill transition-colors flex items-center"
              >
                <BarChart2 className="h-4 w-4 mr-1" />
                Performance
              </Link>
              <Link
                to="/recommendations"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-skill transition-colors flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Recommendations
              </Link>
              <Link
                to="/resources"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-skill transition-colors flex items-center"
              >
                <Library className="h-4 w-4 mr-1" />
                Resources
              </Link>
              <Link
                to="/profile"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-skill transition-colors flex items-center"
              >
                <User className="h-4 w-4 mr-1" />
                Profile
              </Link>
            </SignedIn>
            <SignedOut>
              <div className="ml-4 flex items-center space-x-3">
                <Link to="/sign-in">
                  <Button
                    variant="outline"
                    className="transition-all hover:border-skill hover:text-skill"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="bg-skill hover:bg-skill-dark transition-colors">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="ml-4">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <SignedIn>
              <div className="mr-4">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            </SignedIn>
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-background hover:text-skill focus:outline-none focus:ring-2 focus:ring-inset focus:ring-skill-light"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-gradient-to-r from-skill-dark/90 to-skill/90 backdrop-blur-lg"
        >
          <div className="space-y-1 px-4 py-5">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <SignedIn>
              <Link
                to="/performance"
                className="block px-3 py-2 text-base font-medium text-white hover:text-gray-200 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Performance
              </Link>
              <Link
                to="/recommendations"
                className="block px-3 py-2 text-base font-medium text-white hover:text-gray-200 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Recommendations
              </Link>
              <Link
                to="/resources"
                className="block px-3 py-2 text-base font-medium text-white hover:text-gray-200 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Library className="h-4 w-4 mr-2" />
                Resources
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 text-base font-medium text-white hover:text-gray-200 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </SignedIn>
            <SignedOut>
              <div className="mt-4 flex flex-col space-y-3">
                <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white/10 transition-all"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-white text-skill hover:bg-gray-200 transition-colors">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </SignedOut>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
