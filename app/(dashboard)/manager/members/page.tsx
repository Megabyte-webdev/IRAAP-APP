"use client";

import { FormEvent, useMemo, useState } from "react";
import Papa from "papaparse";
import {
  FileUp,
  UserPlus,
  Trash2,
  Users,
  Download,
  CheckCircle2,
  X,
} from "lucide-react";
import { useManager } from "@/app/_hooks/use-organization";
import { UserRole } from "@/app/_services/profile.service";
import { onFailure, onSuccess } from "@/app/_utils/Notification";

type ImportRole = "STUDENT" | "SUPERVISOR" | "RESEARCHER";
type ImportRow = { fullName: string; email: string; role: ImportRole; department?: string };

const IMPORT_ROLES: ImportRole[] = ["STUDENT", "SUPERVISOR", "RESEARCHER"];

export default function ManagerMembersPage() {
  const { getDashboard, getMembers, addManager, addMember, bulkImportMembers, updateRole, removeMember } = useManager();
  const { data: dashboard } = getDashboard();
  const { data: members = [], isLoading } = getMembers();

  const [mode, setMode] = useState<"member" | "manager">("member");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [memberRole, setMemberRole] = useState<ImportRole>("STUDENT");
  const [importRows, setImportRows] = useState<ImportRow[]>([]);

  const managerCount = useMemo(() => members.filter((m: any) => m.role === "MANAGER").length, [members]);
  const limits = dashboard?.trialLimits || {};
  const isTrial = dashboard?.subscription?.status === "TRIAL";
  const managerLimitReached = isTrial && managerCount >= Number(limits.managers || 1);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const clear = () => {
      setFullName("");
      setEmail("");
      setDepartment("");
    };

    if (mode === "member") {
      addMember.mutate(
        { fullName, email, role: memberRole, department: department || undefined },
        { onSuccess: clear },
      );
    } else {
      addManager.mutate(
        { fullName, email, department: department || undefined },
        { onSuccess: clear },
      );
    }
  };

  const parseImport = (file?: File) => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: any) => {
        const fields = result.meta.fields || [];
        if (!fields.includes("fullName") || !fields.includes("email") || !fields.includes("role")) {
          onFailure({
            title: "CSV columns required",
            message: "Use fullName, email and role. Department is optional.",
          });
          return;
        }

        const rows = (result.data || []).map((row: any) => ({
          fullName: String(row.fullName || "").trim(),
          email: String(row.email || "").trim().toLowerCase(),
          role: String(row.role || "STUDENT").trim().toUpperCase() as ImportRole,
          department: String(row.department || "").trim() || undefined,
        })).filter((r: ImportRow) => r.fullName && r.email);

        const unique = Array.from(
          new Map(rows.map((r: ImportRow) => [r.email, r])).values(),
        ) as ImportRow[];

        setImportRows(unique);
        onSuccess({
          title: "Import preview ready",
          message: `${unique.length} member${unique.length === 1 ? "" : "s"} ready to review.`,
        });
      },
      error: () => onFailure({ title: "CSV could not be read", message: "Please upload a valid CSV roster." }),
    });
  };

  const downloadTemplate = () => {
    const csv = "fullName,email,role,department\nJane Doe,jane@example.com,STUDENT,Computer Science\nJohn Doe,john@example.com,SUPERVISOR,Computer Science\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "iraap-member-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const invalidRows = importRows.filter((r) => !IMPORT_ROLES.includes(r.role));
  const validImportRows = importRows.filter((r) => IMPORT_ROLES.includes(r.role));

  return (
    <main className="min-h-full overflow-x-hidden bg-slate-50 p-3 sm:p-4 md:p-8">
      <div className="mx-auto min-w-0 max-w-7xl space-y-5 md:space-y-6">
        <header className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-indigo-600">
                <Users size={18} />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em]">Members</span>
              </div>
              <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Organization access</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Add individuals or import a roster. Existing IRAAP accounts keep their login and previous research history; only their organization context is added.
              </p>
            </div>
            <div className="shrink-0 rounded-xl bg-slate-50 px-4 py-3 sm:min-w-[110px] sm:text-right">
              <p className="text-xs text-slate-400">Total members</p>
              <p className="text-xl font-bold text-slate-900">{members.length}</p>
            </div>
          </div>
        </header>

        <section className="grid min-w-0 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
              <button type="button" onClick={() => setMode("member")} className={`rounded-lg px-3 py-2 text-xs font-semibold ${mode === "member" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Add member</button>
              <button type="button" onClick={() => setMode("manager")} className={`rounded-lg px-3 py-2 text-xs font-semibold ${mode === "manager" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Add manager</button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />
              <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department (optional)" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" />

              {mode === "member" && (
                <select value={memberRole} onChange={(e) => setMemberRole(e.target.value as ImportRole)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="STUDENT">Student</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="RESEARCHER">Researcher</option>
                </select>
              )}

              {mode === "manager" && isTrial && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  Trial manager limit: <strong>{managerCount}/{limits.managers || 1}</strong>
                </div>
              )}

              <button
                disabled={(mode === "manager" ? addManager.isPending : addMember.isPending) || Boolean(managerLimitReached && mode === "manager")}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserPlus size={16} />
                {mode === "manager" ? (addManager.isPending ? "Adding…" : "Add manager") : (addMember.isPending ? "Adding…" : "Add member")}
              </button>
            </form>
          </div>

          <div className="min-w-0 space-y-5">
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2"><FileUp size={18} className="text-indigo-600" /><h2 className="font-semibold text-slate-900">Bulk import</h2></div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Upload a CSV, validate it, review the roster, then commit once. The preview stays inside the card on small screens.</p>
                </div>
                <button type="button" onClick={downloadTemplate} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Download size={14} />Template</button>
              </div>

              <label className="mt-4 flex min-w-0 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-4 py-7 text-center hover:border-indigo-300 hover:bg-indigo-50/30 sm:px-6 sm:py-8">
                <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => parseImport(e.target.files?.[0])} />
                <FileUp className="mb-2 text-slate-400" size={28} />
                <span className="text-sm font-semibold text-slate-800">Choose CSV roster</span>
                <span className="mt-1 max-w-full break-words text-xs text-slate-500">Columns: fullName, email, role, department</span>
              </label>

              {importRows.length > 0 && (
                <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between gap-3 border-b bg-slate-50 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{importRows.length} rows ready</p>
                      <p className="mt-0.5 text-xs text-slate-500">{invalidRows.length ? `${invalidRows.length} row${invalidRows.length === 1 ? "" : "s"} need${invalidRows.length === 1 ? "s" : ""} correction.` : "All roles are valid."}</p>
                    </div>
                    <button type="button" onClick={() => setImportRows([])} aria-label="Clear import preview" className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"><X size={16} /></button>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    <div className="hidden overflow-x-auto md:block">
                      <table className="w-full min-w-[640px] table-fixed text-left text-xs">
                        <thead className="sticky top-0 bg-white"><tr className="border-b border-slate-100"><th className="w-[25%] px-4 py-2">Name</th><th className="w-[36%] px-4 py-2">Email</th><th className="w-[18%] px-4 py-2">Role</th><th className="w-[21%] px-4 py-2">Department</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {importRows.map((row, index) => (
                            <tr key={`${row.email}-${index}`} className={IMPORT_ROLES.includes(row.role) ? "" : "bg-red-50/70"}>
                              <td className="truncate px-4 py-2 font-medium text-slate-800">{row.fullName}</td>
                              <td className="truncate px-4 py-2 text-slate-500">{row.email}</td>
                              <td className={`px-4 py-2 font-semibold ${IMPORT_ROLES.includes(row.role) ? "text-emerald-600" : "text-red-600"}`}>{row.role}</td>
                              <td className="truncate px-4 py-2 text-slate-500">{row.department || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="divide-y divide-slate-100 md:hidden">
                      {importRows.map((row, index) => (
                        <div key={`${row.email}-${index}`} className={`p-3 ${IMPORT_ROLES.includes(row.role) ? "bg-white" : "bg-red-50/70"}`}>
                          <div className="flex min-w-0 items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">{row.fullName}</p>
                              <p className="mt-0.5 truncate text-xs text-slate-500">{row.email}</p>
                            </div>
                            <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${IMPORT_ROLES.includes(row.role) ? "bg-emerald-50 text-emerald-700" : "bg-red-100 text-red-700"}`}>{row.role}</span>
                          </div>
                          <p className="mt-2 truncate text-xs text-slate-500">{row.department || "No department supplied"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 p-3">
                    <button
                      type="button"
                      disabled={!validImportRows.length || invalidRows.length > 0 || bulkImportMembers.isPending}
                      onClick={() => bulkImportMembers.mutate(validImportRows, { onSuccess: () => setImportRows([]) })}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {bulkImportMembers.isPending ? "Importing…" : <><CheckCircle2 size={16} /> Import {validImportRows.length} members</>}
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-4 sm:px-5"><h2 className="font-semibold text-slate-900">Current members</h2><p className="mt-1 text-xs leading-5 text-slate-500">Role changes are notified to the member. Removing access does not delete their IRAAP account.</p></div>

              {isLoading ? (
                <div className="px-5 py-12 text-center text-sm text-slate-400">Loading members…</div>
              ) : members.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-slate-400">No members have been added yet.</div>
              ) : (
                <>
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-slate-50"><tr><th className="px-5 py-3 text-xs font-bold text-slate-500">Name</th><th className="px-5 py-3 text-xs font-bold text-slate-500">Email</th><th className="px-5 py-3 text-xs font-bold text-slate-500">Role</th><th className="px-5 py-3 text-xs font-bold text-slate-500">Department</th><th className="px-5 py-3 text-right text-xs font-bold text-slate-500">Action</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {members.map((member: any) => (
                          <tr key={member.id}>
                            <td className="px-5 py-3 font-medium text-slate-800">{member.user?.fullName}</td>
                            <td className="max-w-[260px] truncate px-5 py-3 text-slate-500">{member.user?.email}</td>
                            <td className="px-5 py-3"><select value={member.role} onChange={(e) => updateRole.mutate({ userId: member.user.id, role: e.target.value as UserRole, department: member.department || undefined })} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"><option value="STUDENT">Student</option><option value="SUPERVISOR">Supervisor</option><option value="RESEARCHER">Researcher</option><option value="MANAGER">Manager</option></select></td>
                            <td className="px-5 py-3 text-slate-500">{member.department || "—"}</td>
                            <td className="px-5 py-3 text-right"><button onClick={() => { if (window.confirm(`Remove ${member.user?.fullName} from this organization?`)) removeMember.mutate(member.user.id); }} disabled={removeMember.isPending} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={14} />Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="divide-y divide-slate-100 md:hidden">
                    {members.map((member: any) => (
                      <article key={member.id} className="min-w-0 p-4">
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{member.user?.fullName}</p>
                            <p className="mt-0.5 truncate text-xs text-slate-500">{member.user?.email}</p>
                          </div>
                          <button onClick={() => { if (window.confirm(`Remove ${member.user?.fullName} from this organization?`)) removeMember.mutate(member.user.id); }} disabled={removeMember.isPending} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={14} />Remove</button>
                        </div>
                        <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
                          <label className="min-w-0"><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Organization role</span><select value={member.role} onChange={(e) => updateRole.mutate({ userId: member.user.id, role: e.target.value as UserRole, department: member.department || undefined })} className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs"><option value="STUDENT">Student</option><option value="SUPERVISOR">Supervisor</option><option value="RESEARCHER">Researcher</option><option value="MANAGER">Manager</option></select></label>
                          <div className="min-w-0"><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</span><p className="truncate rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600">{member.department || "Not supplied"}</p></div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
