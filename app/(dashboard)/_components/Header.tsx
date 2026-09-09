"use client";

import { useAuth } from "@/app/_context/AuthContext";
import {
  Bell,
  Check,
  ChevronRight,
  Menu,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProfileDropdown from "@/app/_components/ProfileDropdown";
import useChat from "@/app/_hooks/use-chat";
import { useNotifications } from "@/app/_hooks/use-notifications";
import NotificationList from "./NotificationList";

const formatNotificationTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const getNotificationTone = (type?: string) => {
  if (type?.includes("CHAT"))
    return "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300";
  if (type?.includes("SUPPORT"))
    return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300";
  if (type?.includes("ORGANIZATION") || type?.includes("ACCOUNT"))
    return "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-300";
  if (type?.includes("MEETING"))
    return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
};

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { authDetails, isLoading: authLoading } = useAuth();
  const { getConversations } = useChat();
  const { data } = getConversations();
  const conversations = data?.pages.flatMap((page) => page.data) ?? [];
  const chatUnreadCount = conversations.reduce(
    (total, conversation) => total + (conversation.unreadCount ?? 0),
    0,
  );
  const {
    query: notificationsQuery,
    markRead,
    markAllRead,
  } = useNotifications();
  const notifications = notificationsQuery.data?.notifications ?? [];
  const notificationCount = Number(notificationsQuery.data?.unreadCount ?? 0);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const user = authDetails?.user;

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setShowNotifications(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowNotifications(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (authLoading) {
    return (
      <header className="h-16 border-b border-slate-200 bg-white px-8">
        <div className="h-full animate-pulse" />
      </header>
    );
  }

  if (!user) {
    return (
      <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between">
        <div className="text-sm text-slate-500">Academic Year: 2025/2026</div>
        <Link
          href="/login"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Sign In
        </Link>
      </header>
    );
  }

  return (
    <header
      data-tour="header"
      className="sticky top-0 z-20 flex min-h-18 items-center justify-between border-b border-slate-200/80 bg-white/85 px-3 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#1E293B]/85 sm:px-6 lg:px-8"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-tour="mobile-menu"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Good day, {user.fullName}
          </p>
          <p className="text-[11px] text-slate-400">
            Stay up to date with your workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {(user?.organizationId ||
          user?.organizationRole ||
          user?.organization?.name) && (
          <>
            <Link
              href="/organization"
              className="flex max-w-37.5 items-center gap-2 rounded-xl border border-primary/15 bg-primary/5  p-1 text-left transition hover:border-primary/30 hover:bg-primary/10 sm:hidden"
              title="View organization"
              aria-label="View your organization"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <span className="text-xs font-bold">O</span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[9px] font-bold uppercase tracking-wider text-primary">
                  org
                </span>
                <span className="block truncate text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                  {String(
                    user?.organization?.name ||
                      user?.organizationName ||
                      "Organization",
                  )}
                </span>
              </span>
            </Link>
            <Link
              href="/organization"
              className="hidden max-w-62.5 items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-left transition hover:border-primary/30 hover:bg-primary/10 sm:flex"
              title="View organization"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <span className="text-xs font-bold">O</span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-primary">
                  You are under
                </span>
                <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {user?.organization?.name ||
                    user?.organizationName ||
                    "An organization"}
                </span>
                <span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">
                  {String(user?.organizationRole || "Member").replaceAll(
                    "_",
                    " ",
                  )}
                </span>
              </span>
            </Link>
          </>
        )}

        <div className="flex items-center gap-1 md:gap-1.5">
          <Link
            href={`/${user.organizationRole === "MANAGER" ? "manager" : (user.role || "student").toLowerCase()}/chat`}
            aria-label="Open chat"
            className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="sr-only">Chat</span>
            <MessageCircle size={18} />
            {chatUnreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 min-w-4 rounded-full bg-red-500 px-1 text-center text-[9px] font-bold leading-4 text-white ring-2 ring-white dark:ring-[#1E293B]">
                {chatUnreadCount > 99 ? "99+" : chatUnreadCount}
              </span>
            )}
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((v) => !v)}
              className={`relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800 ${showNotifications ? "bg-slate-100 text-primary dark:bg-slate-800" : ""}`}
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-4 text-white ring-2 ring-white dark:ring-[#1E293B]">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationList
                notificationCount={notificationCount}
                notifications={notifications}
                markAllRead={markAllRead}
                markRead={markRead}
                setShowNotifications={setShowNotifications}
              />
            )}
          </div>

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
