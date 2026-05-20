import { Link } from "@tanstack/react-router";
import { categories } from "@/data/catalog";
import * as Icons from "lucide-react";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
      {categories.map((cat, i) => {
        const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cat.icon] ?? Icons.GraduationCap;
        return (
          <Link
            key={cat.id}
            to="/courses"
            search={{ category: cat.id }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full gradient-primary opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative">
              <div className="h-11 w-11 grid place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{cat.tagline}</p>
              <p className="text-xs font-medium text-primary mt-3 group-hover:translate-x-1 transition-transform">Explore →</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
