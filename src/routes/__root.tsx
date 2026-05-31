import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";
import logoVsg from "@/assets/logo-vsg.png";
import logoScaliolab from "@/assets/logo-scaliolab.png";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
  },
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-hero">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Visionary Salva Group — Admissions in India & Abroad" },
      { name: "description", content: "Trusted admission consultancy for MBBS, B.Tech, MBA, BDS, Nursing, Pharmacy, Law and study abroad. Free counselling, scholarships and end-to-end support." },
      { name: "author", content: "Visionary Salva Group" },
      { property: "og:title", content: "Visionary Salva Group — Admissions in India & Abroad" },
      { property: "og:description", content: "Trusted admission consultancy for MBBS, B.Tech, MBA, BDS, Nursing, Pharmacy, Law and study abroad. Free counselling, scholarships and end-to-end support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Visionary Salva Group — Admissions in India & Abroad" },
      { name: "twitter:description", content: "Trusted admission consultancy for MBBS, B.Tech, MBA, BDS, Nursing, Pharmacy, Law and study abroad. Free counselling, scholarships and end-to-end support." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9c7df6b8-837e-4bb8-b282-5267bad80741/id-preview-b52ade54--3fe30dc4-5a18-4eb1-b4c5-b1ee71f0f064.lovable.app-1777680907359.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9c7df6b8-837e-4bb8-b282-5267bad80741/id-preview-b52ade54--3fe30dc4-5a18-4eb1-b4c5-b1ee71f0f064.lovable.app-1777680907359.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: logoVsg },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { location } = useRouterState();
  const pathname = location.pathname;
  const isAdminOrLogin =
    pathname === "/login" || pathname.startsWith("/admin");

  if (isAdminOrLogin) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
        <SiteFooter />
        <WhatsAppButton />
      </div>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
