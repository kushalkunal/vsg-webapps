import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import logo from "@/assets/logo-vsg.png";

const schema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string(),
}).refine((d) => d.newPassword === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/reset-password")({
  validateSearch: z.object({ token: z.string().optional() }).parse,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate   = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [done, setDone]       = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    if (!token) { setError("Invalid reset link."); return; }
    setError(null);
    try {
      await authService.resetPassword(token, values.newPassword);
      setDone(true);
      setTimeout(() => navigate({ to: "/login" }), 3000);
    } catch {
      setError("Reset link is invalid or has expired. Please request a new one.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Reset Password</h1>
              <p className="mt-1 text-sm text-muted-foreground">Enter your new password</p>
            </div>
          </div>

          {done ? (
            <div className="space-y-3 text-center">
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                Password updated! Redirecting to sign in…
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {!token && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Invalid reset link. Please request a new one.
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                    {...register("newPassword")}
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
                {errors.newPassword && (
                  <p className="text-xs text-destructive">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirm")}
                />
                {errors.confirm && (
                  <p className="text-xs text-destructive">{errors.confirm.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || !token}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Set New Password
              </Button>

              <Link
                to="/forgot-password"
                className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Request a new reset link
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
