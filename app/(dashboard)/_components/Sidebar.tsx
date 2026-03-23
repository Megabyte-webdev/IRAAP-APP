"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileUp,
  ClipboardCheck,
  Search,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { authService } from "@/app/_services/auth.service";
import { useAuth } from "@/app/_context/AuthContext";

// Define user role type (should match your backend enum)
type UserRole = "STUDENT" | "SUPERVISOR" | "ADMIN";

// Define nav item structure
interface NavItem {
  name: string;
  href: string;
  roles: UserRole[] | "ALL"; // "ALL" means accessible by any authenticated user
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    roles: "ALL",
    icon: LayoutDashboard,
  },
  {
    name: "Submit Project",
    href: "/upload",
    roles: ["STUDENT"],
    icon: FileUp,
  },
  {
    name: "Review Queue",
    href: "/supervisor",
    roles: ["SUPERVISOR"],
    icon: ClipboardCheck,
  },
  {
    name: "Archive Search",
    href: "/projects",
    roles: "ALL",
    icon: Search,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { authDetails, isLoading: authLoading } = useAuth();
  const user = authDetails?.user;

  // Handle logout with error feedback
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Redirect is likely handled by authService or a useEffect
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show a toast notification here
    }
  };

  // Show a minimal loading state while auth is resolving
  if (authLoading) {
    return (
      <aside className="w-64 bg-blue-950 text-white flex flex-col h-full">
        <div className="p-6 border-b border-blue-800">
          <div className="h-6 w-32 animate-pulse rounded bg-blue-800" />
          <div className="mt-1 h-4 w-24 animate-pulse rounded bg-blue-800" />
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-lg bg-blue-900"
              />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const userRole = user?.role?.toLowerCase() as UserRole | undefined;

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (item.roles === "ALL") return true;
    return userRole && item.roles.includes(userRole);
  });

  return (
    <aside
      className="h-full w-64 flex-col bg-blue-950 text-white lg:flex hidden"
      aria-label="Sidebar navigation"
    >
      {/* Header */}
      <div className="border-b border-blue-800 p-6">
        <h2 className="text-lg font-bold tracking-tight">OOU Repository</h2>
        <p className="text-xs text-blue-300">Computer Engineering</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4" aria-label="Main">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          // Construct the actual full URL this link points to
          const fullHref = `/${userRole?.toLowerCase()}${item.href === "/" ? "" : item.href}`;

          // Check if current pathname matches exactly or starts with it
          const isActive =
            pathname === fullHref ||
            (item.href !== "/" && pathname.startsWith(fullHref));

          return (
            <Link
              key={item.href}
              href={`/${userRole}${item.href}`}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-950",
                isActive
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-900 hover:text-white",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer with user info and logout */}
      <div className="border-t border-blue-800 p-4">
        {user && (
          <div className="mb-3 px-4 py-2 text-sm text-blue-200">
            <p className="truncate font-medium">
              {user.fullName || user.email}
            </p>
            <p className="text-xs text-blue-300">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-950/30 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-blue-950"
          aria-label="Sign out"
        >
          <LogOut size={20} aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
