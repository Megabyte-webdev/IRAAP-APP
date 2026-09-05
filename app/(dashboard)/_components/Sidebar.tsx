"use client";

import { useState } from "react";
import Image from "next/image";
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
  Building2,
  BarChart3,
  LifeBuoy,
} from "lucide-react";

import { cn } from "@/app/_lib/utils";
import { useAuth } from "@/app/_context/AuthContext";

type UserRole = "ADMIN" | "SUPERVISOR" | "STUDENT" | "MANAGER";

type NavItem = {
  name: string;
  href: string;
  roles: UserRole[] | "ALL";
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    roles: "ALL",
    icon: LayoutDashboard,
  },
  {
    name: "Research",
    href: "/research",
    roles: ["STUDENT", "SUPERVISOR"],
    icon: FileUp,
  },
  {
    name: "Projects",
    href: "/projects",
    roles: ["STUDENT", "SUPERVISOR"],
    icon: FolderOpen,
  },
  {
    name: "Approvals",
    href: "/approvals",
    roles: ["ADMIN", "SUPERVISOR"],
    icon: ClipboardCheck,
  },
  {
    name: "Chat",
    href: "/chat",
    roles: ["STUDENT", "SUPERVISOR", "ADMIN"],
    icon: MessageSquare,
  },
  {
    name: "Meetings",
    href: "/meetings",
    roles: ["STUDENT", "SUPERVISOR"],
    icon: CalendarDays,
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
  {
    name: "Archive Search",
    href: "/archive",
    roles: "ALL",
    icon: Search,
  },
  {
    name: "Organizations",
    href: "/organizations",
    roles: ["ADMIN"],
    icon: Building2,
  },
  {
    name: "Analytics",
    href: "/analytics",
    roles: ["ADMIN"],
    icon: BarChart3,
  },
  {
    name: "Support",
    href: "/support",
    roles: ["ADMIN"],
    icon: LifeBuoy,
  },
  {
    name: "Organization",
    href: "/manager",
    roles: ["MANAGER"],
    icon: Building2,
  },
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
  const userRole = (user?.organizationRole === "MANAGER" ? "MANAGER" : user?.role) as UserRole | undefined;

  const rolePrefix = userRole ? `/${userRole.toLowerCase()}` : "";

  const filteredNavItems = navItems.filter((item) => {
    if (item.roles === "ALL") {
      return true;
    }

    return !!userRole && item.roles.includes(userRole);
  });

  const getTourTarget = (name: string) => {
    switch (name) {
      case "Archive Search":
        return "archive";

      case "Chat":
        return "chat";

      case "Meetings":
        return "meetings";

      default:
        return undefined;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        data-tour="sidebar"
        aria-label="Main navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col",
          "bg-white text-slate-900 dark:bg-[#1E293B] dark:text-slate-100",
          "border-r border-slate-200 dark:border-slate-800",
          "transition-all duration-300 ease-in-out",
          "lg:static lg:translate-x-0",
          isOpen
            ? "w-full max-w-64 translate-x-0 shadow-lg"
            : "-translate-x-full",
          isCollapsed ? "lg:w-18" : "lg:w-64",
        )}
      >
        {/* Edge Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed((value) => !value)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "absolute -right-4 top-20 z-50 hidden",
            "h-8 w-8 items-center justify-center",
            "rounded-full",
            "border border-slate-200 dark:border-slate-700",
            "bg-white dark:bg-slate-800",
            "text-slate-700 dark:text-slate-300",
            "shadow-sm transition-all",
            "hover:scale-110 active:scale-95",
            "lg:flex",
          )}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Header */}
        <div
          className={cn(
            "flex h-18 shrink-0 items-center",
            "border-b border-slate-200 dark:border-slate-800",
            "overflow-hidden",
          )}
        >
          <div
            className={cn(
              "flex w-full items-center justify-center px-6",
              "transition-opacity duration-300",
              isCollapsed && "lg:opacity-0",
            )}
          >
            <Image
              src="/irap-logo.png"
              alt="IRAAP Logo"
              width={150}
              height={150}
              priority
              className="h-10 w-auto opacity-90"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto mr-4 p-1 text-red-500 hover:text-red-600 lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 space-y-1 overflow-x-hidden overflow-y-auto",
            "p-3 pt-6",
          )}
          aria-label="Workspace navigation"
        >
          {filteredNavItems.map((item, index) => {
            const Icon = item.icon;

            const fullHref = `${rolePrefix}${item.href}`;

            const isActive =
              pathname === fullHref || pathname?.startsWith(`${fullHref}/`);

            const tourTarget = getTourTarget(item.name);

            return (
              <Link
                key={item.href}
                href={fullHref}
                data-tour={tourTarget}
                data-tour-nav={item.name}
                data-tour-nav-index={index}
                onClick={() => {
                  const tourActive =
                    document.body.classList.contains("driver-active");

                  if (window.innerWidth < BREAKPOINT && !tourActive) {
                    onClose();
                  }
                }}
                className={cn(
                  "group relative flex items-center gap-3",
                  "rounded-lg px-3 py-2.5",
                  "text-sm font-medium",
                  "transition-all",
                  isActive
                    ? "bg-primary text-white"
                    : [
                        "text-slate-700",
                        "hover:bg-slate-100",
                        "dark:text-slate-300",
                        "dark:hover:bg-slate-800/60",
                      ],
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : [
                          "text-slate-500",
                          "dark:text-slate-400",
                          "group-hover:text-slate-900",
                          "dark:group-hover:text-slate-200",
                        ],
                  )}
                />

                <span
                  className={cn(
                    "whitespace-nowrap transition-all duration-300",
                    isCollapsed
                      ? ["lg:pointer-events-none", "lg:opacity-0"]
                      : "opacity-100",
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "mt-auto shrink-0",
            "border-t border-slate-200 dark:border-slate-800",
            "bg-slate-50/50 dark:bg-slate-900/20",
            "p-4",
          )}
        >
          {!isCollapsed && (
            <div className="mb-4 overflow-hidden px-2">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.fullName ?? "User"}
              </p>

              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                {user?.role ?? ""}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            className={cn(
              "group flex w-full items-center gap-3",
              "rounded-lg px-3 py-2.5",
              "text-sm font-medium",
              "text-red-500 dark:text-red-400",
              "transition-colors",
              "hover:bg-red-50 dark:hover:bg-red-950/20",
              isCollapsed && "lg:justify-center lg:px-0",
            )}
          >
            <LogOut
              size={20}
              className="shrink-0 transition-transform group-hover:-translate-x-0.5"
            />

            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

const BREAKPOINT = 1024;
