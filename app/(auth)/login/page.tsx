"use client";

import { useState } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, AlertCircle, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

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

    setIsLoading(true);
    try {
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
    <div className="relative flex min-h-screen items-center justify-center bg-[#fafafa] p-4 overflow-hidden">
      {/* Subtle Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />

      <div className="w-full max-w-110 z-10">
        <div className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Portal Login
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/30 pl-11 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 disabled:opacity-50 transition-all outline-none"
                    placeholder="name@university.edu"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/30 pl-11 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 disabled:opacity-50 transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full flex items-center justify-center rounded-xl bg-gray-900 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-gray-200 hover:bg-black focus:ring-4 focus:ring-gray-900/10 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
              Secure Department Access
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
              Contact Admin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
