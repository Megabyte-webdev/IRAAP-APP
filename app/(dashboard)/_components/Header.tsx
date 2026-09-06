"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ProfileDropdown from "@/app/_components/ProfileDropdown";
import useChat from "@/app/_hooks/use-chat";
import { useNotifications } from "@/app/_hooks/use-notifications";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { authDetails, isLoading: authLoading } = useAuth();
  const { getConversations } = useChat();

  const { data } = getConversations();

  const conversations = data?.pages.flatMap((page) => page.data) ?? [];

  const chatUnreadCount = conversations.reduce(
    (total, conversation) => total + (conversation.unreadCount ?? 0),
    0,
  );
  const { query: notificationsQuery, markRead, markAllRead } = useNotifications();
  const notifications = notificationsQuery.data?.notifications ?? [];
  const notificationCount = Number(notificationsQuery.data?.unreadCount ?? 0);
  const [showNotifications, setShowNotifications] = useState(false);
  const user = authDetails?.user;

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
    <header data-tour="header" className="sticky top-0 z-10 h-18 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 transition-colors">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          data-tour="mobile-menu"
          onClick={onMenuClick}
          aria-label="Open navigation"
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
        {/* <ThemeButton /> */}
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-[#1E293B]">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-[#1E293B]">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
                  <p className="text-[11px] text-slate-500">{notificationCount} unread</p>
                </div>
                {notificationCount > 0 && (
                  <button onClick={() => markAllRead.mutate()} className="text-xs font-semibold text-primary hover:underline">Mark all read</button>
                )}
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-slate-500">You're all caught up.</div>
                ) : notifications.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!item.readAt) markRead.mutate(item.id);
                      if (item.link) window.location.assign(item.link);
                    }}
                    className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60 ${!item.readAt ? "bg-indigo-50/60 dark:bg-indigo-950/20" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.readAt ? "bg-slate-300" : "bg-primary"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.message}</p>
                        <p className="mt-1 text-[10px] text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
