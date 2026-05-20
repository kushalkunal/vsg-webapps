import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FreeAdmissionForm } from "@/components/FreeAdmissionForm";
import { ADDRESSES, EMAIL, PHONE_NUMBERS, PHONE_TEL, WEBSITE, WHATSAPP_NUMBER } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Free Admission Counselling | Visionary Salva" },
      { name: "description", content: "Talk to our admission counsellors. Call, WhatsApp or fill the form for free, personalised guidance on courses and colleges." },
      { property: "og:title", content: "Contact Visionary Salva Group" },
      { property: "og:description", content: "Free admission counselling — call, WhatsApp or fill the form." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-8 py-16 md:py-20 max-w-4xl text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-warning">Get in touch</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-extrabold tracking-tight">Let's plan your admission journey</h1>
          <p className="mt-4 text-background/85 text-lg">Free counselling, transparent advice, and a team that truly cares.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-11 w-11 grid place-items-center rounded-xl gradient-primary text-primary-foreground"><Phone className="h-5 w-5" /></div>
                <div>
                  <div className="font-display font-bold text-foreground">Call us</div>
                  <div className="text-xs text-muted-foreground">Mon–Sat · 9am – 7pm</div>
                </div>
              </div>
              <div className="space-y-1.5 pl-1">
                {PHONE_NUMBERS.map((p, i) => (
                  <a key={p} href={`tel:${PHONE_TEL[i]}`} className="block text-sm font-semibold text-primary hover:underline">{p}</a>
                ))}
              </div>
            </div>

            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant transition-shadow">
              <div className="h-11 w-11 grid place-items-center rounded-xl bg-[#25D366] text-white shrink-0"><MessageCircle className="h-5 w-5" /></div>
              <div>
                <div className="font-display font-bold text-foreground">WhatsApp</div>
                <div className="text-sm text-muted-foreground">Chat with a counsellor instantly</div>
              </div>
            </a>

            <a href={`mailto:${EMAIL}`} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant transition-shadow">
              <div className="h-11 w-11 grid place-items-center rounded-xl gradient-primary text-primary-foreground shrink-0"><Mail className="h-5 w-5" /></div>
              <div className="min-w-0">
                <div className="font-display font-bold text-foreground">Email</div>
                <div className="text-sm text-muted-foreground break-all">{EMAIL}</div>
              </div>
            </a>

            {ADDRESSES.map((a) => (
              <div key={a.label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="h-11 w-11 grid place-items-center rounded-xl gradient-accent text-accent-foreground shrink-0"><MapPin className="h-5 w-5" /></div>
                <div>
                  <div className="font-display font-bold text-foreground">{a.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{a.line}</div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl overflow-hidden border border-border h-64">
              <iframe title="Office location" src="https://www.google.com/maps?q=New+Tarachak+Patna+Bihar&output=embed" className="h-full w-full" loading="lazy" />
            </div>

            <div className="text-center text-xs text-muted-foreground pt-2">
              Website: <span className="font-semibold text-foreground">{WEBSITE}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-elegant">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold text-success uppercase tracking-wider">Free counseling</span>
            </div>
            <h2 className="font-display text-2xl font-bold">Get Your Free Admission Plan</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-5">Submit your details — they'll be sent directly to our team on WhatsApp.</p>
            <FreeAdmissionForm />
          </div>
        </div>
      </section>
    </>
  );
}
