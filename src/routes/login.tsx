import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { getAuthToken } from "@/stores/authStore";
import logo from "@/assets/logo-vsg.png";
import logoScaliolab from "@/assets/logo-scaliolab.png";

const credSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});
type CredValues = z.infer<typeof credSchema>;
type OtpValues  = z.infer<typeof otpSchema>;

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }).parse,
  beforeLoad: () => {
    if (getAuthToken()) throw redirect({ to: "/admin/dashboard" });
  },
  component: LoginPage,
});

function LoginPage() {
  const { redirect: redirectTo = "/admin/dashboard" } = Route.useSearch();
  const navigate = useNavigate();
  const [showPwd, setShowPwd]       = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [step, setStep]             = useState<"credentials" | "otp">("credentials");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpHint, setOtpHint]       = useState("");

  const credForm = useForm<CredValues>({ resolver: zodResolver(credSchema) });
  const otpForm  = useForm<OtpValues>({ resolver: zodResolver(otpSchema) });

  const onCredSubmit = async (values: CredValues) => {
    setServerError(null);
    try {
      await authService.login(values.email, values.password);
      navigate({ to: redirectTo });
    } catch {
      setServerError("Invalid email or password. Please try again.");
    }
  };

  const onOtpSubmit = async (values: OtpValues) => {
    setServerError(null);
    try {
      await authService.loginVerify(pendingEmail, values.otp);
      navigate({ to: redirectTo });
    } catch {
      setServerError("Invalid or expired OTP. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Admin Portal</h1>
              <p className="mt-1 text-sm text-muted-foreground">Visionary Salva Group</p>
            </div>
          </div>

          {serverError && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          {/* â”€â”€ Step 1: Credentials â”€â”€ */}
          {step === "credentials" && (
            <form onSubmit={credForm.handleSubmit(onCredSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  {...credForm.register("email")}
                />
                {credForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{credForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-10"
                    {...credForm.register("password")}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {credForm.formState.errors.password && (
                  <p className="text-xs text-destructive">{credForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={credForm.formState.isSubmitting}>
                {credForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </form>
          )}

          {/* â”€â”€ Step 2: OTP â”€â”€ */}
          {step === "otp" && (
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-5">
              <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                {otpHint || `A 6-digit code was sent to your email.`}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="otp">One-Time Code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  autoComplete="one-time-code"
                  autoFocus
                  {...otpForm.register("otp")}
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-xs text-destructive">{otpForm.formState.errors.otp.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={otpForm.formState.isSubmitting}>
                {otpForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Sign In
              </Button>

              <button
                type="button"
                onClick={() => { setStep("credentials"); setServerError(null); }}
                className="flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Protected admin area. Unauthorized access is prohibited.
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">← Back to website</a>
        </p>

        {/* Designed & Managed by */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground/60">Designed &amp; Managed by</span>
          <a
            href="https://scaliolab.com"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/50 hover:opacity-80"
          >
            <img src={logoScaliolab} alt="Scalio Lab" className="h-4 w-4 rounded-sm object-contain" />
            Scalio Lab
          </a>
        </div>
      </div>
    </div>
  );
}
