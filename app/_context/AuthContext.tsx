"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { authService, setupInterceptors } from "../_services/auth.service";
import { useRouter } from "next/navigation";
import { extractErrorMessage } from "../_lib/utils";
import { onFailure, onPrompt, onSuccess } from "../_utils/Notification";
import { refreshTokenCall } from "../_lib/api-client";
import { websocket } from "../_services/websocket";
import { useQueryClient } from "@tanstack/react-query";

interface JwtPayload {
  exp: number;
}

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [authDetails, setAuthDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshInFlight = {
    current: null as Promise<string | null> | null,
  };
  const logoutLockRef = useRef(false);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const authDetailsRef = useRef<any>(null);
  useEffect(() => {
    authDetailsRef.current = authDetails;
  }, [authDetails]);

  // ---------------- TOKEN HELPERS ----------------
  const getTokenExp = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]))?.exp * 1000;
    } catch {
      return null;
    }
  };

  const isExpired = (token: string) => {
    const exp = getTokenExp(token);
    return !exp || Date.now() > exp - 30_000;
  };

  const safeLogout = useCallback(async () => {
    if (logoutLockRef.current) return;
    logoutLockRef.current = true;

    queryClient.clear();

    setAuthDetails(null);
    localStorage.removeItem("iraapUser");
    localStorage.removeItem("ws_token");
    websocket.disconnect();

    setTimeout(() => {
      logoutLockRef.current = false;
    }, 3000);
  }, [queryClient]);

  // ---------------- SINGLE REFRESH PIPELINE ----------------

  const updateAccessToken = useCallback((token: string) => {
    setAuthDetails((prev: any) => {
      if (!prev) return prev;
      const updated = { ...prev, token: token };
      localStorage.setItem("iraapUser", JSON.stringify(updated));
      websocket.reconnectWithToken(token);
      return updated;
    });
  }, []);

  const refreshTokenSafe = async (): Promise<string | null> => {
    if (refreshInFlight.current) return refreshInFlight.current;

    refreshInFlight.current = (async () => {
      try {
        const token = await refreshTokenCall();
        return token;
      } catch (err: any) {
        const isNetworkError =
          !err.response ||
          err.code === "ERR_NETWORK" ||
          err.code === "ECONNABORTED";

        const isAuthError =
          err.response?.status === 401 || err.response?.status === 403;

        if (isNetworkError) {
          console.warn("[AUTH] network issue, preserving session");
          return null;
        }

        if (isAuthError) {
          console.warn("[AUTH] refresh token invalid → logout");
          throw new Error("AUTH_EXPIRED");
        }

        console.warn("[AUTH] unknown refresh error");
        return null;
      }
    })().finally(() => {
      refreshInFlight.current = null;
    });

    return refreshInFlight.current;
  };

  const handleRefresh = useCallback(async (): Promise<string | null> => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      console.warn("[AUTH] offline → skip refresh");
      return null;
    }

    try {
      const token = await refreshTokenSafe();

      if (!token) return null;

      updateAccessToken(token);
      return token;
    } catch (e: any) {
      if (e.message === "AUTH_EXPIRED") {
        await safeLogout();
      }
      return null;
    }
  }, [updateAccessToken, safeLogout]);

  // ---------------- PROACTIVE REFRESH SCHEDULER ----------------
  const scheduleRefresh = useCallback(
    (token: string) => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

      const exp = getTokenExp(token);
      if (!exp) return;

      const delay = exp - Date.now() - 60_000; // refresh 60s before expiry

      if (delay <= 0) {
        // Token is already expired or expiring very soon
        // Only refresh if it's actually expired, not just "about to expire"
        if (Date.now() > exp) {
          handleRefresh();
        } else {
          const urgentDelay = Math.max(exp - Date.now() - 5_000, 0);
          refreshTimerRef.current = setTimeout(
            () => handleRefresh(),
            urgentDelay,
          );
        }
      } else {
        refreshTimerRef.current = setTimeout(() => handleRefresh(), delay);
      }
    },
    [handleRefresh],
  );

  useEffect(() => {
    const token = authDetails?.token;
    if (!token) return;
    scheduleRefresh(token);
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [authDetails?.token, scheduleRefresh]);

  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== "visible") return;
      const token = authDetails?.token;
      if (!token) return;
      if (isExpired(token)) await handleRefresh();
      else scheduleRefresh(token);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [authDetails?.token, handleRefresh, scheduleRefresh]);

  useEffect(() => {
    const stored = localStorage.getItem("iraapUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuthDetails(parsed);
        if (parsed?.token) {
          websocket.connect(parsed.token);
        }
      } catch {
        localStorage.removeItem("iraapUser");
      }
    }

    setupInterceptors(() => authDetailsRef.current, handleRefresh);

    websocket.onAuthFailure = async () => {
      console.warn("[WS] auth failure → attempting silent refresh");

      const token = await handleRefresh();

      if (!token) {
        console.warn("[WS] refresh failed (NOT logging out)");
      }
    };

    setTimeout(() => setIsLoading(false), 50);

    return () => {
      websocket.onAuthFailure = null;
    };
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
      //window.location.href = "/login";
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
