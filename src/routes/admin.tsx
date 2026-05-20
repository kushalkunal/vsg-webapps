import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthToken } from "@/stores/authStore";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (!getAuthToken()) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }
    // Redirect bare /admin to dashboard
    if (
      location.pathname === "/admin" ||
      location.pathname === "/admin/"
    ) {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  component: AdminLayout,
});
