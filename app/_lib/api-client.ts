import axios from "axios";

let accessToken: string | null = null;

export const setApiAccessToken = (token: string | null) => {
  accessToken = token;

  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("iraapUser");

  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);

    if (token) {
      localStorage.setItem("iraapUser", JSON.stringify({ ...parsed, token }));
    } else {
      const { token: _token, ...withoutToken } = parsed || {};
      localStorage.setItem("iraapUser", JSON.stringify(withoutToken));
    }
  } catch {
    // Ignore malformed persisted auth state; AuthContext handles recovery.
  }
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

let refreshPromise: Promise<{
  token: string;
  user?: any;
}> | null = null;

const doRefreshToken = async (): Promise<{
  token: string;
  user?: any;
}> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
    {},
    {
      withCredentials: true,
    },
  );

  const token = res.data?.token;

  if (!token) {
    throw new Error(
      "Refresh token response was invalid",
    );
  }

  setApiAccessToken(token);

  return {
    token,
    user: res.data?.user,
  };
};

/**
 * ONE refresh pipeline for the entire browser.
 *
 * Axios 401 handling, AuthContext timers, visibility changes,
 * and WebSocket refresh requests all converge here. This prevents
 * two simultaneous refreshes from rotating the same refresh token
 * and accidentally triggering REFRESH_REUSE_DETECTED.
 */
export const refreshTokenCall = async (): Promise<{
  token: string;
  user?: any;
}> => {
  if (!refreshPromise) {
    refreshPromise = doRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = String(
      originalRequest?.url || "",
    );

    const isRefreshRequest =
      requestUrl.includes(
        "/auth/refresh-token",
      );

    const isAuthRequest =
      /\/auth\/(login|register|forgot-password|reset-password|verify-otp|resend-otp|change-password|logout)/.test(
        requestUrl,
      );

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isRefreshRequest &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        const refreshed =
          await refreshTokenCall();

        const newToken =
          refreshed.token;

        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(
          originalRequest,
        );
      } catch (
        refreshError
      ) {
        if (
          typeof window !==
          "undefined"
        ) {
          window.dispatchEvent(
            new CustomEvent(
              "iraap:auth-expired",
              {
                detail: {
                  reason:
                    (
                      refreshError as any
                    )?.response?.data
                      ?.code ||
                    "REFRESH_FAILED",
                },
              },
            ),
          );
        }

        return Promise.reject(
          refreshError,
        );
      }
    }

    return Promise.reject(
      error,
    );
  },
);
