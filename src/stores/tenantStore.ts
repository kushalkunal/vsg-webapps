// Active tenant state. The tenantId is normally derived from the authenticated
// user (set in authStore), but can be overridden for tenant switching.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getAuthUser } from "./authStore";

export interface TenantSettings {
  name?: string;
  logoUrl?: string;
  primaryColor?: string;
  currency?: string;
  countries?: string[];
  studentStatuses?: string[];
  feeCategories?: string[];
  dashboardWidgets?: string[];
  [key: string]: unknown;
}

interface TenantState {
  tenantIdOverride: string | null;
  settings: TenantSettings | null;
  setTenantOverride: (id: string | null) => void;
  setSettings: (s: TenantSettings | null) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenantIdOverride: null,
      settings: null,
      setTenantOverride: (id) => set({ tenantIdOverride: id }),
      setSettings: (settings) => set({ settings }),
    }),
    {
      name: "vsg.tenant.v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as never),
      ),
    },
  ),
);

const ENV_DEFAULT_TENANT =
  (import.meta.env.VITE_DEFAULT_TENANT_ID as string | undefined) || null;

/** Resolve the active tenant id (override → JWT user → env default). */
export const getActiveTenantId = (): string | null => {
  const { tenantIdOverride } = useTenantStore.getState();
  return tenantIdOverride || getAuthUser()?.tenantId || ENV_DEFAULT_TENANT;
};
