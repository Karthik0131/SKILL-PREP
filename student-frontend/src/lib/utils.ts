
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useUser } from "@clerk/clerk-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractRollNumber(user: ReturnType<typeof useUser>["user"] | null): string {
  if (!user) return "";
  
  // Use the full username as the roll number
  if (user.username) {
    return user.username;
  }
  
  // Fallback to email if username is not available
  if (user.primaryEmailAddress?.emailAddress) {
    const email = user.primaryEmailAddress.emailAddress;
    return email.split('@')[0];
  }
  
  // Last resort: use ID
  return user.id;
}
