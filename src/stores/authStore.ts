// Global auth state (Zustand + localStorage persistence).
// Token + user are populated by authService.login() and consumed by the
// axios interceptor in src/services/api.ts.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  permissions?: string[];
  tenantId: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  clear: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clear: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token,
      hasRole: (role) => !!get().user?.roles?.includes(role),
      hasPermission: (p) => !!get().user?.permissions?.includes(p),
    }),
    {
      name: "vsg.auth.v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as never),
      ),
    },
  ),
);

// Non-hook accessors for use inside axios interceptors.
export const getAuthToken = () => useAuthStore.getState().token;
export const getAuthUser = () => useAuthStore.getState().user;
export const clearAuth = () => useAuthStore.getState().clear();
