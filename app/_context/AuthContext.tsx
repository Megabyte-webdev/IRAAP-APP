"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../_services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../_lib/utils";

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
      toast.info("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });
      setAuthDetails(data);

      const userRole = data.user.role.toLowerCase();

      // Decide destination
      const destination =
        callbackUrl && callbackUrl.startsWith(`/${userRole}`)
          ? callbackUrl
          : `/${userRole}`;

      router.push(destination);
    } catch (err) {
      toast.error(extractErrorMessage(err));
      setAuthDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ authDetails, login, isLoading, setAuthDetails }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
