export type DashboardRole = "student" | "supervisor" | "manager" | "admin";

export function getDashboardRole(user: any): DashboardRole | null {
  const orgRole = String(user?.organizationRole || "").toUpperCase();
  const platformRole = String(user?.role || "").toUpperCase();

  if (platformRole === "ADMIN") return "admin";
  if (orgRole === "MANAGER") return "manager";
  if (orgRole === "SUPERVISOR" || platformRole === "SUPERVISOR")
    return "supervisor";
  return "student";
}
