import axios from "axios";

let accessToken: string | null = null;

export const setApiAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getApiAccessToken = () => accessToken;

export const clearApiAccessToken = () => {
  accessToken = null;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  paramsSerializer: { indexes: null },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string | null) => void; reject: (error: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => (error ? promise.reject(error) : promise.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = String(originalRequest?.url || "");
    const isRefreshRequest = requestUrl.includes("/auth/refresh-token");
    const isAuthRequest = /\/auth\/(login|register|verify-otp|resend-otp|logout)/.test(requestUrl);

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshRequest && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => failedQueue.push({ resolve, reject })).then((token) => {
          if (token) originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await api.post("/auth/refresh-token", {}, { withCredentials: true });
        const newToken = data.token as string | undefined;
        if (!newToken) throw new Error("Refresh token response was invalid");
        setApiAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setApiAccessToken(null);
        processQueue(refreshError, null);
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const refreshTokenCall = async (): Promise<string> => {
  const res = await api.post("/auth/refresh-token", {}, { withCredentials: true });
  const token = res.data?.token;
  if (!token) throw new Error("No access token returned");
  setApiAccessToken(token);
  return token;
};
