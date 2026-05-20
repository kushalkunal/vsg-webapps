import { useState } from "react";
import { z } from "zod";
import { Send, CheckCircle2, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/contact";
import api from "@/services/api";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[+\d\s-]{8,16}$/, "Enter a valid phone"),
  course: z.string().trim().min(1, "Select a course").max(80),
  marks: z.string().trim().max(60).optional().or(z.literal("")),
  state: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(400).optional().or(z.literal("")),
});

const COURSES = [
  "MBBS", "BDS", "MD/MS", "B.Tech", "MBA", "MCA", "BCA",
  "B.Sc Nursing", "B.Pharm", "LLB", "BA", "B.Ed", "MSc",
  "MBBS Abroad", "Other",
];

export function FreeAdmissionForm({ defaultCourse }: { defaultCourse?: string }) {
  const [data, setData] = useState({
    name: "", phone: "", course: defaultCourse ?? "",
    marks: "", state: "", message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof data, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(data);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});

    const tenantId = (import.meta.env.VITE_DEFAULT_TENANT_ID as string) || "vsg-default";
    const notes = [
      data.marks ? `Marks/Rank: ${data.marks}` : null,
      data.state ? `State: ${data.state}` : null,
      data.message ? `Message: ${data.message}` : null,
    ].filter(Boolean).join(" | ");

    setLoading(true);
    try {
      await api.post("/api/public/leads", {
        tenantId,
        name: data.name,
        phone: data.phone,
        course: data.course,
        notes: notes || undefined,
      });
    } catch {
      // Silent — still open WhatsApp as fallback
    } finally {
      setLoading(false);
    }

    const text = [
      "Hello, I want free counseling.",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Course: ${data.course}`,
      `Marks/Rank: ${data.marks || "-"}`,
      `State: ${data.state || "-"}`,
      data.message ? `Message: ${data.message}` : null,
    ].filter(Boolean).join("\n");

    window.open(buildWhatsAppLink(text), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-10 px-6 animate-scale-in">
        <div className="mx-auto h-16 w-16 grid place-items-center rounded-full bg-success/15 text-success mb-4">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          You're all set, {data.name.split(" ")[0]}!
        </h3>
        <p className="text-sm text-muted-foreground">
          We've opened WhatsApp with your details — just press send.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-5 text-sm font-semibold text-primary hover:underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const inputCls = "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition";
  const labelCls = "block text-xs font-semibold text-foreground mb-1.5";
  const errCls = "text-xs text-destructive mt-1";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={labelCls}>Student Name *</label>
        <input className={inputCls} value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" />
        {errors.name && <p className={errCls}>{errors.name}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Phone Number *</label>
          <input className={inputCls} value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
          {errors.phone && <p className={errCls}>{errors.phone}</p>}
        </div>
        <div>
          <label className={labelCls}>Course Interested In *</label>
          <select className={inputCls} value={data.course} onChange={(e) => update("course", e.target.value)}>
            <option value="">Select a course</option>
            {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.course && <p className={errCls}>{errors.course}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Marks / Rank</label>
          <input className={inputCls} value={data.marks} onChange={(e) => update("marks", e.target.value)} placeholder="e.g. 85% / NEET 12000" />
        </div>
        <div>
          <label className={labelCls}>State</label>
          <input className={inputCls} value={data.state} onChange={(e) => update("state", e.target.value)} placeholder="e.g. Bihar" />
        </div>
      </div>

      <div>
        <label className={labelCls}>Message (optional)</label>
        <textarea className={inputCls} rows={3} value={data.message} onChange={(e) => update("message", e.target.value)} placeholder="Anything else we should know?" />
      </div>

      <button type="submit" disabled={loading} className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] disabled:opacity-60 text-white px-5 py-3 text-sm font-semibold shadow-soft transition-colors">
        <MessageCircle className="h-4 w-4" /> {loading ? "Sending…" : "Send on WhatsApp"}
        {!loading && <Send className="h-3.5 w-3.5" />}
      </button>
      <p className="text-[11px] text-center text-muted-foreground">
        Your details will be shared directly with our counselling team via WhatsApp.
      </p>
    </form>
  );
}
