import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, GraduationCap, Lock } from "lucide-react";
import logo from "@/assets/logo-vsg.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/colleges", label: "Colleges" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-xl shadow-soft border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo} alt="Visionary Salva Group" width={48} height={48} className="h-12 w-12 object-contain" />
            <div className="hidden sm:block leading-tight">
              <div className="font-display font-bold text-base text-foreground">Visionary Salva Group</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">A Unit Of Vishwashi Advisory Service</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-primary bg-primary/8" }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-2 rounded-full gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-all"
            >
              <GraduationCap className="h-4 w-4" />
              Free Counselling
            </Link>
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 backdrop-blur px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              title="Admin Login"
            >
              <Lock className="h-3.5 w-3.5" /> Admin
            </Link>
            <button
              className="lg:hidden p-2 rounded-md text-foreground"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-2 shadow-elegant">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-primary bg-primary/10" }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex justify-center items-center gap-2 rounded-lg gradient-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold"
              >
                <GraduationCap className="h-4 w-4" /> Free Counselling
              </Link>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="inline-flex justify-center items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <Lock className="h-4 w-4" /> Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
