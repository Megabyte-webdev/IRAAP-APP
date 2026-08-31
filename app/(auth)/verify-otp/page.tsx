"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Database, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSearch from "@/app/_hooks/use-search";
import StatItem from "../login/_components/StatItem";
import { authService } from "@/app/_services/auth.service";
import { setApiAccessToken } from "@/app/_lib/api-client";
import { useAuth } from "@/app/_context/AuthContext";
import { extractErrorMessage } from "@/app/_lib/utils";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { setAuthDetails } = useAuth();
  const { useHome } = useSearch();
  const { data, isLoading: statsLoading, isError: statsError } = useHome();
  const [challenge, setChallenge] = useState<any>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("iraapOtpChallenge") || "null");
      if (!stored?.challengeId) router.replace("/login");
      else setChallenge(stored);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const maskedEmail = useMemo(() => {
    const email = challenge?.email || "";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return `${name.slice(0, 2)}${"•".repeat(Math.max(1, name.length - 2))}@${domain}`;
  }, [challenge]);

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit verification code.");
      return;
    }
    setBusy(true);
    try {
      const data = await authService.verifyOtp({ challengeId: challenge.challengeId, code });
      setApiAccessToken(data.token!);
      setAuthDetails(data);
      localStorage.setItem("iraapUser", JSON.stringify({ user: data.user }));
      localStorage.removeItem("iraapOtpChallenge");
      const role = data.user.role.toLowerCase();
      const safeCallback =
        typeof challenge.callbackUrl === "string" &&
        challenge.callbackUrl.startsWith(`/${role}`) &&
        !challenge.callbackUrl.startsWith("//")
          ? challenge.callbackUrl
          : null;
      router.replace(safeCallback || `/${role}`);
    } catch (err) {
      setError(extractErrorMessage(err) || "The code is invalid or has expired.");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (!challenge?.challengeId || cooldown > 0) return;
    setError(null);
    setResending(true);
    try {
      const data = await authService.resendOtp(challenge.challengeId);
      const updated = { ...challenge, challengeId: data.challengeId };
      localStorage.setItem("iraapOtpChallenge", JSON.stringify(updated));
      setChallenge(updated);
      setCode("");
      setCooldown(60);
    } catch (err) {
      setError(extractErrorMessage(err) || "We could not resend the code.");
    } finally {
      setResending(false);
    }
  }

  if (!challenge) {
    return <div className="min-h-screen flex items-center justify-center bg-muted"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen w-full bg-muted dark:bg-[#0F172A] text-foreground flex items-center justify-center antialiased p-4 md:p-6 lg:p-8">
      <div className="lg:max-w-6xl grid lg:grid-cols-2 bg-background dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="hidden lg:block relative w-full h-full min-h-155 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="absolute inset-0"><video src="/shapes-grid-flow.mp4" poster="/shapes-grid-flow.jpeg" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-95 dark:mix-blend-screen dark:opacity-85" /></div>
          <div className="absolute inset-0 flex flex-col justify-between p-10 bg-linear-to-b from-white/20 via-transparent to-white/40 dark:from-transparent dark:to-slate-900/60">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/70 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs">
              <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Academic Archive
            </div>
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-950/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 shadow-lg max-w-md">
              <h1 className="text-2xl font-semibold tracking-tight">IRAAP Repository</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">Access archived theses, dissertations, publications, and scholarly research securely from across departments.</p>
              <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                <StatItem label="Projects" value={data?.stats?.projects} loading={statsLoading} error={statsError} />
                <StatItem label="Researchers" value={data?.stats?.researchers} loading={statsLoading} error={statsError} />
                <StatItem label="Supervisors" value={data?.stats?.supervisors} loading={statsLoading} error={statsError} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-16">
          <div className="w-full max-w-90 flex flex-col items-center">
            <Link href="/" className="flex justify-center mb-6"><Image src="/irap-logo.png" alt="IRAP Logo" width={100} height={32} className="object-contain h-15 w-auto" priority /></Link>
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-[22px] font-semibold tracking-tight">Verify your account</h2>
              <p className="mt-1.5 text-xs text-muted-foreground font-medium">Enter the 6-digit code sent to {maskedEmail}.</p>
            </div>
            <form onSubmit={verify} className="w-full space-y-4">
              {error && <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}
              <div className="space-y-1.5">
                <label htmlFor="otp" className="block text-xs font-semibold text-foreground/80 dark:text-slate-200">Verification code</label>
                <input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} disabled={busy} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="h-12 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3 text-center text-lg tracking-[0.45em] font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
              <button type="submit" disabled={busy || code.length !== 6} className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify code"}</button>
              <button type="button" onClick={resend} disabled={resending || cooldown > 0} className="w-full text-xs font-semibold text-primary hover:underline disabled:opacity-50">{resending ? "Sending new code…" : cooldown ? `Resend available in ${cooldown}s` : "Resend code"}</button>
              <Link href={challenge.purpose === "SIGNUP" ? "/signup" : "/login"} className="block text-center text-xs text-muted-foreground hover:text-foreground">Back to {challenge.purpose === "SIGNUP" ? "sign up" : "sign in"}</Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
