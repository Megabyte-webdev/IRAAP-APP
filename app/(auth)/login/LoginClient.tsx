"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, Eye, EyeOff, Database } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (emailStr: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password, callbackUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4" noValidate>
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* EMAIL */}
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
          disabled={isLoading}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
        />
      </div>

      {/* PASSWORD */}
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
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background pl-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
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

      {/* REMEMBER & FORGOT */}
      <div className="flex items-center justify-between pt-1">
        <label
          htmlFor="rememberMe"
          className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none"
        >
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-700 bg-background text-primary focus:ring-primary/20 cursor-pointer"
          />
          Remember for 30 days
        </label>

        <button
          type="button"
          className="text-xs text-muted-foreground font-medium hover:text-primary hover:underline focus:outline-none"
        >
          Forgot password
        </button>
      </div>

      {/* SIGN IN BUTTON */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold transition hover:opacity-90 focus-visible:outline-none disabled:opacity-60"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
      </button>

      {/* GOOGLE SIGN IN */}
      {/* <button
        type="button"
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-background text-sm font-medium transition hover:bg-muted dark:hover:bg-slate-800/50 focus-visible:outline-none"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.072 14.96 0 12 0 7.354 0 3.307 2.655 1.298 6.515l3.968 3.25z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.275c0-.786-.07-1.541-.2-2.275H12v4.51h6.443a5.503 5.503 0 0 1-2.387 3.606l3.713 2.877c2.172-2.001 3.434-4.945 3.434-8.718z"
          />
          <path
            fill="#FBBC05"
            d="M5.266 14.235L1.298 17.49A11.947 11.947 0 0 0 12 24c2.955 0 5.65-.982 7.77-2.664l-3.713-2.877A7.103 7.103 0 0 1 12 19.091a7.077 7.077 0 0 1-6.734-4.856z"
          />
          <path
            fill="#34A853"
            d="M12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.072 14.96 0 12 0 7.354 0 3.307 2.655 1.298 6.515l3.968 3.25A7.042 7.042 0 0 1 12 4.909z"
          />
        </svg>
        <span className="text-xs font-semibold text-foreground/80 dark:text-slate-300">
          Sign in with Google
        </span>
      </button> */}

      {/* FOOTER LINK */}
      {/* <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div> */}
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-muted dark:bg-[#0F172A] text-foreground flex items-center justify-center antialiased p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-background dark:bg-[#1E293B] rounded-4xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* LEFT SIDE: ILLUSTRATION CONTAINER */}
        <div className="hidden lg:block p-4">
          <div className="w-full h-full min-h-145 relative rounded-[1.75rem] bg-muted/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between p-10 overflow-hidden">
            {/* Top Row Branding */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-background dark:bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-muted-foreground dark:text-slate-300">
                <Database className="w-3.5 h-3.5 text-primary/80 dark:text-slate-400" />
                Academic Archive
              </div>
            </div>

            {/* Center Graphic Artwork Mockup */}
            <div className="my-auto flex flex-col items-center justify-center w-full">
              <div className="w-64 aspect-square bg-linear-to-br from-slate-100 dark:from-slate-800/80 via-transparent to-transparent rounded-4xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <Database className="w-16 h-16 text-slate-300 dark:text-slate-700 animate-pulse" />
              </div>
            </div>

            {/* Bottom Content Metadata */}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground dark:text-slate-100">
                IRAAP Repository
              </h1>
              <p className="mt-2 text-muted-foreground text-sm max-w-sm leading-relaxed">
                Access archived theses, dissertations, publications, and
                scholarly research securely from across departments.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xl font-bold text-foreground/90 dark:text-slate-200">
                    4.8k+
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Records
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground/90 dark:text-slate-200">
                    120+
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Supervisors
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground/90 dark:text-slate-200">
                    15+
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Years
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: AUTH FORM */}
        <div className="flex items-center justify-center p-6 sm:p-12 md:p-16">
          <div className="w-full max-w-90 flex flex-col items-center">
            {/* Logo Wrapper */}
            <Link href="/" className="flex justify-center mb-6 outline-none">
              <Image
                src="/irap-logo.png"
                alt="IRAP Logo"
                width={100}
                height={32}
                className="object-contain h-15 w-auto transition-transform hover:scale-105  opacity-90"
                priority
              />
            </Link>

            {/* Header Content */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Log in to your account
              </h2>
              <p className="mt-1.5 text-xs text-muted-foreground font-medium">
                Welcome back! Please enter your details.
              </p>
            </div>

            {/* Form Section */}
            <div className="w-full">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                }
              >
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
