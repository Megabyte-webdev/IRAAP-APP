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
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { useAuth } from "@/app/_context/AuthContext";

type UserRole = "STUDENT" | "SUPERVISOR" | "ADMIN";

interface NavItem {
  name: string;
  href: string;
  roles: UserRole[] | "ALL";
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "", roles: "ALL", icon: LayoutDashboard },
  { name: "Submit Project", href: "/upload", roles: ["STUDENT"], icon: FileUp },
  {
    name: "Review Queue",
    href: "/review",
    roles: ["SUPERVISOR"],
    icon: ClipboardCheck,
  },
  { name: "Students", href: "/students", roles: ["ADMIN"], icon: Users },
  {
    name: "Supervisors",
    href: "/supervisors",
    roles: ["ADMIN"],
    icon: GraduationCap,
  },
  { name: "Archive Search", href: "/repository", roles: "ALL", icon: Search },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { authDetails, isLoading: authLoading, logout } = useAuth();
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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-blue-950 text-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-blue-900",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-18" : "lg:w-64",
        )}
      >
        {/* --- THE EDGE TOGGLE BUTTON --- */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-12 z-50 hidden h-8 w-8 items-center justify-center rounded-full border border-blue-800 bg-blue-950 text-blue-300 transition-all hover:text-white lg:flex",
            "hover:scale-110 active:scale-95 shadow-sm",
          )}
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>

        {/* Header */}
        <div className="flex h-20 items-center overflow-hidden px-6">
          <div
            className={cn(
              "min-w-45 transition-opacity duration-300",
              isCollapsed && "lg:opacity-0",
            )}
          >
            <h2 className="text-lg font-bold tracking-tight">OOU IRAP</h2>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">
              Repository
            </p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-blue-200">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto overflow-x-hidden">
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
                    ? "bg-blue-900/50 text-white shadow-inner"
                    : "text-blue-200/70 hover:bg-blue-900/30 hover:text-white",
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "shrink-0",
                    isActive
                      ? "text-indigo-400"
                      : "text-blue-400 group-hover:text-blue-300",
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

                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 h-5 w-1 rounded-r-full bg-indigo-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-blue-900/50 p-4">
          {!isCollapsed && (
            <div className="mb-4 px-2 overflow-hidden transition-all duration-300">
              <p className="truncate text-sm font-semibold text-white">
                {user?.fullName}
              </p>
              <p className="text-[10px] text-blue-500 uppercase font-bold">
                {user?.role}
              </p>
            </div>
          )}

          <button
            onClick={logout}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-950/20 group",
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
