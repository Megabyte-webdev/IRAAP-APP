import { Database, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-muted dark:bg-[#0F172A] text-foreground flex items-center justify-center antialiased p-4 md:p-6 lg:p-8">
      <div className="w-full lg:max-w-6xl grid lg:grid-cols-2 bg-background dark:bg-[#1E293B] rounded-4xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* LEFT SIDE: FULL-BLEED VISUAL LAYER */}
        <div className="hidden lg:block relative w-full h-full min-h-155 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Edge-to-Edge Video Layout */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
            <video
              src="/shapes-grid-flow.mp4"
              poster="/Shapes_flowing_into_grid_2K_202607151236.jpeg"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-95 dark:mix-blend-screen dark:opacity-85"
            />
          </div>

          {/* Foreground UI Layer (Overlayed over the full-bleed video) */}
          <div className="absolute inset-0 flex flex-col justify-between p-10 z-10 bg-gradient-to-b from-white/20 via-transparent to-white/40 dark:from-transparent dark:to-slate-900/60">
            {/* Top Row Branding */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/70 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs">
                <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Academic Archive
              </div>
            </div>

            {/* Bottom Content Metadata */}
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-950/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 shadow-lg max-w-md">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                IRAAP Repository
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Access archived theses, dissertations, publications, and
                scholarly research securely from across departments.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                <div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-200">
                    4.8k+
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    Records
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-200">
                    120+
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    Supervisors
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-200">
                    15+
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    Years
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: AUTH FORM */}
        <div className="flex items-center justify-center p-6 md:p-16">
          <div className="w-full max-w-90 flex flex-col items-center">
            {/* Logo Wrapper */}
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
