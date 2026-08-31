"use client";

import { AlertCircle, Database, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import useSearch from "@/app/_hooks/use-search";
import StatItem from "../login/_components/StatItem";
import { authService } from "@/app/_services/auth.service";
import { extractErrorMessage } from "@/app/_lib/utils";
import { onFailure, onSuccess } from "@/app/_utils/Notification";

export default function SignupPage() {
  const router = useRouter();
  const { useHome } = useSearch();
  const { data, isLoading: isStatsLoading, isError: isStatsError } = useHome();

  const stats = data?.stats;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      setError("Enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Enter a valid email address.");
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

    setIsSubmitting(true);

    try {
      const authData = await authService.register({
        fullName: cleanName,
        email: cleanEmail,
        password,
      });

      if (!authData.requiresOtp || !authData.challengeId) {
        throw new Error("We could not start email verification.");
      }
      localStorage.setItem(
        "iraapOtpChallenge",
        JSON.stringify({
          challengeId: authData.challengeId,
          email: authData.email || cleanEmail,
          purpose: "SIGNUP",
          callbackUrl: "/student",
        }),
      );
      onSuccess({
        title: "Verify your email",
        message: "We sent a 6-digit verification code to your email.",
      });
      router.replace("/verify-otp");
    } catch (err) {
      const message =
        extractErrorMessage(err) || "We could not create your account.";
      setError(message);
      onFailure({ title: "Sign up failed", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-muted dark:bg-[#0F172A] text-foreground flex items-center justify-center antialiased p-4 md:p-6 lg:p-8">
      <div className="lg:max-w-6xl grid lg:grid-cols-2 bg-background dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* LEFT SIDE: SAME VISUAL/BRANDING PANEL AS LOGIN */}
        <div className="hidden lg:block relative w-full h-full min-h-155 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
            <video
              src="/shapes-grid-flow.mp4"
              poster="/shapes-grid-flow.jpeg"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-95 dark:mix-blend-screen dark:opacity-85"
            />
          </div>

          <div className="absolute inset-0 flex flex-col justify-between p-10 z-10 bg-linear-to-b from-white/20 via-transparent to-white/40 dark:from-transparent dark:to-slate-900/60">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/70 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs">
                <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Academic Archive
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-950/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 shadow-lg max-w-md">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                IRAAP Repository
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Access archived theses, dissertations, publications, and
                scholarly research securely from across departments.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                <StatItem
                  label="Projects"
                  value={stats?.projects}
                  loading={isStatsLoading}
                  error={isStatsError}
                />
                <StatItem
                  label="Researchers"
                  value={stats?.researchers}
                  loading={isStatsLoading}
                  error={isStatsError}
                />
                <StatItem
                  label="Supervisors"
                  value={stats?.supervisors}
                  loading={isStatsLoading}
                  error={isStatsError}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: ONLY THE FORM CONTENT CHANGES */}
        <div className="flex items-center justify-center p-6 md:p-16">
          <div className="w-full max-w-90 flex flex-col items-center">
            <Link href="/" className="flex justify-center mb-6 outline-none">
              <Image
                src="/irap-logo.png"
                alt="IRAP Logo"
                width={100}
                height={32}
                className="object-contain h-15 w-auto transition-transform hover:scale-105 opacity-90"
                priority
              />
            </Link>

            <div className="text-center mb-6">
              <h2 className="text-xl md:text-[22px] font-semibold tracking-tight text-foreground">
                Create your account
              </h2>
              <p className="mt-1.5 text-xs text-muted-foreground font-medium">
                Create a student account to submit and manage your research.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full space-y-4"
              noValidate
            >
              {error && (
                <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-foreground/80 dark:text-slate-200"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  disabled={isSubmitting}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-foreground/80 dark:text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled={isSubmitting}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-foreground/80 dark:text-slate-200"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    disabled={isSubmitting}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background pl-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-foreground/80 dark:text-slate-200"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    disabled={isSubmitting}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background pl-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition focus:outline-none"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold transition hover:opacity-90 focus-visible:outline-none disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create account"
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground pt-1">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
