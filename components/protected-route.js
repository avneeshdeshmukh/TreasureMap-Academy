// components/ProtectedRoute.js
"use client";

import { useAuth } from '@/app/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();  // Get loading state
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login'); // Use replace to prevent back navigation
    }
  }, [user, loading, router]);

  // Prevent rendering until authentication is resolved
  if (loading) {
    return null;  // or replace with a loading UI
  }

  if (!user) {
    return null; // Prevent rendering children before redirect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
