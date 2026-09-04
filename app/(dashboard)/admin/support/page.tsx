"use client";
import { useEffect, useState } from "react";
import { LifeBuoy } from "lucide-react";
import { api } from "@/app/_lib/api-client";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { setTickets((await api.get("/support")).data?.tickets || []); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const update = async (id:number,status:string) => { await api.patch(`/support/${id}`, { status }); await load(); };
  return <main className="min-h-full bg-slate-50 p-4 md:p-8"><div className="mx-auto max-w-6xl space-y-6"><header><div className="mb-2 flex items-center gap-2 text-sky-600"><LifeBuoy size={18}/><span className="text-xs font-bold uppercase tracking-wider">Support</span></div><h1 className="text-3xl font-bold text-slate-900">Support requests</h1><p className="mt-1 text-sm text-slate-500">Manage technical issues and account enquiries submitted by users.</p></header><div className="space-y-4">{loading ? <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">Loading requests…</div> : tickets.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No support requests.</div> : tickets.map((ticket:any)=><article key={ticket.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-slate-900">{ticket.subject}</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">{ticket.status}</span></div><p className="mt-1 text-xs text-slate-500">{ticket.fullName} · {ticket.email} · {ticket.role || "User"}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{ticket.message}</p></div><select value={ticket.status} onChange={(e)=>void update(ticket.id,e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold"><option>OPEN</option><option>IN_PROGRESS</option><option>RESOLVED</option><option>CLOSED</option></select></div></article>)}</div></div></main>;
}
