"use client";

import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AuthShell from "../_components/AuthShell";
import { authService } from "@/app/_services/auth.service";
import { extractErrorMessage } from "@/app/_lib/utils";
import { onFailure, onSuccess } from "@/app/_utils/Notification";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("iraapOtpChallenge") || "null",
      );

      if (
        !stored?.challengeId ||
        stored?.purpose !== "PASSWORD_RESET"
      ) {
        router.replace("/forgot-password");
        return;
      }

      setChallengeId(stored.challengeId);
      setEmail(stored.email || "");
    } catch {
      router.replace("/forgot-password");
    }
  }, [router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!challengeId) return;

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await authService.resetPassword({
        challengeId,
        code,
        password,
      });

      localStorage.removeItem("iraapOtpChallenge");

      onSuccess({
        title: "Password reset",
        message: "Your password has been changed. Please sign in again.",
      });

      router.replace("/login");
    } catch (err) {
      const message =
        extractErrorMessage(err) ||
        "The code is invalid or the password could not be changed.";
      setError(message);
      onFailure({ title: "Password reset failed", message });
    } finally {
      setBusy(false);
    }
  }

  if (!challengeId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted dark:bg-[#0F172A]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      description={
        email
          ? `If an IRAAP account exists for ${email}, enter the verification code and choose a new password.`
          : "Enter the verification code and choose a new password."
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="code"
            className="block text-xs font-semibold text-foreground/80 dark:text-slate-200"
          >
            Verification code
          </label>
          <input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            disabled={busy}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            className="h-12 w-full rounded-lg border border-slate-200 bg-background px-3 text-center text-lg font-semibold tracking-[0.45em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 dark:border-slate-700"
          />
        </div>

        {[
          {
            id: "password",
            label: "New password",
            value: password,
            setValue: setPassword,
            show: showPassword,
            setShow: setShowPassword,
          },
          {
            id: "confirmPassword",
            label: "Confirm password",
            value: confirmPassword,
            setValue: setConfirmPassword,
            show: showConfirm,
            setShow: setShowConfirm,
          },
        ].map((field) => (
          <div key={field.id} className="space-y-1.5">
            <label
              htmlFor={field.id}
              className="block text-xs font-semibold text-foreground/80 dark:text-slate-200"
            >
              {field.label}
            </label>
            <div className="relative">
              <input
                id={field.id}
                type={field.show ? "text" : "password"}
                value={field.value}
                disabled={busy}
                onChange={(e) => field.setValue(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-10 w-full rounded-lg border border-slate-200 bg-background pl-3 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 dark:border-slate-700"
              />
              <button
                type="button"
                onClick={() => field.setShow((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                aria-label={field.show ? "Hide password" : "Show password"}
              >
                {field.show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={busy || code.length !== 6}
          className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset password"}
        </button>

        <Link
          href="/login"
          className="block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}
