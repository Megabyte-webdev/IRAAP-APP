"use client";

import useAdmin from "@/app/_hooks/use-admin";
import {
  Search,
  UserMinus,
  Mail,
  MoreVertical,
  AlertCircle,
  RefreshCcw,
  FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";
import { Student } from "@/app/_utils/types";
import { ProjectStatusBadge } from "../../_components/StatusHelper";
import Link from "next/link";

const StudentsPage = () => {
  const { studentsQuery } = useAdmin();
  const { data: students, isLoading, isError, refetch } = studentsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students?.filter(
    (s: Student) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="p-3 bg-red-50 rounded-full text-red-500">
          <AlertCircle size={32} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">
            Failed to load students
          </h3>
          <p className="text-slate-500">
            There was an error connecting to the institutional database.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm"
        >
          <RefreshCcw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Research Students
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor archival progress and supervisor assignments.
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search name or email..."
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-72 transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link
          href="/admin/students/upload"
          className="flex items-center w-max gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          <FileSpreadsheet size={18} />
          Bulk Import
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Researcher
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Supervisor
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Archival Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* --- 2. Loading State (Skeletons) --- */}
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 w-32 bg-slate-100 rounded mb-2" />
                        <div className="h-3 w-48 bg-slate-50 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 bg-slate-100 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 bg-slate-100 rounded-full" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-8 w-8 bg-slate-100 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                : filteredStudents?.map((student: Student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-sm tracking-tight">
                            {student.fullName}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Mail size={12} className="text-slate-300" />{" "}
                            {student.email}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {student.supervisorName ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            {student.supervisorName}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[11px] text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 w-fit font-bold uppercase">
                            <UserMinus size={12} /> Unassigned
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <ProjectStatusBadge status={student.projectStatus} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredStudents?.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Search size={40} className="mb-4 text-slate-200" />
            <p className="text-sm font-medium">
              No researchers found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentsPage;
