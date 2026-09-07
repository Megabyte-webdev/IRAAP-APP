"use client";

import { useState } from "react";
import { Megaphone, Send, Users, Info } from "lucide-react";
import { api } from "@/app/_lib/api-client";
import { onFailure, onSuccess } from "@/app/_utils/Notification";

export default function AdminCommunicationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("/dashboard");
  const [roles, setRoles] = useState<string[]>(["STUDENT", "SUPERVISOR"]);
  const [sending, setSending] = useState(false);

  const toggleRole = (role: string) => setRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]);

  const send = async () => {
    if (!title.trim() || !message.trim() || !roles.length) {
      onFailure({ title: "Complete the announcement", message: "Add a title, message, and at least one recipient group." });
      return;
    }
    setSending(true);
    try {
      const { data } = await api.post("/admin/notifications/broadcast", { title: title.trim(), message: message.trim(), link: link.trim() || "/dashboard", roles });
      onSuccess({ title: "Broadcast sent", message: `Delivered to ${data?.sent ?? 0} selected account${data?.sent === 1 ? "" : "s"}.` });
      setTitle(""); setMessage("");
    } catch (error:any) {
      onFailure({ title: "Broadcast failed", message: error?.response?.data?.message || "Unable to send the announcement." });
    } finally { setSending(false); }
  };

  return <main className="min-h-full bg-slate-50 p-4 md:p-8"><div className="mx-auto max-w-4xl space-y-6">
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Megaphone size={20}/></div><div><p className="text-[11px] font-bold uppercase tracking-wider text-violet-600">Platform communications</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Broadcast an announcement</h1><p className="mt-1 text-sm leading-6 text-slate-500">Send a consistent, professional in-app and push notification to selected platform users.</p></div></div></header>

    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-5">
        <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Recipient groups</label><div className="flex flex-wrap gap-2">{[["STUDENT","Students"],["SUPERVISOR","Supervisors"],["ADMIN","Administrators"]].map(([value,label])=><button key={value} type="button" onClick={()=>toggleRole(value)} className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${roles.includes(value)?"bg-slate-900 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}><Users size={13} className="mr-1.5 inline"/> {label}</button>)}</div></div>
        <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Title</label><input value={title} onChange={e=>setTitle(e.target.value)} maxLength={255} placeholder="e.g. Scheduled platform maintenance" className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"/></div>
        <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Message</label><textarea value={message} onChange={e=>setMessage(e.target.value)} rows={6} maxLength={5000} placeholder="Write a clear message with the action users should take, if any." className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm leading-6 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"/><p className="mt-1 text-right text-[10px] text-slate-400">{message.length}/5000</p></div>
        <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Open link <span className="font-normal normal-case tracking-normal">(optional)</span></label><input value={link} onChange={e=>setLink(e.target.value)} placeholder="/dashboard" className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-violet-400"/></div>
        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500"><Info size={15} className="mt-0.5 shrink-0 text-slate-400"/>The announcement is saved in each recipient’s notification inbox. Push delivery is handled by the Service Worker when available.</div>
        <div className="flex justify-end"><button type="button" onClick={()=>void send()} disabled={sending || !title.trim() || !message.trim() || !roles.length} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50">{sending?"Sending…":<><Send size={16}/>Send broadcast</>}</button></div>
      </div>
    </section>
  </div></main>;
}
