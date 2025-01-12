// components/ProtectedRoute.js
"use client";

import { useAuth } from '@/app/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  console.log(user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Redirect to the login page if the user is not authenticated
      router.push('/login');
    }
  }, [user, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
