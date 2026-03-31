"use client";

import {
  Search,
  Mail,
  AlertCircle,
  RefreshCcw,
  Users,
  ArrowUpRight,
  GraduationCap,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import useAdmin from "@/app/_hooks/use-admin";

const SupervisorManagementPage = () => {
  const { supervisorsQuery } = useAdmin();
  const { data: supervisors, isLoading, isError, refetch } = supervisorsQuery();

  const [searchTerm, setSearchTerm] = useState("");

  // Adjusted to check both 'name' and 'fullName' to avoid undefined errors
  const filteredSupervisors = supervisors?.filter(
    (s: any) =>
      (s.fullName || s.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.department || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="p-3 bg-red-50 rounded-full text-red-500">
          <AlertCircle size={32} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">Connection Error</h3>
          <p className="text-slate-500 text-sm">
            Could not load the supervisor directory.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all"
        >
          <RefreshCcw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Supervisor Directory
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage faculty assignments and monitor supervision workloads.
            </p>
          </div>

          {/* New Add Supervisor Button */}
          <Link
            href="/admin/supervisors/upload"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95"
          >
            <UserPlus size={18} />
            Add Supervisor
          </Link>
        </div>

        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search name, email, or department..."
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- KPIs --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Total Faculty
            </p>
            <p className="text-2xl font-black text-slate-900">
              {supervisors?.length || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Active Supervisions
            </p>
            <p className="text-2xl font-black text-slate-900">
              {supervisors?.reduce(
                (acc: number, s: any) => acc + (s.studentCount || 0),
                0,
              ) || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              System Status
            </p>
            <p className="text-2xl font-black text-slate-900">Active</p>
          </div>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Faculty Member
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Department
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                  Workload
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-6">
                        <div className="h-4 w-48 bg-slate-100 rounded" />
                      </td>
                      <td className="px-6 py-6">
                        <div className="h-4 w-32 bg-slate-100 rounded" />
                      </td>
                      <td className="px-6 py-6">
                        <div className="h-2 w-16 bg-slate-100 rounded-full mx-auto" />
                      </td>
                      <td className="px-6 py-6">
                        <div className="h-8 w-20 bg-slate-100 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                : filteredSupervisors?.map((supervisor: any) => (
                    <tr
                      key={supervisor.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">
                            {supervisor.fullName || supervisor.name}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <Mail size={12} />
                            <span>{supervisor.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
                          {supervisor.department || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-700">
                            {supervisor.studentCount || 0} Students
                          </span>
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full transition-all duration-500"
                              style={{
                                width: `${Math.min(((supervisor.studentCount || 0) / 10) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/supervisors/${supervisor.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                        >
                          Manage <ArrowUpRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredSupervisors?.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Search size={40} className="mb-4 text-slate-100" />
            <p className="text-sm font-medium">
              No results found for "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorManagementPage;
