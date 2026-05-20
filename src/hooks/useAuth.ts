import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/authService";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  return {
    user,
    token,
    isAuthenticated: !!token,
    hasRole: (role: string) => !!user?.roles?.includes(role),
    hasPermission: (p: string) => !!user?.permissions?.includes(p),
    login: authService.login,
    logout: authService.logout,
  };
}
