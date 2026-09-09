export type DashboardRole = "student" | "supervisor" | "manager" | "admin";

/**
 * Platform roles describe the user's core IRAAP account. Organization roles
 * describe what the user can do inside an organization. They intentionally do
 * not replace the account role. Researchers currently use the research/student
 * workspace because there is no separate researcher dashboard route.
 */
export function getDashboardRole(user: any): DashboardRole | null {
  const orgRole = String(user?.organizationRole || "").toUpperCase();
  const platformRole = String(user?.role || "").toUpperCase();

  if (platformRole === "ADMIN") return "admin";
  if (orgRole === "MANAGER") return "manager";
  if (orgRole === "SUPERVISOR" || platformRole === "SUPERVISOR") return "supervisor";
  return "student";
}

export function getRoleLabel(user: any): string {
  const orgRole = String(user?.organizationRole || "").toUpperCase();
  const platformRole = String(user?.role || "").toUpperCase();
  if (orgRole === "MANAGER") return "Organization Manager";
  if (orgRole === "SUPERVISOR") return "Organization Supervisor";
  if (orgRole === "RESEARCHER") return "Organization Researcher";
  if (orgRole === "STUDENT") return "Organization Student";
  if (platformRole === "SUPERVISOR") return "Supervisor";
  if (platformRole === "ADMIN") return "Administrator";
  return "Student";
}
