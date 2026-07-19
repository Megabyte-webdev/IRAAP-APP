"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-xs px-6 py-8 flex flex-col items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-xl dark:shadow-2xl/40">
        {/* Spinner Section */}
        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 mb-5">
          <Loader2
            className="h-6 w-6 animate-spin text-primary dark:text-primary/80"
            strokeWidth={2.25}
          />
        </div>

        {/* Text Details */}
        <div className="text-center w-full space-y-1 mb-4">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Syncing Workspace
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Preparing your dashboard environment...
          </p>
        </div>
      </div>
    </div>
  );
}
