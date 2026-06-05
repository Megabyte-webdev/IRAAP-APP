"use client";

import { useState } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Database,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const { login } = useAuth();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl min-h-screen px-6 lg:px-10 flex items-center">
        <div className="w-full grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-border bg-card">
          {/* LEFT SIDE */}
          <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border bg-muted/30">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
                <Database className="w-4 h-4" />
                Academic Archive
              </div>

              <h1 className="mt-8 text-5xl xl:text-6xl font-semibold tracking-tight">
                IRAAP Repository
              </h1>

              <p className="mt-6 max-w-lg text-muted-foreground text-lg leading-relaxed">
                Access archived theses, dissertations, publications, and
                scholarly research from across departments and faculties.
              </p>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">
                    Indexed academic research
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">
                    Faculty-reviewed submissions
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-muted-foreground">
                    Departmental knowledge archive
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border">
              <div>
                <div className="text-3xl font-bold">4.8k+</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  Records
                </div>
              </div>

              <div>
                <div className="text-3xl font-bold">120+</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  Supervisors
                </div>
              </div>

              <div>
                <div className="text-3xl font-bold">15+</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  Years
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-md">
              <Link href="/" className="flex justify-center mb-8">
                <Image
                  src="/irap-logo.png"
                  alt="IRAP"
                  width={120}
                  height={40}
                  className="object-contain h-18 w-auto transition-transform hover:scale-105"
                />
              </Link>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Sign In
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Access the research repository portal
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                {error && (
                  <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                    <input
                      type="email"
                      value={email}
                      disabled={isLoading}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@institution.edu"
                      className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">Password</label>

                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      disabled={isLoading}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-12 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* REMEMBER */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border"
                    />
                    Remember me
                  </label>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-foreground text-background font-medium transition hover:opacity-90 disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-border pt-6 text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Secure Academic Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
