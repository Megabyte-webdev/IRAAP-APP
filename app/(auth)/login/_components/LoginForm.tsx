"use client";
import { useState } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  // Grab isLoading directly from context!
  const { login, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      await login(email, password, callbackUrl);
    } catch (err) {
      // AuthContext handles onFailure toast, but we capture error text for inline banner
      setError(
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please try again.",
      );
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
      <div className="flex gap-2 items-center justify-between pt-1">
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
    </form>
  );
}

export default LoginForm;
