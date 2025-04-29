
import { SignUp as ClerkSignUp, useUser, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { registerStudent } from "@/api/quizzes";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  // Register the user in our backend when Clerk sign-up is complete
  useEffect(() => {
    const registerUserInBackend = async () => {
      if (!isSignedIn || !user) return;

      try {
        // Extract potential roll number from username or email
        let rollno = "";
        let name = user.fullName || "";
        let email = user.primaryEmailAddress?.emailAddress || "";
        
        if (user.username) {
          rollno = user.username;
        } else if (email) {
          // Try to get roll number from email (e.g., r180999@email.com -> 180999)
          const emailDigits = email.match(/\d+/);
          if (emailDigits) {
            rollno = emailDigits[0];
          } else {
            rollno = email.split('@')[0];
          }
        }

        console.log("Registering user in backend:", { rollno, name, email });
        
        await registerStudent({
          rollno,
          name,
          email
        });
        
        toast.success("Registration complete!");
        navigate("/"); // Redirect to home page after successful registration
      } catch (error) {
        console.error("Error registering user in backend:", error);
        // Don't show error toast to user since it's a background operation
      }
    };

    if (isSignedIn && user) {
      registerUserInBackend();
    }
  }, [isSignedIn, user, navigate]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Start your journey to master new skills
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="glass dark:glass-dark py-8 px-4 shadow sm:rounded-xl sm:px-10">
          <ClerkSignUp
            signInUrl="/sign-in"
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

export default SignUp;
