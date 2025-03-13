import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Admin Portal</h1>
      
      {/* Show Sign In / Sign Up if NOT signed in */}
      <SignedOut>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="px-4 py-2 bg-green-600 text-white rounded">Sign Up</button>
          </SignUpButton>
        </div>
      </SignedOut>

      {/* Show Dashboard Link and UserButton if signed in */}
      <SignedIn>
        <UserButton />
        <Link to="/dashboard" className="px-4 py-2 bg-gray-800 text-white rounded">
          Go to Dashboard
        </Link>
      </SignedIn>
    </div>
  );
}
