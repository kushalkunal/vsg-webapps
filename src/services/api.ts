// Centralized axios instance for the Spring Boot backend.
//
// Responsibilities:
//   - Read VITE_API_BASE_URL from env
//   - Attach JWT bearer token from authStore
//   - Resolve active tenant id and either:
//       a) prepend it to {tenantId} placeholders in the URL, or
//       b) send it as an X-Tenant-Id header (for non-tenanted endpoints)
//   - Surface API errors via toast + redirect on 401

import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { clearAuth, getAuthToken } from "@/stores/authStore";
import { getActiveTenantId } from "@/stores/tenantStore";

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "") || "";

export const TENANT_PLACEHOLDER = "{tenantId}";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

// ---------- Request interceptor: auth + tenant ----------
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const tenantId = getActiveTenantId();
  if (tenantId) {
    headers.set("x-tenant-id", tenantId);
    if (config.url?.includes(TENANT_PLACEHOLDER)) {
      config.url = config.url.replaceAll(
        TENANT_PLACEHOLDER,
        encodeURIComponent(tenantId),
      );
    }
  } else if (config.url?.includes(TENANT_PLACEHOLDER)) {
    // No tenant available — fail fast rather than hit a broken URL.
    return Promise.reject(
      new Error("No active tenant. Sign in or set VITE_DEFAULT_TENANT_ID."),
    ) as never;
  }

  config.headers = headers;
  return config;
});

// ---------- Response interceptor: global error handling ----------
let isRedirectingToLogin = false;

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (!error.response) {
      // Network / timeout
      if (typeof window !== "undefined") {
        toast.error(error.message || "Network error. Please try again.");
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const msg =
      error.response.data?.message ||
      error.response.data?.error ||
      error.message ||
      "Request failed";

    if (status === 401) {
      clearAuth();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !isRedirectingToLogin
      ) {
        isRedirectingToLogin = true;
        toast.error("Session expired. Please sign in again.");
        window.location.assign(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
        // Reset flag after navigation completes
        setTimeout(() => { isRedirectingToLogin = false; }, 3000);
      }
    } else if (status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (typeof window !== "undefined") {
      toast.error(msg);
    }

    return Promise.reject(error);
  },
);

/**
 * Build a tenant-scoped URL path.
 * e.g. tenantPath("/students") → "/api/{tenantId}/students"
 * The "{tenantId}" placeholder is replaced by the request interceptor.
 */
export const tenantPath = (suffix: string): string =>
  `/api/${TENANT_PLACEHOLDER}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;

export default api;
