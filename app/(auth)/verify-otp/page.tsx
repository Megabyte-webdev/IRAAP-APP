"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthShell from "../_components/AuthShell";
import { authService } from "@/app/_services/auth.service";
import { setApiAccessToken } from "@/app/_lib/api-client";
import { useAuth } from "@/app/_context/AuthContext";
import { extractErrorMessage } from "@/app/_lib/utils";

/**
 * Keep this value aligned with the backend OTP challenge TTL.
 * The backend remains the authority for whether an OTP is actually valid.
 */
const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_SECONDS = 60;

interface OtpChallenge {
  challengeId: string;
  email: string;
  purpose: "SIGNUP" | "LOGIN" | "PASSWORD_RESET";
  callbackUrl?: string;
  expiresAt?: number;
}

function formatCountdown(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const { setAuthDetails } = useAuth();

  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const allowUnloadRef = useRef(false);

  const otpExpired = remainingSeconds <= 0;
  const countdownLabel = formatCountdown(remainingSeconds);
  const isPasswordReset = challenge?.purpose === "PASSWORD_RESET";

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("iraapOtpChallenge") || "null",
      ) as OtpChallenge | null;

      if (!stored?.challengeId) {
        router.replace("/login");
        return;
      }

      const resolvedExpiry =
        typeof stored.expiresAt === "number" && stored.expiresAt > 0
          ? stored.expiresAt
          : Date.now() + OTP_TTL_MS;

      const normalized: OtpChallenge = {
        ...stored,
        expiresAt: resolvedExpiry,
      };

      localStorage.setItem(
        "iraapOtpChallenge",
        JSON.stringify(normalized),
      );

      setChallenge(normalized);
      setExpiresAt(resolvedExpiry);
      setRemainingSeconds(
        Math.max(0, Math.ceil((resolvedExpiry - Date.now()) / 1000)),
      );
    } catch {
      router.replace("/login");
    }
  }, [router]);

  /**
   * Protect the verification screen from accidental browser reload/close.
   * The browser controls the exact wording of the confirmation dialog.
   *
   * The OTP challenge is already persisted in localStorage, so if a browser
   * still navigates away, the page can recover the challenge and countdown.
   */
  useEffect(() => {
    if (!challenge || otpExpired) {
      allowUnloadRef.current = false;
      return;
    }

    allowUnloadRef.current = true;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!allowUnloadRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [challenge, otpExpired]);

  useEffect(() => {
    if (!cooldown) return;

    const timer = window.setInterval(() => {
      setCooldown((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!expiresAt) return;

    const updateRemaining = () => {
      const seconds = Math.max(
        0,
        Math.ceil((expiresAt - Date.now()) / 1000),
      );

      setRemainingSeconds(seconds);
    };

    updateRemaining();

    const timer = window.setInterval(updateRemaining, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const maskedEmail = useMemo(() => {
    const email = challenge?.email || "";
    const [name, domain] = email.split("@");

    if (!name || !domain) return email;

    return `${name.slice(0, 2)}${"•".repeat(
      Math.max(1, name.length - 2),
    )}@${domain}`;
  }, [challenge]);

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!challenge || !/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    if (otpExpired) {
      setError("This verification code has expired. Request a new code.");
      return;
    }

    if (isPasswordReset) {
      if (password.length < 8) {
        setError("Your new password must be at least 8 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Your passwords do not match.");
        return;
      }
    }

    setBusy(true);
    allowUnloadRef.current = false;

    try {
      if (challenge.purpose === "PASSWORD_RESET") {
        await authService.resetPassword({
          challengeId: challenge.challengeId,
          code,
          password,
        });

        localStorage.removeItem("iraapOtpChallenge");
        router.replace("/login?reset=success");
        return;
      }

      const data = await authService.verifyOtp({
        challengeId: challenge.challengeId,
        code,
      });

      setApiAccessToken(data.token!);
      setAuthDetails(data);
      localStorage.setItem("iraapUser", JSON.stringify(data));
      localStorage.removeItem("iraapOtpChallenge");

      const role = data.user.role.toLowerCase();

      if (challenge.purpose === "SIGNUP") {
        router.replace(`/${role}/profile?onboarding=1`);
        return;
      }

      const safeCallback =
        typeof challenge.callbackUrl === "string" &&
        challenge.callbackUrl.startsWith(`/${role}`) &&
        !challenge.callbackUrl.startsWith("//")
          ? challenge.callbackUrl
          : null;

      router.replace(safeCallback || `/${role}`);
    } catch (err) {
      setError(
        extractErrorMessage(err) ||
          "The code is invalid or has expired.",
      );
    } finally {
      setBusy(false);
      if (challenge && !otpExpired) {
        allowUnloadRef.current = true;
      }
    }
  }

  async function resend() {
    if (!challenge?.challengeId || cooldown > 0 || resending) {
      return;
    }

    setError(null);
    setResending(true);

    try {
      const data = await authService.resendOtp(
        challenge.challengeId,
      );

      const newExpiresAt = Date.now() + OTP_TTL_MS;

      const updated: OtpChallenge = {
        ...challenge,
        challengeId: data.challengeId,
        expiresAt: newExpiresAt,
      };

      localStorage.setItem(
        "iraapOtpChallenge",
        JSON.stringify(updated),
      );

      setChallenge(updated);
      setExpiresAt(newExpiresAt);
      setRemainingSeconds(
        Math.ceil((newExpiresAt - Date.now()) / 1000),
      );
      setCode("");
      setCooldown(RESEND_COOLDOWN_SECONDS);

      if (updated.purpose === "PASSWORD_RESET") {
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(
        extractErrorMessage(err) ||
          "We could not resend the code.",
      );
    } finally {
      setResending(false);
    }
  }

  if (!challenge) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted dark:bg-[#0F172A]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const destination =
    challenge.purpose === "SIGNUP" ? "/signup" : "/login";
  const destinationLabel =
    challenge.purpose === "SIGNUP" ? "sign up" : "sign in";

  return (
    <AuthShell
      title="Verify your account"
      description={`Enter the 6-digit code sent to ${maskedEmail}.`}
    >
      <form
        onSubmit={verify}
        className="w-full space-y-4"
        noValidate
      >
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Clock3 className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-foreground dark:text-slate-200">
                  Code expires in
                </p>
                <p
                  className={`font-mono text-lg font-bold tabular-nums ${
                    otpExpired
                      ? "text-destructive"
                      : remainingSeconds <= 60
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-primary"
                  }`}
                >
                  {countdownLabel}
                </p>
              </div>
            </div>

            {!otpExpired && (
              <div className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </div>
            )}

            {otpExpired && (
              <div className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                Expired
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="otp"
            className="block text-xs font-semibold text-foreground/80 dark:text-slate-200"
          >
            Verification code
          </label>

          <input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            disabled={busy || otpExpired}
            onChange={(event) =>
              setCode(
                event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6),
              )
            }
            placeholder="000000"
            className="h-12 w-full rounded-lg border border-slate-200 bg-background px-3 text-center text-lg font-semibold tracking-[0.45em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
          />
        </div>

        {isPasswordReset && (
          <>
            <div className="space-y-1.5">
              <label
                htmlFor="new-password"
                className="block text-xs font-semibold text-foreground/80 dark:text-slate-200"
              >
                New password
              </label>

              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={busy}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="At least 8 characters"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-background px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 dark:border-slate-700"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirm-password"
                className="block text-xs font-semibold text-foreground/80 dark:text-slate-200"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  disabled={busy}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter your new password again"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-background px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 dark:border-slate-700"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={
            busy ||
            otpExpired ||
            code.length !== 6 ||
            (isPasswordReset &&
              (password.length < 8 ||
                password !== confirmPassword))
          }
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : otpExpired ? (
            "Code expired"
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Verify code
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resend}
          disabled={resending || cooldown > 0}
          className="w-full text-xs font-semibold text-primary hover:underline disabled:opacity-50"
        >
          {resending
            ? "Sending new code…"
            : cooldown > 0
              ? `Resend available in ${cooldown}s`
              : otpExpired
                ? "Send a new verification code"
                : "Resend code"}
        </button>

        <Link
          href={destination}
          className="block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Back to {destinationLabel}
        </Link>
      </form>
    </AuthShell>
  );
}
