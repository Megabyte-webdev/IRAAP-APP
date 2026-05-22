"use client";
import { useAuth } from "@/app/_context/AuthContext";
import { Bell, UserCircle, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ProfileDropdown from "@/app/_components/ProfileDropdown";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { authDetails, isLoading: authLoading } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = authDetails?.user;

  // Simulated notification count (replace with real data)
  const notificationCount = 3;

  // Loading state – skeleton
  if (authLoading) {
    return (
      <header className="h-16 border-b bg-white flex items-center justify-between px-8">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="flex items-center gap-6">
          <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
          <div className="flex items-center gap-3 pl-6 border-l">
            <div className="text-right">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      </header>
    );
  }

  // Fallback if user is missing (should not happen on protected pages)
  if (!user) {
    return (
      <header className="h-16 border-b bg-white flex items-center justify-between px-8">
        <div className="text-sm text-gray-500">Academic Year: 2025/2026</div>
        <Link
          href="/login"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign In
        </Link>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 h-18 border-b border-tertiary bg-white/80  flex items-center justify-between px-4 sm:px-8">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-600 lg:hidden hover:bg-gray-100 rounded-md"
        >
          <Menu size={24} />
        </button>
        <span className="hidden md:block text-sm font-bold text-black">
          Good day, {user.fullName}
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={24} />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {notificationCount}
              </span>
            )}
          </button>
          {/* Notification dropdown could be added here */}
        </div>

        {/* User menu */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
