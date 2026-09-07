"use client";

import { FormEvent, useMemo, useState } from "react";
import Papa from "papaparse";
import { FileUp, UserPlus, Trash2, Users, ShieldCheck, Download } from "lucide-react";
import { useManager } from "@/app/_hooks/use-organization";
import { UserRole } from "@/app/_services/profile.service";
import { onFailure, onSuccess } from "@/app/_utils/Notification";

type ImportRow = { fullName: string; email: string; role: "STUDENT" | "SUPERVISOR" | "RESEARCHER"; department?: string };

export default function ManagerMembersPage() {
  const { getDashboard, getMembers, addManager, addMember, bulkImportMembers, updateRole, removeMember } = useManager();
  const { data: dashboard } = getDashboard();
  const { data: members = [], isLoading } = getMembers();
  const [mode, setMode] = useState<"member" | "manager">("member");
  const [fullName, setFullName] = useState(""); const [email, setEmail] = useState(""); const [department, setDepartment] = useState("");
  const [memberRole, setMemberRole] = useState<"STUDENT"|"SUPERVISOR"|"RESEARCHER">("STUDENT");
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const managerCount = useMemo(() => members.filter((m:any) => m.role === "MANAGER").length, [members]);
  const limits = dashboard?.trialLimits || {}; const isTrial = dashboard?.subscription?.status === "TRIAL";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const clear = () => { setFullName(""); setEmail(""); setDepartment(""); };
    if (mode === "member") addMember.mutate({ fullName, email, role: memberRole, department: department || undefined }, { onSuccess: clear });
    else addManager.mutate({ fullName, email, department: department || undefined }, { onSuccess: clear });
  };

  const parseImport = (file?: File) => {
    if (!file) return;
    Papa.parse(file, { header: true, skipEmptyLines: true, complete: (result: any) => {
      const fields = result.meta.fields || [];
      if (!fields.includes("fullName") || !fields.includes("email") || !fields.includes("role")) {
        onFailure({ title: "CSV columns required", message: "Use fullName, email and role. Department is optional." }); return;
      }
      const rows = (result.data || []).map((row:any) => ({
        fullName: String(row.fullName || "").trim(), email: String(row.email || "").trim().toLowerCase(),
        role: String(row.role || "STUDENT").trim().toUpperCase(), department: String(row.department || "").trim() || undefined,
      })).filter((r:ImportRow) => r.fullName && r.email);
      const unique = Array.from(new Map(rows.map((r:ImportRow) => [r.email, r])).values()) as ImportRow[];
      setImportRows(unique as ImportRow[]);
      onSuccess({ title: "Import preview ready", message: `${unique.length} member${unique.length === 1 ? "" : "s"} ready to review.` });
    }});
  };

  const downloadTemplate = () => {
    const csv = "fullName,email,role,department\nJane Doe,jane@example.com,STUDENT,Computer Science\nJohn Doe,john@example.com,SUPERVISOR,Computer Science\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "iraap-member-import-template.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const validImportRows = importRows.filter((r) => ["STUDENT","SUPERVISOR","RESEARCHER"].includes(r.role));
  return <main className="min-h-full bg-slate-50 p-4 md:p-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div><div className="flex items-center gap-2 text-indigo-600"><Users size={18}/><span className="text-xs font-bold uppercase tracking-wider">Members</span></div><h1 className="mt-2 text-2xl font-bold text-slate-900">Organization access</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Invite individuals or import your roster in one controlled workflow. Existing IRAAP accounts remain intact and receive an organization notification.</p></div>
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-right"><p className="text-xs text-slate-400">Total members</p><p className="text-xl font-bold text-slate-900">{members.length}</p></div>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex gap-2 rounded-xl bg-slate-100 p-1"><button type="button" onClick={()=>setMode("member")} className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${mode==="member"?"bg-white text-slate-900 shadow-sm":"text-slate-500"}`}>Add member</button><button type="button" onClick={()=>setMode("manager")} className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${mode==="manager"?"bg-white text-slate-900 shadow-sm":"text-slate-500"}`}>Add manager</button></div>
          <form onSubmit={submit} className="space-y-3"><input required value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"/><input value={department} onChange={e=>setDepartment(e.target.value)} placeholder="Department (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"/>{mode==="member"&&<select value={memberRole} onChange={e=>setMemberRole(e.target.value as any)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="STUDENT">Student</option><option value="SUPERVISOR">Supervisor</option><option value="RESEARCHER">Researcher</option></select>}{mode==="manager"&&isTrial&&<div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">Trial manager limit: {managerCount}/{limits.managers||1}</div>}<button disabled={(mode==="manager"?addManager.isPending:addMember.isPending)||(mode==="manager"&&isTrial&&managerCount>=Number(limits.managers||1))} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><UserPlus size={16}/>{mode==="manager"?(addManager.isPending?"Adding…":"Add manager"):(addMember.isPending?"Adding…":"Add member")}</button></form>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-2"><FileUp size={18} className="text-indigo-600"/><h2 className="font-semibold text-slate-900">Bulk import</h2></div><p className="mt-1 text-sm text-slate-500">Import students, supervisors, and researchers from a CSV, review the rows, then commit once.</p></div><button type="button" onClick={downloadTemplate} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Download size={14}/>Template</button></div>
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-8 text-center hover:border-indigo-300 hover:bg-indigo-50/30"><input type="file" accept=".csv,text/csv" className="hidden" onChange={e=>parseImport(e.target.files?.[0])}/><FileUp className="mb-2 text-slate-400" size={28}/><span className="text-sm font-semibold text-slate-800">Choose CSV roster</span><span className="mt-1 text-xs text-slate-500">Columns: fullName, email, role, department</span></label>
            {importRows.length > 0 && <div className="mt-4 overflow-hidden rounded-xl border border-slate-200"><div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3"><div><p className="text-sm font-semibold text-slate-900">{importRows.length} rows ready</p><p className="text-xs text-slate-500">Invalid roles are highlighted before import.</p></div><button type="button" onClick={()=>{setImportRows([]);}} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Clear</button></div><div className="max-h-52 overflow-y-auto"><table className="w-full text-left text-xs"><thead className="bg-white"><tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Email</th><th className="px-4 py-2">Role</th></tr></thead><tbody className="divide-y divide-slate-100">{importRows.map((r,i)=><tr key={i}><td className="px-4 py-2">{r.fullName}</td><td className="px-4 py-2 text-slate-500">{r.email}</td><td className={`px-4 py-2 font-semibold ${["STUDENT","SUPERVISOR","RESEARCHER"].includes(r.role)?"text-emerald-600":"text-red-600"}`}>{r.role}</td></tr>)}</tbody></table></div><button type="button" disabled={!validImportRows.length || bulkImportMembers.isPending} onClick={()=>bulkImportMembers.mutate(validImportRows,{onSuccess:()=>setImportRows([])})} className="m-3 flex w-[calc(100%-1.5rem)] items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{bulkImportMembers.isPending?"Importing…":`Import ${validImportRows.length} members`}</button></div>}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Current members</h2><p className="mt-1 text-xs text-slate-500">Role changes are notified to the member. Removing access does not delete their IRAAP account.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50"><tr><th className="px-5 py-3 text-xs font-bold text-slate-500">Name</th><th className="px-5 py-3 text-xs font-bold text-slate-500">Email</th><th className="px-5 py-3 text-xs font-bold text-slate-500">Role</th><th className="px-5 py-3 text-xs font-bold text-slate-500">Department</th><th className="px-5 py-3 text-right text-xs font-bold text-slate-500">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{isLoading?<tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400">Loading members…</td></tr>:members.map((member:any)=><tr key={member.id}><td className="px-5 py-3 font-medium text-slate-800">{member.user?.fullName}</td><td className="px-5 py-3 text-slate-500">{member.user?.email}</td><td className="px-5 py-3"><select value={member.role} onChange={e=>updateRole.mutate({userId:member.user.id,role:e.target.value as UserRole,department:member.department||undefined})} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"><option value="STUDENT">Student</option><option value="SUPERVISOR">Supervisor</option><option value="RESEARCHER">Researcher</option><option value="MANAGER">Manager</option></select></td><td className="px-5 py-3 text-slate-500">{member.department||"—"}</td><td className="px-5 py-3 text-right"><button onClick={()=>{if(window.confirm(`Remove ${member.user?.fullName} from this organization?`)) removeMember.mutate(member.user.id)}} disabled={removeMember.isPending} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={14}/>Remove</button></td></tr>)}</tbody></table></div></div>
        </div>
      </section>
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5"><div className="flex items-start gap-3"><ShieldCheck size={18} className="mt-0.5 text-indigo-600"/><div><h3 className="font-semibold text-slate-900">Existing-account behavior</h3><p className="mt-1 text-sm leading-6 text-slate-600">A matching email is attached to the organization instead of creating a second login. The user receives an in-app notification and email explaining the new role. New users receive onboarding credentials and the same in-app notification.</p></div></div></section>
    </div>
  </main>;
}
