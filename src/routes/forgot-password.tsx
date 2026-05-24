import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import logo from "@/assets/logo-vsg.png";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await authService.forgotPassword(values.email);
    setSent(true);
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
              <h1 className="font-display text-2xl font-bold text-foreground">Forgot Password</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email to receive a reset link
              </p>
            </div>
          </div>

          {sent ? (
            <div className="space-y-4 text-center">
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                If that email is registered, a reset link has been sent. Check your inbox.
              </div>
              <Link to="/login" className="block text-sm text-primary hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  autoFocus
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
