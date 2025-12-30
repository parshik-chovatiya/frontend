"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken || !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if user has completed onboarding
    if (user && !user.is_onboarded) {
      router.push('/onboarding');
    }
  }, [isAuthenticated, user, router]);

  // Show loading or nothing while checking auth
  if (!isAuthenticated || !user?.is_onboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}