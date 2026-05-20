import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export const DASHBOARD_KEY = "dashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: [DASHBOARD_KEY, "stats"],
    queryFn: () => dashboardService.stats(),
    staleTime: 30_000,
  });
}
