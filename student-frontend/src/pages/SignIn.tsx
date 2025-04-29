
import { SignIn as ClerkSignIn, useUser, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent } from "@/api/quizzes";
import { toast } from "sonner";

const SignIn = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const registerStudentInBackend = async () => {
      if (isSignedIn && user) {
        try {
          const studentData = {
            rollno: user.username || "", // Use username as roll number
            name: user.fullName || user.firstName || "", // Fallback to first name
            email: user.primaryEmailAddress?.emailAddress || "",
          };

          console.log("Registering student:", studentData);
          await registerStudent(studentData);
          toast.success("Login successful!");
        } catch (error) {
          console.error("Error registering student:", error);
          // Don't show error toast to users since this is a background operation
        }
      }
    };

    if (isSignedIn) {
      registerStudentInBackend();
    }
  }, [isSignedIn, user]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Sign in to SKILL-PREP
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Continue your journey to master new skills
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="glass dark:glass-dark py-8 px-4 shadow sm:rounded-xl sm:px-10">
          <ClerkSignIn
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-skill hover:bg-skill-dark text-white py-2 px-4 rounded-md transition-all",
                formFieldLabel: "text-foreground",
                formFieldInput: 
                  "border border-border bg-background py-2 px-3 rounded-md w-full transition-all focus:border-skill focus:ring-1 focus:ring-skill",
                footerAction: "text-skill hover:text-skill-dark transition-colors",
                card: "bg-transparent shadow-none"
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
