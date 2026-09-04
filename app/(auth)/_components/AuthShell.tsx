"use client";

import { Database } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import useSearch from "@/app/_hooks/use-search";
import StatItem from "../login/_components/StatItem";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function AuthShell({
  title,
  description,
  children,
}: AuthShellProps) {
  const { useHome } = useSearch();
  const { data, isLoading, isError } = useHome();
  const stats = data?.stats;

  return (
    <main className="min-h-screen w-full bg-muted dark:bg-[#0F172A] text-foreground antialiased p-4 flex items-center justify-center">
      <div className="w-90 lg:w-full max-w-205 md:min-h-[calc(100vh-2rem)] lg:h-150 lg:max-h-[calc(100vh-3rem)] lg:min-h-150 overflow-hidden border border-slate-200 bg-background shadow-2xl dark:border-slate-800 dark:bg-[#1E293B] lg:grid lg:grid-cols-2">
        {/* FIRST SECTION */}
        <section
          aria-hidden="true"
          className="self-stretch relative hidden min-h-0 overflow-hidden bg-white dark:bg-slate-900 lg:block"
        >
          <div className="absolute inset-0 pointer-events-none select-none">
            <video
              src="/shapes-grid-flow.mp4"
              poster="/shapes-grid-flow.jpeg"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover opacity-95 dark:mix-blend-screen dark:opacity-85"
            />
          </div>

          <div className="absolute inset-0 z-10 flex flex-col justify-between bg-linear-to-b from-white/20 via-transparent to-white/40 p-10 dark:from-transparent dark:to-slate-900/60">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
                <Database className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Academic Archive
              </div>
            </div>

            <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/40">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                IRAAP Repository
              </h1>

              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Access archived theses, dissertations, publications, and
                scholarly research securely from across departments.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
                <StatItem
                  label="Projects"
                  value={stats?.projects}
                  loading={isLoading}
                  error={isError}
                />

                <StatItem
                  label="Researchers"
                  value={stats?.researchers}
                  loading={isLoading}
                  error={isError}
                />

                <StatItem
                  label="Supervisors"
                  value={stats?.supervisors}
                  loading={isLoading}
                  error={isError}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECOND SECTION */}
        <section className="md:min-h-[calc(100vh-2rem)] lg:min-h-0 max-h-full overflow-y-auto flex items-center justify-center">
          <div className="flex h-full items-center justify-center p-6 md:p-10 lg:p-12 xl:p-16">
            <div className="h-max w-full max-w-sm">
              <Link
                href="/"
                className="mx-auto mb-6 flex w-fit rounded-md outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label="Go to IRAAP home"
              >
                <Image
                  src="/irap-logo.png"
                  alt="IRAAP Repository"
                  width={100}
                  height={32}
                  className="h-15 w-auto object-contain opacity-90"
                  priority
                />
              </Link>

              <header className="mb-6 text-center">
                <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-[22px]">
                  {title}
                </h2>

                <p className="mt-1.5 text-xs font-medium text-muted-foreground">
                  {description}
                </p>
              </header>

              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
