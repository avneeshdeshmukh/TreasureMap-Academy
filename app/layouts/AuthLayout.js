"use client";

import { useAuth } from "@/app/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const AuthLayout = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (user === null) {
      // Only redirect if there's no user (i.e., the user is not logged in)
      setLoading(false); // Done loading before redirection
      router.push("/login");
    } else {
      setLoading(false); // Done loading once we confirm user is authenticated
    }
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>; // Show loading until we confirm auth state
  }

  return <>{children}</>;
};
