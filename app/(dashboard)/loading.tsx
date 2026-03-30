"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        {/* Outer Glow Effect */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-indigo-400/20 duration-2000" />

        {/* Main Spinner */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl border border-slate-100">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>

        {/* Loading Text */}
        <div className="mt-6 flex flex-col items-center gap-1">
          <h2 className="text-sm font-bold tracking-widest text-slate-800 uppercase">
            Syncing Workspace
          </h2>
          <p className="text-[10px] font-medium text-slate-400 italic">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}
