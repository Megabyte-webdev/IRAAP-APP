"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../_context/AuthContext";

export const RouteProtector = ({ children }: { children: React.ReactNode }) => {
  const { authDetails, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Wait until auth state is determined

    const userRole = authDetails?.user?.role?.toLowerCase();

    // CASE 1: User is NOT logged in and trying to access a protected page
    if (!authDetails && pathname !== "/login") {
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }

    // CASE 2: User IS logged in but trying to access the login page
    else if (authDetails && pathname === "/login") {
      // Send them to their specific dashboard based on role
      router.replace(`/${userRole || "dashboard"}`);
    }
  }, [authDetails, isLoading, router, pathname]);

  // 1. Show loader while checking session
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-bold text-slate-600">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  // 2. If on login page and NOT logged in, allow viewing the login form
  if (!authDetails && pathname === "/login") {
    return <>{children}</>;
  }

  // 3. If logged in, allow viewing the protected content (children)
  if (authDetails) {
    return <>{children}</>;
  }

  // 4. Default fallback (avoids "blank" screen while redirecting)
  return null;
};
