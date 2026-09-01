import { api } from "../_lib/api-client";

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  requiresOtp?: boolean;
  challengeId?: string;
  email?: string;
  purpose?: "SIGNUP" | "LOGIN" | "PASSWORD_RESET";
  message?: string;
}

export const authService = {
  register: async (payload: { fullName: string; email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload, { withCredentials: true });
    if (!data.success) throw new Error(data.message || "Registration failed");
    return data;
  },
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials, { withCredentials: true });
    if (!data.success) throw new Error(data.message || "Login failed");
    return data;
  },
  verifyOtp: async (payload: { challengeId: string; code: string }) => {
    const { data } = await api.post<AuthResponse>("/auth/verify-otp", payload, { withCredentials: true });
    if (!data.success || !data.token || !data.user) throw new Error(data.message || "Verification failed");
    return data;
  },
  forgotPassword: async (email: string): Promise<AuthResponse & { challengeId: string; email: string }> => {
    const { data } = await api.post<AuthResponse>(
      "/auth/forgot-password",
      { email },
      { withCredentials: true },
    );
    if (!data.success || !data.challengeId) {
      throw new Error(data.message || "Unable to start password recovery");
    }
    return {
      ...data,
      challengeId: data.challengeId,
      email: data.email || email,
    };
  },
  resetPassword: async (payload: { challengeId: string; code: string; password: string }) => {
    const { data } = await api.post<AuthResponse>(
      "/auth/reset-password",
      payload,
      { withCredentials: true },
    );
    if (!data.success) {
      throw new Error(data.message || "Unable to reset your password");
    }
    return data;
  },
  resendOtp: async (challengeId: string): Promise<AuthResponse & { challengeId: string }> => {
    const { data } = await api.post<AuthResponse>("/auth/resend-otp", { challengeId }, { withCredentials: true });
    if (!data.success || !data.challengeId) throw new Error(data.message || "Unable to resend code");
    return { ...data, challengeId: data.challengeId };
  },
  logout: async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      localStorage.removeItem("iraapUser");
      localStorage.removeItem("iraapOtpChallenge");
    }
  },
  getCurrentUser: () => {
    const user = localStorage.getItem("iraapUser");
    return user ? JSON.parse(user) : null;
  },
};
