import { useAuthStore } from "@/stores/authStore";
import { useTenantStore } from "@/stores/tenantStore";

const ENV_DEFAULT_TENANT =
  (import.meta.env.VITE_DEFAULT_TENANT_ID as string | undefined) || null;

export function useTenant() {
  const override = useTenantStore((s) => s.tenantIdOverride);
  const settings = useTenantStore((s) => s.settings);
  const setOverride = useTenantStore((s) => s.setTenantOverride);
  const userTenant = useAuthStore((s) => s.user?.tenantId ?? null);

  const tenantId = override || userTenant || ENV_DEFAULT_TENANT;

  return { tenantId, settings, setTenantOverride: setOverride };
}
