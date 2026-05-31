import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useState, useEffect } from "react";
import { settingsService } from "@/services/settingsService";
import logo from "@/assets/logo-vsg.png";
import logoScaliolab from "@/assets/logo-scaliolab.png";

const NAV = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/students",  icon: Users,          label: "Students" },
  { to: "/admin/colleges",  icon: Building2,       label: "Colleges" },
  { to: "/admin/courses",   icon: BookOpen,        label: "Courses" },
  { to: "/admin/fees",      icon: DollarSign,      label: "Fees" },
  { to: "/admin/followups", icon: MessageSquare,   label: "Follow-ups" },
  { to: "/admin/settings",  icon: Settings,        label: "Settings" },
];

const ADMIN_ONLY_NAV = [
  { to: "/admin/users", icon: Users, label: "User Management" },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const { settings, tenantId } = useTenant();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { location } = useRouterState();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // Load tenant settings on mount
  useEffect(() => {
    if (tenantId) {
      settingsService.get().catch(() => {
        /* silently fail — settings are optional */
      });
    }
  }, [tenantId]);

  // Redirect /admin → /admin/dashboard
  useEffect(() => {
    if (pathname === "/admin" || pathname === "/admin/") {
      navigate({ to: "/admin/dashboard" });
    }
  }, [pathname, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <img
            src={settings?.logoUrl || logo}
            alt="Logo"
            className="h-9 w-9 rounded-lg object-contain"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-sm font-bold text-foreground">
              {settings?.name || "Visionary Salva"}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Admin Portal
            </div>
          </div>
          <button
            className="text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active =
              pathname === item.to ||
              (item.to !== "/admin/dashboard" &&
                pathname.startsWith(item.to + "/"));
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
                {active && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-70" />
                )}
              </Link>
            );
          })}

          {/* Admin-only section */}
          {user?.roles?.includes("ADMIN") && (
            <>
              <div className="my-2 border-t border-border" />
              {ADMIN_ONLY_NAV.map((item) => {
                const active = pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                    {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-70" />}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="space-y-0.5 border-t border-border px-3 py-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          >
            <Globe className="h-4 w-4 shrink-0" />
            View Website
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>

          {/* Designed & Managed by Scalio Lab */}
          <div className="mt-3 border-t border-border pt-3">
            <a
              href="https://scaliolab.com"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              <img src={logoScaliolab} alt="Scalio Lab" className="h-4 w-4 rounded-sm object-contain" />
              <span>Designed &amp; Managed by <strong className="text-muted-foreground">Scalio Lab</strong></span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
          <button
            className="text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb hint */}
          <span className="hidden text-sm text-muted-foreground sm:block">
            {NAV.find(
              (n) =>
                pathname === n.to || pathname.startsWith(n.to + "/"),
            )?.label ?? "Admin"}
          </span>

          <div className="flex-1" />

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium leading-none text-foreground">
                {user?.name || user?.email || "Admin"}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {user?.roles?.[0] || "Staff"}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
