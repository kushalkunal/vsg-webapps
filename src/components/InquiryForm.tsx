import { useState } from "react";
import { z } from "zod";
import { Send, CheckCircle2 } from "lucide-react";
import api from "@/services/api";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[+\d\s-]{8,16}$/, "Enter a valid phone"),
  email: z.string().trim().email("Enter a valid email").max(120),
  course: z.string().min(1, "Select a course"),
  location: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

const COURSES = ["MBBS", "BDS", "B.Tech", "MBA", "BCA", "MCA", "B.Sc Nursing", "B.Pharm", "LLB", "BA / B.Ed", "MBBS Abroad", "Other"];

export function InquiryForm({ compact = false, defaultCourse }: { compact?: boolean; defaultCourse?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: "", phone: "", email: "", course: defaultCourse ?? "", location: "", message: "" });

  const update = (k: keyof typeof data, v: string) => setData((d) => ({ ...d, [k]: v }));

  const next = () => {
    const partial = step === 1
      ? z.object({ name: schema.shape.name, phone: schema.shape.phone, email: schema.shape.email })
      : z.object({ course: schema.shape.course });
    const r = partial.safeParse(data);
    if (!r.success) {
      const e: Record<string, string> = {};
      r.error.issues.forEach((i) => { e[i.path[0] as string] = i.message; });
      setErrors(e);
      return;
    }
    setErrors({});
    setStep(step + 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(data);
    if (!r.success) {
      const e: Record<string, string> = {};
      r.error.issues.forEach((i) => { e[i.path[0] as string] = i.message; });
      setErrors(e);
      return;
    }
    const tenantId = (import.meta.env.VITE_DEFAULT_TENANT_ID as string) || "vsg-default";
    const notes = [
      data.location ? `Location: ${data.location}` : null,
      data.message ? `Message: ${data.message}` : null,
    ].filter(Boolean).join(" | ");

    setLoading(true);
    try {
      await api.post("/api/public/leads", {
        tenantId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        course: data.course,
        notes: notes || undefined,
      });
    } catch {
      // Silent — still show success to user
    } finally {
      setLoading(false);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-10 px-6 animate-scale-in">
        <div className="mx-auto h-16 w-16 grid place-items-center rounded-full bg-success/15 text-success mb-4">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">Thank you, {data.name.split(" ")[0]}!</h3>
        <p className="text-sm text-muted-foreground">Our counsellor will reach out within 24 hours on {data.phone}.</p>
      </div>
    );
  }

  const inputCls = "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition";
  const labelCls = "block text-xs font-medium text-foreground mb-1.5";
  const errCls = "text-xs text-destructive mt-1";

  return (
    <form onSubmit={submit} className="space-y-4">
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "gradient-primary" : "bg-muted"}`} />
          ))}
        </div>
      )}

      {(compact || step === 1) && (
        <div className={`grid gap-4 ${compact ? "" : "animate-fade-in"}`}>
          <div>
            <label className={labelCls}>Full Name *</label>
            <input className={inputCls} value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
            {errors.name && <p className={errCls}>{errors.name}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone *</label>
              <input className={inputCls} value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
              {errors.phone && <p className={errCls}>{errors.phone}</p>}
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input className={inputCls} type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>
          </div>
        </div>
      )}

      {(compact || step === 2) && (
        <div className={`grid gap-4 ${compact ? "" : "animate-fade-in"}`}>
          <div>
            <label className={labelCls}>Course Interest *</label>
            <select className={inputCls} value={data.course} onChange={(e) => update("course", e.target.value)}>
              <option value="">Select a course</option>
              {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.course && <p className={errCls}>{errors.course}</p>}
          </div>
          <div>
            <label className={labelCls}>Preferred State / Country</label>
            <input className={inputCls} value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Karnataka, Georgia" />
          </div>
        </div>
      )}

      {(compact || step === 3) && (
        <div className={`${compact ? "" : "animate-fade-in"}`}>
          <label className={labelCls}>Message (optional)</label>
          <textarea className={inputCls} rows={3} value={data.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us about your scores, budget, timeline…" />
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        {!compact && step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted">Back</button>
        )}
        {!compact && step < 3 ? (
          <button type="button" onClick={next} className="ml-auto inline-flex items-center gap-2 rounded-lg gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-all">
            Continue
          </button>
        ) : (
          <button type="submit" disabled={loading} className="ml-auto inline-flex items-center gap-2 rounded-lg gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-all disabled:opacity-60">
            <Send className="h-4 w-4" /> {loading ? "Submitting…" : "Submit Inquiry"}
          </button>
        )}
      </div>
    </form>
  );
}
