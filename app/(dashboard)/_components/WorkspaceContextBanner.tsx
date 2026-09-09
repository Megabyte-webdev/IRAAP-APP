"use client";

import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import { useAuth } from "@/app/_context/AuthContext";
import { getRoleLabel } from "@/app/_utils/roleRouting";

export default function WorkspaceContextBanner() {
  const { authDetails } = useAuth();
  const user = authDetails?.user;

  if (!user?.organizationName) return null;

  return (
    <div className="border-b border-emerald-100 bg-emerald-50/80 px-3 py-2 dark:border-emerald-900/40 dark:bg-emerald-950/20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm dark:bg-slate-900">
            <Building2 size={15} />
          </div>
          <p className="min-w-0 truncate text-xs text-emerald-800 dark:text-emerald-200">
            <span className="font-semibold">{user.organizationName}</span>
            <span className="mx-1 text-emerald-500">·</span>
            <span>{getRoleLabel(user)}</span>
          </p>
        </div>
        <Link href={`/${String(user.organizationRole || "").toUpperCase() === "MANAGER" ? "manager" : "profile"}`} className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100">
          <span className="hidden sm:inline">View organization</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
