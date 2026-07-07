"use client";

import {
  Users,
  Mail,
  FolderKanban,
  MessageSquare,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import useSupervisor from "@/app/_hooks/use-supervisor";
import Link from "next/link";
import { statusStyles } from "../../_components/StatusHelper";

interface AssignedStudent {
  id: number;
  fullName: string;
  email: string;
  supervisorId: number | null;
  projectId: number | null;
  projectTitle: string | null;
  projectStatus: string | null;
}

export default function AssignedStudentsPage() {
  const { getAssignedStudents } = useSupervisor();
  const { data: students, isLoading, error } = getAssignedStudents();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-80 bg-slate-200 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-slate-50 border border-slate-200 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="p-5 bg-rose-50 border border-rose-100 rounded-xl text-center text-rose-700">
          <p className="text-sm font-semibold">
            Failed to fetch assigned student roster profiles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-slate-700" />
          Assigned Roster Ranks
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Direct communication registry, tracking live project mapping
          definitions and active operational workflow conditions for all student
          records assigned to you.
        </p>
      </div>

      {/* Grid Container Matrix Layout */}
      {!students || students.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400 text-sm">
          No individual researchers have been bound to your supervisor account
          index yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student: AssignedStudent) => (
            <div
              key={student.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Profile Identity Details */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                    {student.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate leading-snug">
                      {student.fullName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <Mail size={12} />
                      {student.email}
                    </p>
                  </div>
                </div>

                {/* Sub-Project Link Status Badge Block */}
                <div className="bg-slate-50/50 rounded-lg p-3.5 border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <FolderKanban size={12} /> Active Research
                    </span>
                    {student.projectStatus && (
                      <span
                        className={`px-2 py-0.5 rounded-full border normal-case tracking-normal font-medium ${
                          statusStyles[student.projectStatus] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {student.projectStatus}
                      </span>
                    )}
                  </div>

                  {student.projectId ? (
                    <p className="text-slate-700 font-medium line-clamp-2 leading-relaxed">
                      {student.projectTitle}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic">
                      No active abstract metadata portfolio initialized yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Toolbar Control Deck */}
              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100">
                {student.projectId ? (
                  <Link
                    href={`/supervisor/projects/${student.projectId}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50/40 hover:bg-blue-50 py-2 rounded-lg border border-blue-100/50 transition-colors"
                  >
                    <span>View Project</span>
                    <ArrowRight size={12} />
                  </Link>
                ) : (
                  <div className="flex-1 text-center py-2 text-xs text-slate-400 bg-slate-50 rounded-lg font-medium select-none">
                    Awaiting Draft
                  </div>
                )}

                <Link
                  href={`/supervisor/chat/${student.id}`}
                  className="p-2 text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/60 transition-colors"
                  title="Open Chat Terminal"
                >
                  <MessageSquare size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
