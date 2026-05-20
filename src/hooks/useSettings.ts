import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "@/services/settingsService";
import { useTenantStore, type TenantSettings } from "@/stores/tenantStore";

export const SETTINGS_KEY = "settings";

export function useSettings() {
  const settings = useTenantStore((s) => s.settings);
  const query = useQuery({
    queryKey: [SETTINGS_KEY],
    queryFn: () => settingsService.get(),
    staleTime: 5 * 60_000,
  });
  // Prefer live query data, fall back to persisted store value
  return { ...query, settings: query.data ?? settings };
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TenantSettings>) => settingsService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SETTINGS_KEY] });
      toast.success("Settings saved");
    },
  });
}
