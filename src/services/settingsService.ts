import api, { tenantPath } from "./api";
import { useTenantStore, type TenantSettings } from "@/stores/tenantStore";

export const settingsService = {
  async get(): Promise<TenantSettings> {
    const { data } = await api.get<TenantSettings>(tenantPath("/settings"));
    useTenantStore.getState().setSettings(data);
    return data;
  },
  async update(payload: Partial<TenantSettings>): Promise<TenantSettings> {
    const { data } = await api.put<TenantSettings>(tenantPath("/settings"), payload);
    useTenantStore.getState().setSettings(data);
    return data;
  },
};
