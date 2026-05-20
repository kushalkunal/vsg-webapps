import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { courses, categories } from "@/data/catalog";
import { useColleges } from "@/hooks/use-colleges";
import { ArrowRight, Clock, Wallet, CheckCircle2, FileText, Briefcase, Building2, GraduationCap, Home, Users, Award, Star, MapPin } from "lucide-react";
import { FreeAdmissionForm } from "@/components/FreeAdmissionForm";
import type { College } from "@/data/catalog";

export const Route = createFileRoute("/courses/$slug")({
  loader: ({ params }) => {
    const course = courses.find((c) => c.slug === params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.course.name} — Eligibility, Fees, Colleges | Visionary Salva` },
      { name: "description", content: loaderData?.course.overview.slice(0, 160) },
      { property: "og:title", content: `${loaderData?.course.name} — Admissions & Top Colleges` },
      { property: "og:description", content: loaderData?.course.overview.slice(0, 160) },
    ],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Course not found</h1>
      <Link to="/courses" className="mt-4 inline-block text-primary font-semibold">Back to all courses →</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-4 py-24 text-center">
      <p className="text-destructive">{error.message}</p>
    </div>
  ),
  component: CourseDetail,
});

function CourseDetail() {
  const { course } = Route.useLoaderData();
  const cat = categories.find((c) => c.id === course.category);
  const allColleges = useColleges();
  const relatedColleges = allColleges.filter((c) => c.categories.includes(course.category));

  return (
    <>
      <section className="gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-8 py-14 md:py-20">
          <div className="flex items-center gap-2 text-xs font-medium opacity-85 mb-4">
            <Link to="/courses" className="hover:underline">Courses</Link>
            <span>›</span>
            <Link to="/courses" search={{ category: course.category }} className="hover:underline">{cat?.name}</Link>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">{course.name}</h1>
          <p className="mt-3 max-w-3xl text-background/85 text-base md:text-lg">{course.overview}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Pill icon={<Clock className="h-4 w-4" />}>{course.duration}</Pill>
            <Pill icon={<Wallet className="h-4 w-4" />}>{course.feesRange}</Pill>
            <Pill icon={<GraduationCap className="h-4 w-4" />}>{cat?.name}</Pill>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10">
          <div className="space-y-8">
            <Block title="Eligibility" icon={<CheckCircle2 className="h-5 w-5" />}>
              <p>{course.eligibility}</p>
            </Block>

            <Block title="Career Opportunities" icon={<Briefcase className="h-5 w-5" />}>
              <ul className="grid sm:grid-cols-2 gap-2">
                {course.career.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />{c}</li>
                ))}
              </ul>
            </Block>

            <Block title="Admission Process" icon={<ArrowRight className="h-5 w-5" />}>
              <ol className="space-y-3">
                {course.process.map((p, i) => (
                  <li key={p} className="flex gap-3 text-sm">
                    <span className="h-7 w-7 grid place-items-center rounded-full gradient-primary text-primary-foreground text-xs font-bold shrink-0">{i + 1}</span>
                    <span className="pt-1">{p}</span>
                  </li>
                ))}
              </ol>
            </Block>

            <Block title="Required Documents" icon={<FileText className="h-5 w-5" />}>
              <ul className="grid sm:grid-cols-2 gap-2">
                {course.documents.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />{d}</li>
                ))}
              </ul>
            </Block>
          </div>

          <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold text-success uppercase tracking-wider">Apply now</span>
            </div>
            <h3 className="font-display text-xl font-bold">Get {course.name} Admission</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">Free counselling on WhatsApp.</p>
            <FreeAdmissionForm defaultCourse={course.name} />
          </aside>
        </div>
      </section>

      {relatedColleges.length > 0 && (
        <section className="bg-muted/40 border-y border-border py-14 md:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-secondary">Where to study</span>
                <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
                  <Building2 className="h-7 w-7 text-primary" /> Top Colleges for {course.name}
                </h2>
                <p className="mt-2 text-muted-foreground text-sm">{relatedColleges.length} partner colleges accept students for {course.name}.</p>
              </div>
              <Link to="/colleges" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">View all colleges <ArrowRight className="h-4 w-4" /></Link>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {relatedColleges.map((c) => <CourseCollegeCard key={c.slug} college={c} courseName={course.name} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function CourseCollegeCard({ college, courseName }: { college: College; courseName: string }) {
  return (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-soft hover:shadow-elegant transition-all">
      <div className="grid sm:grid-cols-[180px_1fr]">
        <Link to="/colleges/$slug" params={{ slug: college.slug }} className="relative h-44 sm:h-full overflow-hidden">
          <img src={college.image} alt={college.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/95 px-2 py-0.5 text-[11px] font-semibold shadow-soft">
            <Star className="h-3 w-3 fill-warning text-warning" /> {college.rating}
          </div>
        </Link>

        <div className="p-5 flex flex-col">
          <Link to="/colleges/$slug" params={{ slug: college.slug }}>
            <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">{college.name}</h3>
          </Link>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {college.location}, {college.country}</span>
            <span className="inline-flex items-center gap-1"><Award className="h-3 w-3 text-secondary" /> {college.affiliation}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <Detail icon={<Wallet className="h-3.5 w-3.5" />} label="Fees" value={college.feesText} />
            {college.seats && <Detail icon={<Users className="h-3.5 w-3.5" />} label="Seats" value={college.seats} />}
            {college.eligibility && <Detail icon={<GraduationCap className="h-3.5 w-3.5" />} label="Eligibility" value={college.eligibility} clamp />}
            {college.hostel && <Detail icon={<Home className="h-3.5 w-3.5" />} label="Hostel" value={college.hostel} clamp />}
            {college.placement && <Detail icon={<Briefcase className="h-3.5 w-3.5" />} label="Placement" value={college.placement} clamp />}
            {college.admission && <Detail icon={<ArrowRight className="h-3.5 w-3.5" />} label="Admission" value={college.admission} clamp />}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Link to="/colleges/$slug" params={{ slug: college.slug }} className="flex-1 text-center rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors">
              Full details
            </Link>
            <Link to="/colleges/$slug" params={{ slug: college.slug }} hash="apply" className="inline-flex items-center justify-center gap-1 rounded-lg gradient-primary text-primary-foreground px-4 py-2 text-xs font-semibold shadow-soft hover:shadow-glow">
              Apply for {courseName} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon, label, value, clamp }: { icon: React.ReactNode; label: string; value: string; clamp?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        <span className="text-primary">{icon}</span>{label}
      </div>
      <div className={`text-foreground/90 ${clamp ? "line-clamp-2" : ""}`}>{value}</div>
    </div>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-background/15 backdrop-blur border border-background/20 px-3 py-1.5 text-sm font-medium">{icon}{children}</span>;
}

function Block({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-xl font-bold flex items-center gap-2 text-foreground"><span className="text-primary">{icon}</span> {title}</h2>
      <div className="mt-4 text-foreground/85 leading-relaxed">{children}</div>
    </div>
  );
}
