import api from "./api";
import { useAuthStore, type AuthUser } from "@/stores/authStore";

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
    useAuthStore.getState().setSession(data.token, data.user);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore — clear local session regardless
    } finally {
      useAuthStore.getState().clear();
    }
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  },
};
