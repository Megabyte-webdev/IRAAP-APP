"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "../_components/AuthShell";
import { authService } from "@/app/_services/auth.service";
import { extractErrorMessage } from "@/app/_lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      const data = await authService.forgotPassword(email.trim());
      localStorage.setItem(
        "iraapOtpChallenge",
        JSON.stringify({
          challengeId: data.challengeId,
          email: data.email || email.trim(),
          purpose: "PASSWORD_RESET",
        }),
      );
      router.push("/verify-otp");
    } catch (err) {
      setError(extractErrorMessage(err) || "We could not start password recovery.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Forgot your password?" description="Enter your email address to reset your IRAAP password.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-foreground/80 dark:text-slate-200">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            disabled={busy}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-10 w-full rounded-lg border border-slate-200 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 dark:border-slate-700"
          />
        </div>

        <button type="submit" disabled={busy} className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
        </button>

        <Link href="/login" className="block text-center text-xs text-muted-foreground hover:text-foreground">
          Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}
