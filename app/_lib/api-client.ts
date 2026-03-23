import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Automatically attach JWT token to requests if it exists
api.interceptors.request.use((config) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  const token = user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
