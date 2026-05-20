import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  TrendingUp,
  GraduationCap,
  Globe,
  Loader2,
  WifiOff,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useDashboardStats } from "@/hooks/useDashboard";
import { PageHeader } from "@/components/admin/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-16" />
    </div>
  );
}

function DashboardPage() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
        <WifiOff className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="font-semibold text-foreground">Could not load dashboard</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Make sure the backend is running and{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              VITE_API_BASE_URL
            </code>{" "}
            is configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your consultancy performance"
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={Users}
              label="Total Students"
              value={stats?.totalStudents ?? 0}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={TrendingUp}
              label="Active Leads"
              value={stats?.activeLeads ?? 0}
              color="bg-orange-100 text-orange-600"
            />
            <StatCard
              icon={GraduationCap}
              label="Admissions Confirmed"
              value={stats?.admissionsConfirmed ?? 0}
              color="bg-green-100 text-green-600"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Top Countries */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <h3 className="mb-4 font-display font-semibold text-foreground">
            Top Countries
          </h3>
          {isLoading ? (
            <Skeleton className="h-44 w-full" />
          ) : (stats?.topCountries?.length ?? 0) > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats!.topCountries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No country data yet
            </p>
          )}
        </div>

        {/* Top Courses */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <h3 className="mb-4 font-display font-semibold text-foreground">
            Top Courses
          </h3>
          {isLoading ? (
            <Skeleton className="h-44 w-full" />
          ) : (stats?.topCourses?.length ?? 0) > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats!.topCourses}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--secondary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No course data yet
            </p>
          )}
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="rounded-xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display font-semibold text-foreground">
            Recent Enquiries
          </h3>
          <Link
            to="/admin/students"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))
          ) : (stats?.recentEnquiries?.length ?? 0) === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No recent enquiries
            </p>
          ) : (
            stats!.recentEnquiries.map((e) => (
              <Link
                key={e.id}
                to="/admin/students/$id"
                params={{ id: e.id }}
                className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {e.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {e.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(e.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
