"use client";

import { ChangeEvent, useState } from "react";
import Papa from "papaparse";
import { Building2, Plus, Upload, Users, GraduationCap, FlaskConical, BarChart3 } from "lucide-react";
import { useOrganization } from "@/app/_hooks/use-organization";

const emptyForm = { name: "", code: "", description: "" };

export default function OrganizationsPage() {
  const { getOrganizations, createOrganization, getMembers, importMembers, getAnalytics, updateSubscription } = useOrganization();
  const { data: organizations = [], isLoading } = getOrganizations();
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const { data: members = [] } = getMembers(selectedId);
  const { data: analytics = {} } = getAnalytics(selectedId);
  const [form, setForm] = useState(emptyForm);
  const [plan, setPlan] = useState("FREE");
  const [subscriptionStatus, setSubscriptionStatus] = useState("TRIAL");

  const selected = organizations.find((org: any) => org.id === selectedId);

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedId) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const members = (result.data as any[]).map((row) => ({
          fullName: String(row.fullName || `${row.firstname || ""} ${row.lastname || ""}`).trim(),
          email: String(row.email || "").trim(),
          role: String(row.role || "STUDENT").trim().toUpperCase(),
          department: String(row.department || "").trim(),
          externalRef: String(row.externalRef || row.matricNumber || "").trim(),
        })).filter((row) => row.fullName && row.email && ["STUDENT", "SUPERVISOR", "RESEARCHER"].includes(row.role));
        importMembers.mutate({ organizationId: selectedId, members: members as any });
      },
    });
    event.target.value = "";
  };

  return (
    <main className="min-h-full bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-indigo-600">
              <Building2 size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Institutional management</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Organizations</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">Create institutions, onboard supervisors and researchers, and monitor their research activity from one place.</p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2"><Plus size={17} className="text-indigo-600" /><h2 className="font-semibold text-slate-900">Add organization</h2></div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="University / Research Institute" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Institution code (optional)" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
              <button disabled={!form.name.trim() || createOrganization.isPending} onClick={() => createOrganization.mutate(form, { onSuccess: () => setForm(emptyForm) })} className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {createOrganization.isPending ? "Creating…" : "Create organization"}
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {organizations.map((org: any) => (
                <button key={org.id} onClick={() => setSelectedId(org.id)} className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${selectedId === org.id ? "border-indigo-500 ring-2 ring-indigo-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Building2 size={19} /></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">{org.latestSubscription?.planCode || "FREE"}</span></div>
                  <h3 className="mt-3 font-semibold text-slate-900">{org.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{org.code || org.slug}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-slate-50 p-2"><Users size={14} className="mx-auto text-slate-400" /><b className="mt-1 block text-sm">{org.counts?.students ?? 0}</b><span className="text-[10px] text-slate-400">Students</span></div>
                    <div className="rounded-lg bg-slate-50 p-2"><GraduationCap size={14} className="mx-auto text-slate-400" /><b className="mt-1 block text-sm">{org.counts?.supervisors ?? 0}</b><span className="text-[10px] text-slate-400">Supervisors</span></div>
                    <div className="rounded-lg bg-slate-50 p-2"><FlaskConical size={14} className="mx-auto text-slate-400" /><b className="mt-1 block text-sm">{org.counts?.researchers ?? 0}</b><span className="text-[10px] text-slate-400">Researchers</span></div>
                  </div>
                </button>
              ))}
            </div>

            {selected && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div><h2 className="font-bold text-slate-900">{selected.name}</h2><p className="text-xs text-slate-500">{selected.description || "Organization workspace"}</p></div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white"><Upload size={14} /> Import members<input type="file" accept=".csv,text/csv" className="hidden" onChange={handleImport} /></label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {[["Members", analytics.members], ["Projects", analytics.projects], ["Approved", analytics.approvedProjects], ["Pending pubs", analytics.pendingPublications], ["Published", analytics.approvedPublications]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value ?? 0}</p></div>)}
                </div>

                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <div className="mb-3 flex items-center gap-2"><BarChart3 size={16} className="text-indigo-600" /><p className="text-sm font-semibold text-slate-900">Subscription (isolated)</p></div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <select value={plan} onChange={(e) => setPlan(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option>FREE</option><option>INSTITUTION</option><option>ENTERPRISE</option></select>
                    <select value={subscriptionStatus} onChange={(e) => setSubscriptionStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option>TRIAL</option><option>ACTIVE</option><option>PAST_DUE</option><option>CANCELLED</option><option>EXPIRED</option></select>
                    <button onClick={() => updateSubscription.mutate({ organizationId: selected.id, planCode: plan, status: subscriptionStatus })} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Save subscription</button>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">This stores the subscription state only. It does not block any current IRAAP feature until billing is intentionally enabled.</p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="border-b border-slate-100 px-4 py-3"><p className="text-sm font-semibold text-slate-900">Organization members</p><p className="text-xs text-slate-500">CSV columns: fullName,email,role,department,externalRef. Role can be STUDENT, SUPERVISOR, or RESEARCHER.</p></div>
                  <div className="max-h-80 overflow-auto"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-slate-50"><tr><th className="px-4 py-3 text-xs font-bold text-slate-500">Name</th><th className="px-4 py-3 text-xs font-bold text-slate-500">Email</th><th className="px-4 py-3 text-xs font-bold text-slate-500">Organization role</th></tr></thead><tbody className="divide-y divide-slate-100">{members.map((member: any) => <tr key={member.id}><td className="px-4 py-3 font-medium text-slate-800">{member.user?.fullName}</td><td className="px-4 py-3 text-slate-500">{member.user?.email}</td><td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold">{member.role}</span></td></tr>)}</tbody></table></div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
