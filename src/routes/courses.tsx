import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { categories, courses, type CategoryId } from "@/data/catalog";
import { ArrowRight, Clock, Wallet, GraduationCap } from "lucide-react";
import { SectionHeader } from "./index";

const search = z.object({
  category: z.enum(["medical", "engineering", "management", "law", "nursing", "pharmacy", "arts", "computer", "abroad"]).optional(),
});

export const Route = createFileRoute("/courses")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Courses — MBBS, B.Tech, MBA, Nursing & more | Visionary Salva" },
      { name: "description", content: "Explore courses across Medical, Engineering, Management, Law, Nursing, Pharmacy, Arts and abroad. Get duration, eligibility, fees and career options." },
      { property: "og:title", content: "Explore Courses — Visionary Salva Group" },
      { property: "og:description", content: "MBBS, B.Tech, MBA, Nursing, Law and Study Abroad — full details and free counselling." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const { category } = Route.useSearch();
  const filtered = category ? courses.filter((c) => c.category === category) : courses;
  const activeCat = category ? categories.find((c) => c.id === category) : null;

  return (
    <>
      <section className="gradient-soft border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
          <SectionHeader eyebrow="Courses" title={activeCat ? activeCat.name + " Courses" : "Find your perfect course"} subtitle={activeCat ? activeCat.tagline : "Filter by category to discover programs that match your goals."} />
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-10">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 -mx-1 px-1">
          <CategoryChip active={!category} to={{}}>All</CategoryChip>
          {categories.map((c) => (
            <CategoryChip key={c.id} active={category === c.id} to={{ category: c.id }}>{c.name}</CategoryChip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No courses yet in this category. Try another!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c, i) => (
              <Link
                key={c.slug}
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-11 w-11 grid place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-secondary bg-secondary/10 rounded-full px-2.5 py-1">{categories.find(cat => cat.id === c.category)?.name}</span>
                </div>
                <h3 className="mt-4 font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">{c.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{c.overview}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-foreground"><Clock className="h-3.5 w-3.5 text-secondary" /> {c.duration}</div>
                  <div className="flex items-center gap-1.5 text-foreground"><Wallet className="h-3.5 w-3.5 text-secondary" /> {c.feesRange}</div>
                </div>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">View details <ArrowRight className="h-4 w-4" /></div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function CategoryChip({ children, active, to }: { children: React.ReactNode; active?: boolean; to: { category?: CategoryId } }) {
  return (
    <Link
      to="/courses"
      search={to}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-all ${
        active ? "gradient-primary text-primary-foreground border-transparent shadow-soft" : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </Link>
  );
}
