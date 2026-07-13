import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("iraapUser") || "null");

    const token = user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Refresh token handling
let isRefreshing = false;

let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh-token");

        const newToken = data.token;
        const user = JSON.parse(localStorage.getItem("iraapUser") || "{}");

        localStorage.setItem(
          "iraapUser",
          JSON.stringify({
            ...user,
            token: newToken,
          }),
        );
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("iraapUser");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const refreshTokenCall = async (): Promise<string> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
    {},
    { withCredentials: true },
  );

  return res.data?.data?.access_token;
};
