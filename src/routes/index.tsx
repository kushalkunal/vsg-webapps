import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, CheckCircle2, GraduationCap, Globe2, Phone, Sparkles, Users, BookOpen, Building2, Stethoscope, Briefcase, Scale, MapPin, Star, FileCheck, Compass, Banknote } from "lucide-react";
import heroImg from "@/assets/hero-students.jpg";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CollegeCard } from "@/components/CollegeCard";
import { FreeAdmissionForm } from "@/components/FreeAdmissionForm";
import { testimonials } from "@/data/catalog";
import { useColleges } from "@/hooks/use-colleges";
import { PHONE_NUMBERS, PHONE_TEL } from "@/lib/contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visionary Salva Group — India's Trusted Admission Consultancy" },
      { name: "description", content: "Get admission into top colleges & universities for MBBS, B.Tech, MBA, Nursing, Law and study abroad. Free counselling. 10,000+ admissions." },
      { property: "og:title", content: "Visionary Salva Group — Admissions Made Easy" },
      { property: "og:description", content: "Free counselling for MBBS, B.Tech, MBA, Nursing, Law and study abroad admissions." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Categories />
      <TopColleges />
      <WhyUs />
      <Process />
      <Testimonials />
      <CTASection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-hero opacity-95" />
      <img src={heroImg} alt="Students celebrating graduation" width={1920} height={1080} className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-foreground/55" />

      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-start">
          <div className="text-background animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/15 backdrop-blur px-4 py-1.5 text-xs font-semibold border border-background/20">
              <Sparkles className="h-3.5 w-3.5 text-warning" /> 10,000+ Successful Admissions
            </span>
            <h1 className="mt-5 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Your dream college,<br />
              <span className="text-warning">just one step away.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-background/85 leading-relaxed">
              Expert admission guidance for MBBS, B.Tech, MBA, Nursing, Law and study abroad — across India and 15+ countries. Free counselling, transparent fees, end-to-end support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/courses" className="inline-flex items-center gap-2 rounded-full bg-background text-primary px-6 py-3 font-semibold shadow-elegant hover:scale-105 transition-transform">
                Explore Courses <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`tel:${PHONE_TEL[0]}`} className="inline-flex items-center gap-2 rounded-full border-2 border-background/40 bg-background/10 backdrop-blur text-background px-6 py-3 font-semibold hover:bg-background/20 transition-colors">
                <Phone className="h-4 w-4" /> {PHONE_NUMBERS[0]}
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { v: "500+", l: "Partner Colleges" },
                { v: "15+", l: "Countries" },
                { v: "98%", l: "Success Rate" },
              ].map((s) => (
                <div key={s.l} className="border-l-2 border-warning pl-3">
                  <div className="font-display text-2xl sm:text-3xl font-bold">{s.v}</div>
                  <div className="text-[11px] uppercase tracking-wider text-background/75">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-card text-card-foreground p-6 sm:p-8 shadow-elegant border border-background/10 animate-scale-in">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold text-success uppercase tracking-wider">Free counselling</span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">Get Your Free Admission Plan</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">Send your details on WhatsApp — get a personalised college list within 24 hours.</p>
            <FreeAdmissionForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { icon: Users, v: "10,000+", l: "Students Placed" },
    { icon: Building2, v: "500+", l: "Partner Colleges" },
    { icon: Globe2, v: "15+", l: "Countries" },
    { icon: Award, v: "12+", l: "Years of Trust" },
  ];
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((s, i) => (
            <div key={s.l} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="h-12 w-12 grid place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-foreground">{s.v}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
      <SectionHeader
        eyebrow="What you can study"
        title="Explore Course Categories"
        subtitle="Pick your stream — we'll show you the best colleges, fees and admission process."
      />
      <div className="mt-10"><CategoryGrid /></div>
    </section>
  );
}

function TopColleges() {
  const colleges = useColleges();
  return (
    <section className="bg-muted/40 py-16 md:py-24 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <SectionHeader eyebrow="Popular Picks" title="Top Colleges & Universities" subtitle="Hand-picked institutions our students love." className="text-left" />
          <Link to="/colleges" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {colleges.slice(0, 6).map((c) => <CollegeCard key={c.id} college={c} />)}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    { icon: GraduationCap, t: "Expert Counsellors", d: "12+ years of admission expertise across India and abroad." },
    { icon: BookOpen, t: "End-to-End Support", d: "From course selection to visa & joining — we handle it all." },
    { icon: CheckCircle2, t: "Transparent Process", d: "Honest advice, clear fees, no hidden charges. Ever." },
    { icon: Award, t: "Top Tie-Ups", d: "Direct partnerships with 500+ leading colleges and universities." },
  ];
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
      <SectionHeader eyebrow="Why Visionary Salva" title="Built for ambitious students" subtitle="A consultancy that puts your future first." />
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((it, i) => (
          <div key={it.t} className="rounded-2xl gradient-card border border-border p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="h-12 w-12 grid place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display font-bold text-foreground">{it.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "Free Counselling", d: "Share your scores, interests and budget — get expert advice." },
    { n: "02", t: "College Shortlist", d: "We hand-pick best-fit colleges based on your profile." },
    { n: "03", t: "Application & Docs", d: "We handle applications, documents and verifications." },
    { n: "04", t: "Admission & Joining", d: "Confirm seat, visa (abroad), travel and on-ground support." },
  ];
  return (
    <section className="bg-muted/40 py-16 md:py-24 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow="How it works" title="Admission in 4 simple steps" />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl bg-card border border-border p-6 shadow-soft animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="font-display text-5xl font-extrabold text-gradient-hero opacity-90">{s.n}</div>
              <h3 className="mt-3 font-display font-bold text-foreground">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const list = [
    {
      icon: Compass,
      title: "Career Counselling",
      desc: "Expert guidance to help you choose the right course based on interests, scores and goals.",
    },
    {
      icon: Building2,
      title: "University Selection",
      desc: "Best-fit colleges from our 500+ partner network — across India and 15+ countries.",
    },
    {
      icon: FileCheck,
      title: "Application Assistance",
      desc: "Hassle-free documentation, applications and submission to ensure smooth admission.",
    },
    {
      icon: Award,
      title: "Scholarship Guidance",
      desc: "Identify and apply for merit & need-based scholarships to reduce financial burden.",
    },
    {
      icon: Globe2,
      title: "Study Abroad",
      desc: "Complete support for MBBS, MS, MBA and bachelors abroad — university to visa to joining.",
    },
    {
      icon: Banknote,
      title: "Education Loans",
      desc: "Tie-ups with leading banks and NBFCs for hassle-free education loan processing.",
    },
  ];
  return (
    <section className="bg-muted/40 py-16 md:py-24 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="What we offer"
          title="Our Services"
          subtitle="Comprehensive admission support — from course selection to joining day."
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((s, i) => (
            <Link
              key={s.title}
              to="/contact"
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all animate-fade-up overflow-hidden"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-12 w-12 grid place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft mb-4">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                Get Started <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
      <SectionHeader eyebrow="Success Stories" title="Loved by students nationwide" />
      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {testimonials.map((t, i) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant transition-shadow animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="flex gap-0.5 text-warning">
              {Array.from({ length: t.rating }).map((_, j) => (
                <svg key={j} viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              ))}
            </div>
            <p className="mt-3 text-sm text-foreground leading-relaxed">"{t.text}"</p>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="font-semibold text-sm text-foreground">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.course}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-14 text-background shadow-elegant">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-warning/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold leading-tight">Ready to start your admission journey?</h3>
            <p className="mt-3 text-background/85 max-w-xl">Talk to a counsellor today. Get a personalised college list, fees breakdown and admission roadmap — completely free.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-background text-primary px-6 py-3 font-semibold shadow-elegant hover:scale-105 transition-transform">
                Book Free Counselling <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`tel:${PHONE_TEL[0]}`} className="inline-flex items-center gap-2 rounded-full border-2 border-background/40 bg-background/10 backdrop-blur px-6 py-3 font-semibold hover:bg-background/20">
                <Phone className="h-4 w-4" /> {PHONE_NUMBERS[0]}
              </a>
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
            <div className="rounded-2xl bg-background/10 backdrop-blur border border-background/20 p-6 max-w-sm">
              <div className="text-5xl font-display font-extrabold text-warning">98%</div>
              <div className="text-sm font-semibold mt-1">Admission Success Rate</div>
              <p className="text-xs text-background/80 mt-2">Across MBBS, B.Tech, MBA, Nursing, Law & abroad programs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, className = "text-center" }: { eyebrow?: string; title: string; subtitle?: string; className?: string }) {
  return (
    <div className={className + " max-w-2xl mx-auto"}>
      {eyebrow && <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-secondary">{eyebrow}</span>}
      <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
