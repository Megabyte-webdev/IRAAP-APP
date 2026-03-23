"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../_services/auth.service";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { toast } from "react-toastify";
import { extractErrorMessage } from "../_lib/utils";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authDetails, setAuthDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load user on mount
  useEffect(() => {
    const data = authService.getCurrentUser();
    if (data) {
      setAuthDetails(data);
    }
    setIsLoading(false); // Move this here to ensure it only happens after check
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      toast.info("Please fill in all fields");
      return;
    }

    // START loading when login starts to prevent RouteProtector from
    // redirecting while the page transition is happening
    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });
      setAuthDetails(data);

      const userRole = data.user.role.toLowerCase();
      const callbackUrl = searchParams.get("callbackUrl");

      // Determine final destination
      const destination =
        callbackUrl && callbackUrl.startsWith(`/${userRole}`)
          ? callbackUrl
          : `/${userRole}`;

      router.push(destination);
    } catch (err) {
      toast.error(extractErrorMessage(err));
      setAuthDetails(null);
    } finally {
      setIsLoading(false); // STOP loading only after navigation/error
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
