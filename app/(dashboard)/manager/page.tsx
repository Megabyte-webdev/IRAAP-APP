"use client";

import Link from "next/link";
import { Building2, Users, MessageSquare, CreditCard, ArrowRight, ShieldCheck, BarChart3, Clock3 } from "lucide-react";
import { useManager } from "@/app/_hooks/use-organization";

export default function ManagerOverviewPage() {
  const { getDashboard, getMembers, getBilling } = useManager();
  const { data: dashboard, isLoading } = getDashboard();
  const { data: members = [] } = getMembers();
  const { data: billing } = getBilling();

  if (isLoading) return <main className="min-h-full bg-slate-50 p-4 md:p-8"><div className="mx-auto max-w-7xl animate-pulse space-y-5"><div className="h-32 rounded-2xl bg-white"/><div className="grid gap-4 md:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-28 rounded-2xl bg-white"/>)}</div></div></main>;

  const stats = dashboard?.stats || {};
  const subscription = dashboard?.subscription;
  const trialEnds = subscription?.endsAt ? new Date(subscription.endsAt) : null;
  const isTrial = subscription?.status === "TRIAL";
  const pendingManagers = members.filter((m:any) => m.role === "MANAGER").length;

  const cards = [
    ["Members", stats.members ?? 0, Users, "/manager/members"],
    ["Approved projects", stats.approvedProjects ?? 0, BarChart3, "/manager"],
    ["Pending publications", stats.pendingPublications ?? 0, Clock3, "/manager"],
    ["Supervisors", stats.supervisors ?? 0, ShieldCheck, "/manager/members"],
  ];

  return <main className="min-h-full bg-slate-50 p-4 md:p-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-indigo-600"><Building2 size={19}/><span className="text-xs font-bold uppercase tracking-[0.16em]">Organization workspace</span></div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{dashboard?.organization?.name || "Organization"}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">A focused control center for organization health. Member administration, conversations, and billing live in their own workspaces.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subscription</p>
            <p className="mt-1 font-semibold text-slate-900">{subscription?.planCode || "FREE"} · {subscription?.status || "EXPIRED"}</p>
            {isTrial && trialEnds && <p className="mt-1 text-xs text-amber-700">Trial ends {trialEnds.toLocaleDateString()}</p>}
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label,value,Icon,href]:any)=><Link href={href} key={label} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between"><Icon size={19} className="text-indigo-600"/><ArrowRight size={15} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500"/></div>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </Link>)}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Link href="/manager/members" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"><div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><Users size={18}/></span><div><h2 className="font-semibold text-slate-900">Manage members</h2><p className="text-xs text-slate-500">Invite, assign roles, or remove access.</p></div></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs"><span className="text-slate-500">{stats.members ?? 0} total · {pendingManagers} managers</span><span className="font-semibold text-indigo-600">Open →</span></div></Link>
        <Link href="/manager/chat" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"><div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><MessageSquare size={18}/></span><div><h2 className="font-semibold text-slate-900">Organization chat</h2><p className="text-xs text-slate-500">Communicate with members without cluttering the overview.</p></div></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs"><span className="text-slate-500">Internal member conversations</span><span className="font-semibold text-indigo-600">Open →</span></div></Link>
        <Link href="/manager/billing" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"><div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><CreditCard size={18}/></span><div><h2 className="font-semibold text-slate-900">Billing</h2><p className="text-xs text-slate-500">Subscription status, plans, and payment.</p></div></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs"><span className="text-slate-500">{billing?.subscription?.status || subscription?.status || "EXPIRED"}</span><span className="font-semibold text-indigo-600">Open →</span></div></Link>
      </section>

      {isTrial && <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 text-amber-700" size={19}/><div><p className="font-semibold text-amber-950">Trial plan is active</p><p className="mt-1 text-sm text-amber-800">Members and projects are subject to your server-enforced trial limits. Billing is available separately when you're ready to upgrade.</p></div></div></section>}
    </div>
  </main>;
}
