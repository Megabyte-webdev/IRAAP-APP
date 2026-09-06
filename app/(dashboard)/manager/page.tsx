
"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  MessageSquare,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useManager, useOrganization } from "@/app/_hooks/use-organization";
import { UserRole } from "@/app/_services/profile.service";

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format((amount || 0) / 100);

const roleLabels: Record<string, string> = {
  STUDENT: "Student",
  SUPERVISOR: "Supervisor",
  RESEARCHER: "Researcher",
  MANAGER: "Manager",
};

const roleBadge: Record<string, string> = {
  STUDENT: "bg-sky-50 text-sky-700",
  SUPERVISOR: "bg-violet-50 text-violet-700",
  RESEARCHER: "bg-emerald-50 text-emerald-700",
  MANAGER: "bg-indigo-50 text-indigo-700",
};

export default function ManagerDashboardPage() {
  const {
    getDashboard,
    getMembers,
    addManager,
    addMember,
    updateRole,
    removeMember,
    getBilling,
    startCheckout,
  } = useManager();

  const { data: dashboard, isLoading } = getDashboard();
  const { data: members = [], isLoading: membersLoading } = getMembers();
  const { data: billing } = getBilling();

  const organizationId = dashboard?.organization?.id;
  const { getAnalytics } = useOrganization();
  const { data: analytics = {} } = getAnalytics(organizationId);

  const [activeTab, setActiveTab] = useState<"overview" | "people" | "billing">(
    "overview",
  );
  const [memberSearch, setMemberSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [memberRole, setMemberRole] = useState<
    "STUDENT" | "SUPERVISOR" | "RESEARCHER"
  >("STUDENT");

  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerDepartment, setManagerDepartment] = useState("");

  const subscription = dashboard?.subscription;
  const stats = dashboard?.stats || {};
  const limits = dashboard?.trialLimits || {};
  const isTrial = subscription?.status === "TRIAL";
  const trialEnds = subscription?.endsAt
    ? new Date(subscription.endsAt)
    : null;

  const managerCount = useMemo(
    () =>
      members.filter((member: any) => member.role === "MANAGER").length,
    [members],
  );

  const filteredMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();

    return members.filter((member: any) => {
      const roleMatch =
        roleFilter === "ALL" || member.role === roleFilter;

      if (!roleMatch) return false;
      if (!query) return true;

      const name = member.user?.fullName || "";
      const emailAddress = member.user?.email || "";
      const departmentName = member.department || "";

      return [name, emailAddress, departmentName, member.role]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [members, memberSearch, roleFilter]);

  const submitMember = (event: FormEvent) => {
    event.preventDefault();

    addMember.mutate(
      {
        fullName: fullName.trim(),
        email: email.trim(),
        role: memberRole,
        department: department.trim() || undefined,
      },
      {
        onSuccess: () => {
          setFullName("");
          setEmail("");
          setDepartment("");
          setMemberRole("STUDENT");
        },
      },
    );
  };

  const submitManager = (event: FormEvent) => {
    event.preventDefault();

    addManager.mutate(
      {
        fullName: managerName.trim(),
        email: managerEmail.trim(),
        department: managerDepartment.trim() || undefined,
      },
      {
        onSuccess: () => {
          setManagerName("");
          setManagerEmail("");
          setManagerDepartment("");
        },
      },
    );
  };

  const handleRoleChange = (member: any, nextRole: UserRole) => {
    if (nextRole === member.role) return;

    const confirmed = window.confirm(
      `Change ${member.user?.fullName || "this member"} to ${roleLabels[nextRole] || nextRole}?`,
    );

    if (!confirmed) return;

    updateRole.mutate({
      userId: member.user.id,
      role: nextRole,
      department: member.department || undefined,
    });
  };

  const handleRemove = (member: any) => {
    const confirmed = window.confirm(
      `Remove ${member.user?.fullName || "this member"} from this organization? Their global account will not be deleted.`,
    );

    if (!confirmed) return;

    removeMember.mutate(member.user.id);
  };

  if (isLoading) {
    return (
      <main className="min-h-full bg-slate-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-5">
          <div className="h-32 rounded-2xl bg-white" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-white" />
            ))}
          </div>
          <div className="h-96 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-indigo-600">
                <Building2 size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Organization management
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {dashboard?.organization?.name || "Organization workspace"}
              </h1>

              <p className="mt-1 max-w-3xl text-sm text-slate-500">
                Manage your research community, access, people, and
                subscription. Projects are submitted by organization members;
                managers oversee the research activity rather than uploading
                projects themselves.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:items-center">
              <a
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                <MessageSquare size={16} />
                Organization chat
              </a>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Subscription
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {subscription?.planCode || "FREE"} ·{" "}
                  {subscription?.status || "EXPIRED"}
                </p>
                {isTrial && trialEnds && (
                  <p className="mt-1 text-xs text-amber-700">
                    Trial ends {trialEnds.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {[
            ["overview", "Overview"],
            ["people", "People & access"],
            ["billing", "Billing"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === key
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {[
                ["Members", stats.members, Users],
                ["Students", stats.students, Users],
                ["Supervisors", stats.supervisors, ShieldCheck],
                ["Managers", stats.managers, UserPlus],
                ["Projects", stats.projects, BarChart3],
              ].map(([label, value, Icon]: any) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <Icon size={18} className="text-indigo-600" />
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {value ?? 0}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Activity size={18} className="text-indigo-600" />
                      <h2 className="font-semibold text-slate-900">
                        Research activity
                      </h2>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Monitor organization research output and participation.
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Read-only oversight
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["Projects", stats.projects],
                    ["Publications", analytics?.publications],
                    ["Active members", analytics?.activeMembers],
                    ["Recent submissions", analytics?.recentSubmissions],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {label}
                      </p>
                      <p className="mt-2 text-xl font-bold text-slate-900">
                        {value ?? 0}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    How project ownership works
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Students and researchers create and submit their research.
                    Supervisors review and guide it. Managers administer the
                    organization, membership, access, collaboration, and
                    subscription.
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-indigo-600" />
                  <h2 className="font-semibold text-slate-900">
                    People at a glance
                  </h2>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    ["Students", stats.students],
                    ["Supervisors", stats.supervisors],
                    ["Researchers", stats.researchers],
                    ["Managers", stats.managers],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <span className="text-sm text-slate-600">{label}</span>
                      <span className="font-semibold text-slate-900">
                        {value ?? 0}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("people")}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Manage people
                </button>
              </section>
            </div>
          </section>
        )}

        {activeTab === "people" && (
          <section className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-semibold text-slate-900">
                    Add organization member
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Provision a student, supervisor, or researcher. New
                    accounts receive their onboarding credentials and are
                    required to change the temporary password.
                  </p>
                </div>

                <form onSubmit={submitMember} className="space-y-3">
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={memberRole}
                      onChange={(e) =>
                        setMemberRole(
                          e.target.value as
                            | "STUDENT"
                            | "SUPERVISOR"
                            | "RESEARCHER",
                        )
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="SUPERVISOR">Supervisor</option>
                      <option value="RESEARCHER">Researcher</option>
                    </select>

                    <input
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Department / unit"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={addMember.isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <UserPlus size={16} />
                    {addMember.isPending
                      ? "Adding…"
                      : "Add member"}
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-semibold text-slate-900">
                    Add another manager
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    A manager can administer this organization, but cannot
                    create or delete the organization itself.
                  </p>
                </div>

                <form onSubmit={submitManager} className="space-y-3">
                  <input
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />

                  <input
                    required
                    type="email"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="Manager email"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />

                  <input
                    value={managerDepartment}
                    onChange={(e) =>
                      setManagerDepartment(e.target.value)
                    }
                    placeholder="Department / unit (optional)"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />

                  {isTrial && (
                    <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                      Trial manager allowance: {managerCount}/
                      {limits.managers || 1}.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={
                      addManager.isPending ||
                      (isTrial &&
                        managerCount >=
                          Number(limits.managers || 1))
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <UserPlus size={16} />
                    {addManager.isPending
                      ? "Adding…"
                      : "Add manager"}
                  </button>
                </form>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 md:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Organization members
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Manage organization roles and access. Removing a member
                      removes their organization membership, not their global
                      account.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative">
                      <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={memberSearch}
                        onChange={(e) =>
                          setMemberSearch(e.target.value)
                        }
                        placeholder="Search people"
                        className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 sm:w-60"
                      />
                    </div>

                    <div className="relative">
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="h-10 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm outline-none focus:border-indigo-500"
                      >
                        <option value="ALL">All roles</option>
                        <option value="STUDENT">Students</option>
                        <option value="SUPERVISOR">Supervisors</option>
                        <option value="RESEARCHER">Researchers</option>
                        <option value="MANAGER">Managers</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {membersLoading ? (
                <div className="p-6 text-sm text-slate-500">
                  Loading organization members…
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-10 text-center">
                  <Users
                    size={24}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No members found
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Try a different search or role filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-xs font-bold text-slate-500">
                          Name
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-slate-500">
                          Email
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-slate-500">
                          Role
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-slate-500">
                          Department
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-bold text-slate-500">
                          Access
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredMembers.map((member: any) => (
                        <tr key={member.id}>
                          <td className="px-5 py-3 font-medium text-slate-800">
                            {member.user?.fullName || "Unnamed member"}
                          </td>

                          <td className="px-5 py-3 text-slate-500">
                            {member.user?.email || "—"}
                          </td>

                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                  roleBadge[member.role] ||
                                  "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {roleLabels[member.role] || member.role}
                              </span>

                              <select
                                value={member.role}
                                onChange={(e) =>
                                  handleRoleChange(
                                    member,
                                    e.target.value as UserRole,
                                  )
                                }
                                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                              >
                                <option value="STUDENT">Student</option>
                                <option value="SUPERVISOR">Supervisor</option>
                                <option value="RESEARCHER">Researcher</option>
                                <option value="MANAGER">Manager</option>
                              </select>
                            </div>
                          </td>

                          <td className="px-5 py-3 text-slate-500">
                            {member.department || "—"}
                          </td>

                          <td className="px-5 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemove(member)}
                              disabled={
                                removeMember.isPending ||
                                updateRole.isPending
                              }
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {removeMember.isPending ? (
                                "Removing…"
                              ) : (
                                <>
                                  <XCircle size={14} />
                                  Remove
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500 md:px-6">
                {filteredMembers.length} of {members.length} member
                {members.length === 1 ? "" : "s"} shown.
              </div>
            </div>
          </section>
        )}

        {activeTab === "billing" && (
          <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-slate-900">
                  Subscription status
                </h2>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Plan</span>
                  <span className="font-semibold text-slate-900">
                    {subscription?.planCode || "FREE"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                    {subscription?.status === "ACTIVE" ||
                    subscription?.status === "TRIAL" ? (
                      <CheckCircle2
                        size={15}
                        className="text-emerald-600"
                      />
                    ) : (
                      <XCircle
                        size={15}
                        className="text-red-500"
                      />
                    )}
                    {subscription?.status || "EXPIRED"}
                  </span>
                </div>

                {subscription?.endsAt && (
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      Access until
                    </span>
                    <span className="font-semibold text-slate-900">
                      {new Date(
                        subscription.endsAt,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm md:p-6">
              <div className="mb-4">
                <h2 className="font-semibold text-slate-900">
                  Plans
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Payments are initialized and verified on the server before
                  paid organization access is activated.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {(["INSTITUTION", "ENTERPRISE"] as const).map((plan) => {
                  const config = billing?.plans?.[plan];

                  return (
                    <button
                      key={plan}
                      type="button"
                      disabled={
                        startCheckout.isPending ||
                        !config?.paystackPlanCode
                      }
                      onClick={() => startCheckout.mutate(plan)}
                      className="rounded-xl border border-white bg-white p-4 text-left shadow-sm disabled:opacity-50"
                    >
                      <p className="text-sm font-bold text-slate-900">
                        {plan}
                      </p>

                      <p className="mt-1 text-lg font-bold text-indigo-700">
                        {config?.amount
                          ? formatMoney(
                              config.amount,
                              config.currency,
                            )
                          : "Configure server plan"}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {config?.interval || "monthly"} · recurring
                      </p>
                    </button>
                  );
                })}
              </div>

              {isTrial && (
                <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                  Your organization is currently on a trial. Usage limits are
                  enforced by the backend.
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
