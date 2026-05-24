import api from "./api";
import { useAuthStore, type AuthUser } from "@/stores/authStore";

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface MessageResponse {
  message: string;
}

export const authService = {
  /** Legacy direct login (no OTP) */
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
    useAuthStore.getState().setSession(data.token, data.user);
    return data;
  },

  /** OTP step 1 – validate credentials, triggers OTP email */
  async loginInit(email: string, password: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>("/auth/login/init", { email, password });
    return data;
  },

  /** OTP step 2 – submit OTP, returns JWT */
  async loginVerify(email: string, otp: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login/verify", { email, otp });
    useAuthStore.getState().setSession(data.token, data.user);
    return data;
  },

  /** Send password reset email */
  async forgotPassword(email: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>("/auth/password/forgot", { email });
    return data;
  },

  /** Submit reset token + new password */
  async resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>("/auth/password/reset", { token, newPassword });
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
