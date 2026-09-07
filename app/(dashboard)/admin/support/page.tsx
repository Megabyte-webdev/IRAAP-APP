"use client";
import { useEffect, useState } from "react";
import { LifeBuoy, Send, ShieldCheck } from "lucide-react";
import { api } from "@/app/_lib/api-client";
import { onFailure, onSuccess } from "@/app/_utils/Notification";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<number,string>>({});
  const [updating, setUpdating] = useState<number | null>(null);

  const load = async () => { setLoading(true); try { setTickets((await api.get("/support")).data?.tickets || []); } catch { onFailure({ title: "Support unavailable", message: "We could not load support requests." }); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);

  const update = async (ticket:any) => {
    setUpdating(ticket.id);
    try {
      await api.patch(`/support/${ticket.id}`, { status: ticket.status, adminNote: notes[ticket.id]?.trim() || undefined });
      setNotes((prev) => ({ ...prev, [ticket.id]: "" }));
      onSuccess({ title: "Support updated", message: "The user has been notified with the latest status and response." });
      await load();
    } catch { onFailure({ title: "Update failed", message: "We could not send the support update." }); }
    finally { setUpdating(null); }
  };

  return <main className="min-h-full bg-slate-50 p-4 md:p-8"><div className="mx-auto max-w-6xl space-y-6">
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><LifeBuoy size={20}/></div><div><p className="text-[11px] font-bold uppercase tracking-wider text-sky-600">Support workspace</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Support requests</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Review requests, move tickets through their lifecycle, and send a custom response directly from the same workspace.</p></div></div></header>
    <div className="space-y-4">{loading ? <div className="rounded-2xl border bg-white p-8 text-sm text-slate-500">Loading requests…</div> : tickets.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">No support requests.</div> : tickets.map((ticket:any)=><article key={ticket.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-start md:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">#{ticket.id}</span><h2 className="truncate font-semibold text-slate-900">{ticket.subject}</h2><span className="rounded-full bg-sky-50 px-2 py-1 text-[10px] font-bold uppercase text-sky-700">{ticket.status}</span></div><p className="mt-1 text-xs text-slate-500">{ticket.fullName} · {ticket.email} · {ticket.role || "User"}{ticket.organization?.name ? ` · ${ticket.organization.name}` : ""}</p><p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{ticket.message}</p></div><select value={ticket.status} onChange={(e)=>setTickets((prev)=>prev.map((t)=>t.id===ticket.id?{...t,status:e.target.value}:t))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"><option>OPEN</option><option>IN_PROGRESS</option><option>RESOLVED</option><option>CLOSED</option></select></div>
      <div className="bg-slate-50/70 p-5"><label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><ShieldCheck size={14} className="text-sky-600"/>Custom response <span className="font-normal normal-case tracking-normal text-slate-400">sent by email and in-app</span></label><textarea value={notes[ticket.id] ?? ""} onChange={(e)=>setNotes((prev)=>({...prev,[ticket.id]:e.target.value}))} rows={3} placeholder="Write a professional response, assignment update, next step, or clarification…" className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"/><div className="mt-3 flex justify-end"><button type="button" onClick={()=>void update(ticket)} disabled={updating===ticket.id || (!notes[ticket.id]?.trim() && ticket.status === "OPEN")} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">{updating===ticket.id?"Sending…":<><Send size={14}/>Save & notify user</>}</button></div></div>
    </article>)}</div>
  </div></main>;
}
