"use client";

import { useState } from "react";
import { Building2, Plus, ShieldCheck, Clock3 } from "lucide-react";
import { useOrganization } from "@/app/_hooks/use-organization";

const emptyForm = {
  name: "",
  code: "",
  description: "",
  initialManagerName: "",
  initialManagerEmail: "",
};

export default function OrganizationsPage() {
  const { getOrganizations, createOrganization } = useOrganization();
  const { data: organizations = [], isLoading } = getOrganizations();
  const [form, setForm] = useState(emptyForm);

  return (
    <main className="min-h-full bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <div className="mb-2 flex items-center gap-2 text-indigo-600">
            <Building2 size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">Platform administration</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create organizations</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Platform admins create institutions and assign the initial manager. After that, organization operations stay inside the manager workspace.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Plus size={17} className="text-indigo-600" />
              <h2 className="font-semibold text-slate-900">New organization</h2>
            </div>
            <div className="space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="University / Research Institute" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Institution code (optional)" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700">Initial manager</p>
                <input value={form.initialManagerName} onChange={(e) => setForm({ ...form, initialManagerName: e.target.value })} placeholder="Manager full name" className="mb-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
                <input value={form.initialManagerEmail} onChange={(e) => setForm({ ...form, initialManagerEmail: e.target.value })} placeholder="Manager email" type="email" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
                <p className="mt-2 text-[10px] text-indigo-700/80">The backend generates the temporary password. It is never displayed in the admin dashboard.</p>
              </div>

              <button
                disabled={
                  !form.name.trim() ||
                  !form.initialManagerName.trim() ||
                  !form.initialManagerEmail.trim() ||
                  createOrganization.isPending
                }
                onClick={() => createOrganization.mutate(form, { onSuccess: () => setForm(emptyForm) })}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <ShieldCheck size={16} /> {createOrganization.isPending ? "Creating…" : "Create organization"}
              </button>
            </div>
          </div>

          <section className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((x) => <div key={x} className="h-40 animate-pulse rounded-2xl bg-white" />)}
              </div>
            ) : organizations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No organizations created yet.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {organizations.map((org: any) => {
                  const sub = org.latestSubscription;
                  const trialEnds = sub?.endsAt ? new Date(sub.endsAt) : null;
                  return (
                    <article key={org.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Building2 size={19} /></div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">{sub?.status || "TRIAL"}</span>
                      </div>
                      <h2 className="mt-3 font-semibold text-slate-900">{org.name}</h2>
                      <p className="mt-1 text-xs text-slate-500">{org.code || org.slug}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                        <Clock3 size={14} />
                        {sub?.planCode || "FREE"} {trialEnds ? `· ends ${trialEnds.toLocaleDateString()}` : ""}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
