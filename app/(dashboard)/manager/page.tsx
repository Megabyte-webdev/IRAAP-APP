"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Building2,
  CreditCard,
  ShieldCheck,
  Users,
  UserPlus,
  Trash2,
  BarChart3,
} from "lucide-react";
import { useManager } from "@/app/_hooks/use-organization";
import { UserRole } from "@/app/_services/profile.service";

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format((amount || 0) / 100);

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
  const { data: members = [] } = getMembers();
  const { data: billing } = getBilling();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerDepartment, setManagerDepartment] = useState("");
  const [memberRole, setMemberRole] = useState<
    "STUDENT" | "SUPERVISOR" | "RESEARCHER"
  >("STUDENT");

  const subscription = dashboard?.subscription;
  const stats = dashboard?.stats || {};
  const limits = dashboard?.trialLimits || {};
  const isTrial = subscription?.status === "TRIAL";
  const trialEnds = subscription?.endsAt ? new Date(subscription.endsAt) : null;

  const managerCount = useMemo(
    () => members.filter((m: any) => m.role === "MANAGER").length,
    [members],
  );

  const submitMember = (event: FormEvent) => {
    event.preventDefault();
    addMember.mutate(
      {
        fullName,
        email,
        role: memberRole,
        department: department || undefined,
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
        fullName: managerName,
        email: managerEmail,
        department: managerDepartment || undefined,
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

  if (isLoading) {
    return (
      <main className="min-h-full bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl animate-pulse space-y-4">
          <div className="h-28 rounded-2xl bg-white" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((x) => (
              <div key={x} className="h-28 rounded-2xl bg-white" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-indigo-600">
                <Building2 size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Organization manager
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {dashboard?.organization?.name || "Organization workspace"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage members, monitor research activity, and keep the
                organization subscription active.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
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
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold text-slate-900">
                  Add organization member
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Create or attach a student, supervisor, or researcher.
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
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value as any)}
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                  >
                    <option>STUDENT</option>
                    <option>SUPERVISOR</option>
                    <option>RESEARCHER</option>
                  </select>
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  disabled={addMember.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <UserPlus size={16} />{" "}
                  {addMember.isPending ? "Adding…" : "Add member"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold text-slate-900">
                  Add another manager
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Managers can manage the organization, but cannot create or
                  delete organizations.
                </p>
              </div>
              <form onSubmit={submitManager} className="space-y-3">
                <input
                  required
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
                <input
                  required
                  type="email"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  placeholder="Manager email"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
                <input
                  value={managerDepartment}
                  onChange={(e) => setManagerDepartment(e.target.value)}
                  placeholder="Department (optional)"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
                {isTrial && (
                  <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                    Trial allowance: {managerCount}/{limits.managers || 1}{" "}
                    managers.
                  </p>
                )}
                <button
                  disabled={
                    addManager.isPending ||
                    (isTrial && managerCount >= Number(limits.managers || 1))
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <UserPlus size={16} />{" "}
                  {addManager.isPending ? "Adding…" : "Add manager"}
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-indigo-600" />
              <h2 className="font-semibold text-slate-900">Billing</h2>
            </div>
            <p className="text-sm text-slate-600">
              Payments are initialized on the server and confirmed against
              Paystack before your paid access is activated.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(["INSTITUTION", "ENTERPRISE"] as const).map((plan) => {
                const config = billing?.plans?.[plan];
                return (
                  <button
                    key={plan}
                    disabled={
                      startCheckout.isPending || !config?.paystackPlanCode
                    }
                    onClick={() => startCheckout.mutate(plan)}
                    className="rounded-xl border border-white bg-white p-4 text-left shadow-sm disabled:opacity-50"
                  >
                    <p className="text-sm font-bold text-slate-900">{plan}</p>
                    <p className="mt-1 text-lg font-bold text-indigo-700">
                      {config?.amount
                        ? formatMoney(config.amount, config.currency)
                        : "Configure in server env"}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {config?.interval || "monthly"} · recurring
                    </p>
                  </button>
                );
              })}
            </div>
            {isTrial && (
              <p className="mt-3 text-xs text-slate-500">
                Your trial remains available while you evaluate the platform,
                with server-enforced limits on usage.
              </p>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Organization members
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Roles are enforced server-side. Removing a member never removes
              their global account.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left text-sm">
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member: any) => (
                  <tr key={member.id}>
                    <td className="px-5 py-3 font-medium text-slate-800">
                      {member.user?.fullName}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {member.user?.email}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          updateRole.mutate({
                            userId: member.user.id,
                            role: e.target.value as UserRole,
                            department: member.department || undefined,
                          })
                        }
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="RESEARCHER">Researcher</option>
                        <option value="MANAGER">Manager</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {member.department || "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => removeMember.mutate(member.user.id)}
                        disabled={removeMember.isPending}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
