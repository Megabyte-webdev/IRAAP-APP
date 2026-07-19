"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ProfileDropdown from "@/app/_components/ProfileDropdown";
import ThemeButton from "@/app/_components/ThemeButton";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { authDetails, isLoading: authLoading } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const user = authDetails?.user;

  // Simulated notification count (replace with real data)
  const notificationCount = 3;

  // Loading state – skeleton
  if (authLoading) {
    return (
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] flex items-center justify-between px-8">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-6">
          <div className="h-8 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-1 h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </header>
    );
  }

  // Fallback if user is missing (should not happen on protected pages)
  if (!user) {
    return (
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] flex items-center justify-between px-8">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Academic Year: 2025/2026
        </div>
        <Link
          href="/login"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Sign In
        </Link>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 h-18 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 transition-colors">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-600 dark:text-slate-300 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
        >
          <Menu size={24} />
        </button>
        <span className="hidden md:block text-sm font-bold text-slate-900 dark:text-slate-100">
          Good day, {user.fullName}
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <ThemeButton />
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={24} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#1E293B]">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* User menu */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
