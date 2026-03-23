"use client";
import { useAuth } from "@/app/_context/AuthContext";
import { Bell, UserCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function Header() {
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
    <header className="sticky top-0 z-10 h-16 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-8 shadow-sm">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600">
          Academic Year: <span className="text-gray-900">2025/2026</span>
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {notificationCount}
              </span>
            )}
          </button>
          {/* Notification dropdown could be added here */}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-full pl-3 pr-2 py-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="User menu"
            aria-expanded={showUserMenu}
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                {user.fullName || user.email}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                {user.role}
              </p>
            </div>
            <div className="relative">
              <UserCircle size={36} className="text-gray-400" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2  w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowUserMenu(false)}
              >
                Your Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowUserMenu(false)}
              >
                Settings
              </Link>
              <button
                onClick={async () => {
                  setShowUserMenu(false);
                  // Import dynamically to avoid circular dependency
                  const { authService } =
                    await import("@/app/_services/auth.service");
                  authService.logout();
                }}
                className="block lg:hidden w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
