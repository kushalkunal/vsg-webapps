import api, { tenantPath } from "./api";

export interface DashboardStats {
  totalStudents: number;
  activeLeads: number;
  admissionsConfirmed: number;
  topCountries: { name: string; count: number }[];
  topCourses: { name: string; count: number }[];
  recentEnquiries: { id: string; name: string; createdAt: string }[];
}

export const dashboardService = {
  stats: () =>
    api.get<DashboardStats>(tenantPath("/dashboard/stats")).then((r) => r.data),
};
