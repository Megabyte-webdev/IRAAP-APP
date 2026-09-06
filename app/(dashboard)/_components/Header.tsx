"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ProfileDropdown from "@/app/_components/ProfileDropdown";
import useChat from "@/app/_hooks/use-chat";
import { useNotifications } from "@/app/_context/NotificationContext";
import { useRouter } from "next/navigation";
import { api } from "@/app/_lib/api-client";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { authDetails, isLoading: authLoading } = useAuth();
  const { getConversations } = useChat();
  const { notifications = [], unreadCount = 0, refresh } = useNotifications();
  const router = useRouter();

  const { data } = getConversations();

  const conversations = data?.pages.flatMap((page) => page.data) ?? [];

  const notificationCount = unreadCount + conversations.reduce((total, conversation) => total + (conversation.unreadCount ?? 0), 0);
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
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors" aria-label="Notifications" aria-expanded={showNotifications}>
            <Bell size={20} />
            {notificationCount > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-red-500 px-1 text-[9px] font-bold leading-4 text-white ring-2 ring-white dark:ring-[#1E293B]">{notificationCount > 99 ? "99+" : notificationCount}</span>}
          </button>
          {showNotifications && <div className="absolute right-0 top-11 z-50 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800"><div><p className="text-sm font-bold">Notifications</p><p className="text-[11px] text-slate-500">{unreadCount} unread</p></div>{unreadCount > 0 && <button className="text-[11px] font-semibold text-primary" onClick={async()=>{await api.patch("/notifications/read-all"); refresh();}}>Mark all read</button>}</div>
            <div className="max-h-[min(70vh,420px)] overflow-y-auto">
              {notifications.length === 0 ? <div className="p-8 text-center text-xs text-slate-500">You are all caught up.</div> : notifications.map((n:any)=><button key={n.id} onClick={async()=>{if(!n.readAt){await api.patch(`/notifications/${n.id}/read`); refresh();} if(n.link) router.push(n.link); setShowNotifications(false);}} className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${!n.readAt ? "bg-primary/5" : ""}`}><div className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!n.readAt ? "bg-primary" : "bg-slate-300"}`} /><div className="min-w-0"><p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{n.title}</p><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{n.message}</p><p className="mt-1 text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleString()}</p></div></div></button>)}
            </div>
          </div>}
        </div>

        {/* User menu */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
