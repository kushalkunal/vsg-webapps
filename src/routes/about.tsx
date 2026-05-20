import { createFileRoute } from "@tanstack/react-router";
import { Award, Globe2, GraduationCap, HeartHandshake, Target, Users } from "lucide-react";
import { SectionHeader } from "./index";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Visionary Salva Group" },
      { name: "description", content: "Trusted educational consultancy under Vishwashi Advisory Service. 12+ years helping students get admissions in India and abroad." },
      { property: "og:title", content: "About Visionary Salva Group" },
      { property: "og:description", content: "Our story, mission and what makes us India's trusted admission partner." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24 max-w-4xl text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-warning">About us</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-extrabold tracking-tight">Empowering futures, one admission at a time.</h1>
          <p className="mt-5 text-background/85 text-lg leading-relaxed">
            Visionary Salva Group, a unit of Vishwashi Advisory Service, has guided 10,000+ students to their dream colleges across India and abroad — with honest advice, end-to-end support and a track record built on trust.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card icon={<Target className="h-5 w-5" />} title="Our Mission">
            Make quality higher education accessible to every student — by offering transparent guidance, expert counselling and end-to-end admission support across India and abroad.
          </Card>
          <Card icon={<Globe2 className="h-5 w-5" />} title="Our Vision">
            To become India's most trusted admission consultancy — known for honesty, personalised guidance and student success stories that span continents.
          </Card>
        </div>

        <div className="mt-16">
          <SectionHeader eyebrow="What we offer" title="Services that set us apart" />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: GraduationCap, t: "Career Counselling", d: "Expert guidance to help you choose the right course based on interests, scores and goals." },
              { icon: Award, t: "University Selection", d: "Best-fit colleges from our 500+ partner network — across India and 15+ countries." },
              { icon: Users, t: "Application Assistance", d: "Hassle-free documentation, applications and submission to ensure smooth admission." },
              { icon: HeartHandshake, t: "Scholarship Guidance", d: "Identify and apply for merit & need-based scholarships to reduce financial burden." },
              { icon: Globe2, t: "Study Abroad", d: "Complete support for MBBS, MS, MBA and bachelors abroad — university to visa to joining." },
              { icon: Target, t: "Education Loans", d: "Tie-ups with leading banks and NBFCs for hassle-free education loan processing." },
            ].map((s, i) => (
              <div key={s.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="h-11 w-11 grid place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display font-bold text-foreground">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl gradient-card border border-border p-7 shadow-soft">
      <div className="h-11 w-11 grid place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">{icon}</div>
      <h3 className="mt-4 font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-foreground/80 leading-relaxed">{children}</p>
    </div>
  );
}
