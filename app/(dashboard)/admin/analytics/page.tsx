"use client";

import { BarChart3, Users, FolderKanban, BookOpen, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/app/_hooks/use-analytics";

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useAnalytics();
  const total = (items: any[] = []) => items.reduce((sum, row) => sum + Number(row.count || 0), 0);
  const cards = [
    { label: "Users", value: total(data?.usersByRole), icon: Users },
    { label: "Projects", value: total(data?.projectsByStatus), icon: FolderKanban },
    { label: "Publication requests", value: total(data?.publicationsByStatus), icon: BookOpen },
  ];

  if (isLoading) return <main className="p-8"><div className="animate-pulse text-sm text-slate-500">Loading analytics…</div></main>;
  if (isError) return <main className="p-8"><div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">Analytics could not be loaded right now.</div></main>;

  return <main className="min-h-full bg-slate-50 p-4 md:p-8"><div className="mx-auto max-w-7xl space-y-6"><header><div className="mb-2 flex items-center gap-2 text-indigo-600"><BarChart3 size={19}/><span className="text-xs font-bold uppercase tracking-wider">Advanced analytics</span></div><h1 className="text-3xl font-bold text-slate-900">Research Analytics</h1><p className="mt-1 text-sm text-slate-500">Operational visibility across users, projects, reviews, and publications.</p></header><div className="grid gap-4 md:grid-cols-3">{cards.map(({label,value,icon:Icon})=><div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><Icon size={18} className="text-indigo-500"/></div><p className="mt-3 text-3xl font-bold text-slate-900">{value}</p></div>)}</div><div className="grid gap-6 lg:grid-cols-2">{[["Users by role", data?.usersByRole], ["Projects by status", data?.projectsByStatus], ["Publications by status", data?.publicationsByStatus]].map(([title, rows])=><section key={String(title)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><TrendingUp size={17} className="text-indigo-500"/><h2 className="font-semibold text-slate-900">{title}</h2></div><div className="space-y-3">{(rows as any[] || []).map((row:any)=><div key={String(row.role || row.status)}><div className="mb-1 flex justify-between text-xs"><span className="font-medium text-slate-600">{row.role || row.status}</span><span className="font-bold text-slate-900">{row.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{width:`${Math.min(100, Number(row.count)/Math.max(1,total(rows as any[]))*100)}%`}}/></div></div>)}</div></section>)}</div></div></main>;
}
