"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileUp,
  ClipboardCheck,
  Search,
  LogOut,
  X, // Added X icon for closing
} from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { authService } from "@/app/_services/auth.service";
import { useAuth } from "@/app/_context/AuthContext";

type UserRole = "STUDENT" | "SUPERVISOR" | "ADMIN";

interface NavItem {
  name: string;
  href: string;
  roles: UserRole[] | "ALL";
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", roles: "ALL", icon: LayoutDashboard },
  { name: "Submit Project", href: "/upload", roles: ["STUDENT"], icon: FileUp },
  {
    name: "Review Queue",
    href: "/supervisor",
    roles: ["SUPERVISOR"],
    icon: ClipboardCheck,
  },
  { name: "Archive Search", href: "/projects", roles: "ALL", icon: Search },
];

// 1. Add Props interface
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { authDetails, isLoading: authLoading } = useAuth();
  const user = authDetails?.user;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 2. Consistent Loading State for Sidebar
  if (authLoading) {
    return (
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 lg:static lg:block hidden">
        <div className="p-6 border-b border-blue-800">
          <div className="h-6 w-32 animate-pulse rounded bg-blue-800" />
        </div>
      </aside>
    );
  }

  const userRole = user?.role as UserRole | undefined;

  const filteredNavItems = navItems.filter((item) => {
    if (item.roles === "ALL") return true;
    return userRole && item.roles.includes(userRole);
  });

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-blue-950 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full", // 3. Toggle visibility
      )}
      aria-label="Sidebar navigation"
    >
      {/* Header & Close Button */}
      <div className="flex items-center justify-between border-b border-blue-800 p-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight">OOU Repository</h2>
          <p className="text-xs text-blue-300">Computer Engineering</p>
        </div>
        {/* 4. Close button only visible on mobile */}
        <button
          onClick={onClose}
          className="rounded-md p-1 hover:bg-blue-900 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const fullHref = `/${userRole?.toLowerCase()}${item.href === "/" ? "" : item.href}`;
          const isActive =
            pathname === fullHref ||
            (item.href !== "/" && pathname.startsWith(fullHref));

          return (
            <Link
              key={item.href}
              href={`/${userRole?.toLowerCase()}${item.href}`}
              onClick={onClose} // 5. Close sidebar when a link is clicked on mobile
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-900 hover:text-white",
              )}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-blue-800 p-4">
        {user && (
          <div className="mb-3 px-4 py-2 text-sm text-blue-200">
            <p className="truncate font-medium">
              {user.fullName || user.email}
            </p>
            <p className="text-xs text-blue-300 uppercase">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-950/30"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
