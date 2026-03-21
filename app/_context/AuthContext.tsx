"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../_services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../_lib/utils";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const login = async (email: string, password: string) => {
    //validation
    if (!email || !password) {
      toast.info("Please fill in all fields");
      return;
    }
    try {
      const data = await authService.login({ email, password });
      router.push(`/${data?.user?.role?.toLowerCase()}`); // Or /supervisor based on role
      setUser(data.user);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    const data = authService.getCurrentUser();
    setUser(data);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
