"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../_services/auth.service";
import { useRouter } from "next/navigation";
import { extractErrorMessage } from "../_lib/utils";
import { onFailure, onPrompt, onSuccess } from "../_utils/Notification";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authDetails, setAuthDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    const data = authService.getCurrentUser();
    if (data) setAuthDetails(data);
    setIsLoading(false);
  }, []);

  // Login function now accepts optional callbackUrl
  const login = async (
    email: string,
    password: string,
    callbackUrl?: string,
  ) => {
    if (!email || !password) {
      onPrompt({
        title: "Missing Credentials",
        message: "Please enter both your email and password to continue.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });
      setAuthDetails(data);

      const userRole = data.user.role.toLowerCase();

      onSuccess({
        title: "Welcome Back!",
        message: `Successfully signed in as ${data.user.firstname || "User"}.`,
      });

      // Decide destination
      const destination =
        callbackUrl && callbackUrl.startsWith(`/${userRole}`)
          ? callbackUrl
          : `/${userRole}`;

      router.push(destination);
    } catch (err) {
      onFailure({
        title: "Login Failed",
        message:
          extractErrorMessage(err) ||
          "Please check your credentials and try again.",
      });
      setAuthDetails(null);
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    try {
      authService.logout(); // Clears tokens/localStorage
      setAuthDetails(null);

      onSuccess({
        title: "Signed Out",
        message: "You have been logged out successfully. See you soon!",
      });

      router.replace("/login");

      // Force a refresh to clear any sensitive data in the React state/memory
      window.location.href = "/login";
    } catch (err) {
      onFailure({
        title: "Logout Error",
        message: "An unexpected error occurred while signing out.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ authDetails, login, isLoading, setAuthDetails, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
