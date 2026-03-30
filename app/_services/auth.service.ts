import { api } from "../_lib/api-client";

export const authService = {
  login: async (credentials: any) => {
    const { data } = await api.post("/auth/login", credentials);
    // data should contain { token, user: { role, name } }
    sessionStorage.setItem("user", JSON.stringify(data));
    return data;
  },
  logout: () => {
    sessionStorage.removeItem("user");
  },
  getCurrentUser: () => {
    // In a real app, decode the JWT here
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
