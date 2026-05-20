import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useColleges } from "@/hooks/use-colleges";
import { CollegeCard } from "@/components/CollegeCard";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { SectionHeader } from "./index";
import { useQuery } from "@tanstack/react-query";
import { collegeService } from "@/services/collegeService";

export const Route = createFileRoute("/colleges")({
  head: () => ({
    meta: [
      { title: "Top Colleges & Universities — India & Abroad | Visionary Salva" },
      { name: "description", content: "Browse 500+ top colleges and universities for MBBS, B.Tech, MBA, Nursing & more. Filter by state, country, fees and course type." },
      { property: "og:title", content: "Top Colleges — Visionary Salva Group" },
      { property: "og:description", content: "500+ partner colleges across India and abroad. Filters, fees, ratings and admission help." },
    ],
  }),
  component: CollegesPage,
});

function CollegesPage() {
  const { data: colleges = [], isLoading } = useQuery({
    queryKey: ["public-colleges"],
    queryFn: collegeService.list,
    staleTime: 60_000,
  });
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("All");

  const countries = useMemo(() => ["All", ...Array.from(new Set(colleges.map((c) => c.country).filter(Boolean)))], [colleges]);

  const filtered = colleges.filter((c) => {
    if (q && !`${c.name} ${c.city ?? ""} ${c.state ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (country !== "All" && c.country !== country) return false;
    return true;
  });

  return (
    <>
      <section className="gradient-soft border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
          <SectionHeader eyebrow="Colleges" title="Find your dream college" subtitle="Browse our partner institutions across India and 15+ countries." />
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="space-y-5 lg:sticky lg:top-24 self-start rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
            </div>

            <Filter label="Search">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="College or city..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </Filter>

            <Filter label="Country">
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                {countries.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Filter>

            <button onClick={() => { setQ(""); setCountry("All"); }} className="w-full rounded-lg border border-border py-2 text-sm font-medium hover:bg-muted">Reset filters</button>
          </aside>

          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading colleges…
              </div>
            ) : (
              <>
                <div className="mb-5 text-sm text-muted-foreground">Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {colleges.length} colleges</div>
                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-16 text-center">
                    <p className="text-muted-foreground">No colleges match these filters. Try widening your search.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((c) => <CollegeCard key={c.id} college={c} />)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}
