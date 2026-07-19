"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileUp,
  ClipboardCheck,
  Search,
  LogOut,
  FolderOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  GraduationCap,
  MessageSquare,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { useAuth } from "@/app/_context/AuthContext";
import Image from "next/image";

type UserRole = "STUDENT" | "SUPERVISOR" | "ADMIN";

interface NavItem {
  name: string;
  href: string;
  roles: UserRole[] | "ALL";
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "", roles: "ALL", icon: LayoutDashboard },
  {
    name: "Chat",
    href: "/chat",
    roles: ["STUDENT", "SUPERVISOR"],
    icon: MessageSquare,
  },
  {
    name: "My Project",
    href: "/projects",
    roles: ["STUDENT"],
    icon: FolderOpen,
  },
  {
    name: "Meetings",
    href: "/meetings",
    roles: ["STUDENT", "SUPERVISOR"],
    icon: CalendarDays,
  },
  {
    name: "Review Queue",
    href: "/review",
    roles: ["SUPERVISOR"],
    icon: ClipboardCheck,
  },
  {
    name: "Students",
    href: "/students",
    roles: ["ADMIN", "SUPERVISOR"],
    icon: Users,
  },
  {
    name: "Supervisors",
    href: "/supervisors",
    roles: ["ADMIN"],
    icon: GraduationCap,
  },
  {
    name: "Publications",
    href: "/publications",
    roles: ["STUDENT", "ADMIN"],
    icon: BookOpen,
  },
  { name: "Archive Search", href: "/archive", roles: "ALL", icon: Search },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { authDetails, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = authDetails?.user;
  const userRole = user?.role as UserRole | undefined;
  const rolePrefix = `/${userRole?.toLowerCase()}`;

  const filteredNavItems = navItems.filter((item) => {
    if (item.roles === "ALL") return true;
    return userRole && item.roles.includes(userRole);
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 h-full flex flex-col bg-white dark:bg-[#1E293B] text-slate-900 dark:text-slate-100 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-slate-200 dark:border-slate-800",
          isOpen
            ? "translate-x-0 max-w-64 w-full shadow-lg"
            : "-translate-x-full",
          isCollapsed ? "lg:w-18" : "lg:w-64",
        )}
      >
        {/* --- THE EDGE TOGGLE BUTTON --- */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-4 top-20 z-50 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all lg:flex",
            "hover:scale-110 active:scale-95 shadow-sm cursor-pointer",
          )}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Header Branding */}
        <div className="flex h-18 items-center border-b border-slate-200 dark:border-slate-800 overflow-hidden">
          <div
            className={cn(
              "w-full transition-opacity duration-300 flex justify-center items-center px-6",
              isCollapsed && "lg:opacity-0",
            )}
          >
            <Image
              alt="IRAP Logo"
              src="/irap-logo.png"
              width={150}
              height={150}
              className="h-10 w-auto opacity-90 transition-all"
            />
          </div>
          <button
            onClick={onClose}
            className="ml-auto mr-4 lg:hidden text-red-500 hover:text-red-600 cursor-pointer p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Items Container */}
        <nav className="flex-1 space-y-1 p-3 pt-6 overflow-y-auto overflow-x-hidden">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const fullHref = `${rolePrefix}${item.href}`;
            const isActive = pathname === fullHref;

            return (
              <Link
                key={item.href}
                href={fullHref}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60",
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200",
                  )}
                />
                <span
                  className={cn(
                    "transition-all duration-300 whitespace-nowrap",
                    isCollapsed
                      ? "lg:opacity-0 lg:pointer-events-none"
                      : "opacity-100",
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile Information & Footer Controls */}
        <div className="mt-auto border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/20">
          {!isCollapsed && (
            <div className="mb-4 px-2 overflow-hidden transition-all duration-300">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.fullName}
              </p>
              <p className="text-[10px] text-primary uppercase font-bold tracking-wider mt-0.5">
                {user?.role}
              </p>
            </div>
          )}

          <button
            onClick={logout}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 group cursor-pointer",
              isCollapsed && "lg:justify-center lg:px-0",
            )}
          >
            <LogOut
              size={20}
              className="shrink-0 group-hover:-translate-x-0.5 transition-transform"
            />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
