import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { MapPin, Award, Building2, Star, CheckCircle2, Home, Phone, BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { FreeAdmissionForm } from "@/components/FreeAdmissionForm";
import { collegeService } from "@/services/collegeService";
import campusImg3 from "@/assets/college-3.jpg";
import heroStudents from "@/assets/hero-students.jpg";

// Education / graduation themed images (local assets)
const CAMPUS_SLIDES = [heroStudents, campusImg3, heroStudents, campusImg3, heroStudents];

function HeroSlideshow({ collegeId }: { collegeId: string }) {
  // Each college gets a deterministic starting slide so they look different
  const startIdx = collegeId.charCodeAt(0) % CAMPUS_SLIDES.length;
  const [active, setActive] = useState(startIdx);

  // Reset to that college's starting slide whenever the college changes
  useEffect(() => {
    setActive(startIdx);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId]);

  // Auto-advance every 4.5 s
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % CAMPUS_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {CAMPUS_SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* subtle brand tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-primary/20 to-secondary/35" />
      {/* bottom fade so the card reads cleanly */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      {/* dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {CAMPUS_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </>
  );
}

export const Route = createFileRoute("/colleges_/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `College Details — Visionary Salva Group` },
      { name: "description", content: "College profile, fee structure and admission guidance." },
    ],
  }),
  component: CollegeDetail,
});

function CollegeDetail() {
  const { id } = Route.useParams();
  const { data: college, isLoading, isError } = useQuery({
    queryKey: ["college", id],
    queryFn: () => collegeService.get(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        Loading college details…
      </div>
    );
  }

  if (isError || !college) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">College not found</h1>
        <Link to="/colleges" className="mt-4 inline-block text-primary font-semibold">
          ← Back to all colleges
        </Link>
      </div>
    );
  }

  const location = [college.city, college.state, college.country].filter(Boolean).join(", ");

  return (
    <>
      {/* Hero Banner */}
      <section className="relative">
        <div className="relative h-72 md:h-96 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/15">
          {college.imageUrl ? (
            <>
              <img
                src={college.imageUrl}
                alt={college.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* subtle brand tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-primary/20 to-secondary/35" />
              {/* bottom fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            </>
          ) : (
            <HeroSlideshow collegeId={college.id} />
          )}
        </div>

        <div className="container mx-auto px-4 lg:px-8 -mt-24 md:-mt-28 relative z-10">
          <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-elegant">
            {/* Breadcrumb */}
            <Link to="/colleges" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-4 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Colleges
            </Link>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start gap-4">
                {college.imageUrl ? (
                  <img
                    src={college.imageUrl}
                    alt={college.name}
                    className="h-16 w-16 rounded-xl object-cover border border-border shadow-soft flex-shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-primary/40" />
                  </div>
                )}
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold text-foreground leading-tight">{college.name}</h1>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                    {location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-primary" /> {location}
                      </span>
                    )}
                    {college.affiliation && (
                      <span className="inline-flex items-center gap-1">
                        <Award className="h-4 w-4 text-secondary" /> {college.affiliation}
                      </span>
                    )}
                    {college.ranking && (
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 text-warning" /> Rank #{college.ranking}
                      </span>
                    )}
                  </div>
                  {/* Approvals */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {college.nmcApproved && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success border border-success/40 rounded-full px-3 py-1 bg-success/5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> NMC Approved
                      </span>
                    )}
                    {college.whoApproved && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary border border-primary/30 rounded-full px-3 py-1 bg-primary/5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> WHO Recognized
                      </span>
                    )}
                    {college.hostelAvailable && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/70 border border-border rounded-full px-3 py-1">
                        <Home className="h-3.5 w-3.5" /> Hostel Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10">
          <div className="space-y-6">
            {college.description && (
              <Block title="About" icon={<BookOpen className="h-5 w-5" />}>
                <p className="text-foreground/85 leading-relaxed">{college.description}</p>
              </Block>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              {college.ranking && (
                <InfoTile label="World Ranking" value={`#${college.ranking}`} />
              )}
              {location && (
                <InfoTile label="Location" value={location} />
              )}
              {college.affiliation && (
                <InfoTile label="Affiliation / University" value={college.affiliation} />
              )}
              <InfoTile label="Hostel" value={college.hostelAvailable ? "Available on campus" : "Not specified"} />
            </div>

            {college.brochureUrl && (
              <Block title="Brochure" icon={<BookOpen className="h-5 w-5" />}>
                <a
                  href={college.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-soft hover:shadow-glow transition-all"
                >
                  Download Brochure
                </a>
              </Block>
            )}

            {/* Map */}
            <Block title="Location">
              <div className="aspect-video rounded-xl overflow-hidden border border-border">
                <iframe
                  title={`${college.name} location`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent([college.name, college.city, college.country].filter(Boolean).join(" "))}&output=embed`}
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
            </Block>
          </div>

          {/* Sidebar CTA */}
          <aside id="apply" className="lg:sticky lg:top-24 self-start space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-semibold text-success uppercase tracking-wider">Free counselling</span>
              </div>
              <h3 className="font-display text-xl font-bold">Apply to {college.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-5">
                Get instant guidance on admission, eligibility and fees on WhatsApp.
              </p>
              <FreeAdmissionForm />
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-3">
              <h4 className="font-semibold text-sm text-foreground">Need help?</h4>
              <p className="text-xs text-muted-foreground">Our counsellors are available Mon–Sat, 9 AM – 7 PM.</p>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Block({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-lg md:text-xl font-bold flex items-center gap-2 text-foreground">
        {icon && <span className="text-primary">{icon}</span>} {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">{label}</div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
