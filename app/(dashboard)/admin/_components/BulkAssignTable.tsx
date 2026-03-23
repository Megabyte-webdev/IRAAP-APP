"use client";
import { useState, useMemo } from "react";
import {
  Check,
  UserPlus,
  Users,
  Search,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import useAdmin from "@/app/_hooks/use-admin";
import { cn } from "@/app/_lib/utils";

export default function BulkAssignTable() {
  const { supervisorsQuery, studentsQuery, bulkAssignData } = useAdmin();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [targetSupervisor, setTargetSupervisor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: supervisors } = supervisorsQuery();
  const { data: unassignedStudents } = studentsQuery();

  // 1. Memoized Filtered List
  const filteredStudents = useMemo(() => {
    return unassignedStudents?.filter(
      (s: any) =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [unassignedStudents, searchTerm]);

  // 2. Intelligent Logic: Only update students whose supervisor is DIFFERENT from target
  const studentsToUpdate = useMemo(() => {
    if (!targetSupervisor) return [];
    return selectedIds.filter((id) => {
      const student = unassignedStudents?.find((s: any) => s.id === id);
      return (
        student && String(student.supervisorId) !== String(targetSupervisor)
      );
    });
  }, [selectedIds, targetSupervisor, unassignedStudents]);

  const toggleAll = () => {
    if (selectedIds.length === filteredStudents?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents?.map((s: any) => s.id) || []);
    }
  };

  const toggleStudent = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkAssign = async () => {
    if (!targetSupervisor || studentsToUpdate.length === 0) return;

    bulkAssignData.mutate(
      {
        supervisorId: Number(targetSupervisor),
        studentIds: studentsToUpdate,
      },
      {
        onSuccess: () => {
          setSelectedIds([]);
          setTargetSupervisor("");
        },
      },
    );
  };

  return (
    <div className="flex flex-col min-h-150 bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
      {/* HEADER ACTION BAR */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="flex-1 md:flex-none text-sm font-medium p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              value={targetSupervisor}
              onChange={(e) => setTargetSupervisor(e.target.value)}
            >
              <option value="">Choose Target Supervisor</option>
              {supervisors?.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.studentCount} assigned)
                </option>
              ))}
            </select>

            <button
              onClick={handleBulkAssign}
              disabled={
                !targetSupervisor ||
                studentsToUpdate.length === 0 ||
                bulkAssignData.isPending
              }
              className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 transition-all shadow-lg shadow-indigo-100"
            >
              {bulkAssignData.isPending ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : (
                <UserPlus size={16} />
              )}
              {studentsToUpdate.length > 0
                ? `Update ${studentsToUpdate.length} Students`
                : "Assign Students"}
            </button>
          </div>
        </div>
      </div>

      {/* RESPONSIVE TABLE/LIST */}
      <div className="flex-1">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-[48px_2fr_2fr_1fr] px-6 py-3 bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex justify-center">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              checked={
                selectedIds.length > 0 &&
                selectedIds.length === filteredStudents?.length
              }
              onChange={toggleAll}
            />
          </div>
          <div>Student Details</div>
          <div>Email Address</div>
          <div>Status</div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredStudents?.map((student: any) => (
            <div
              key={student.id}
              onClick={() => toggleStudent(student.id)}
              className={cn(
                "group cursor-pointer transition-all lg:grid lg:grid-cols-[48px_2fr_2fr_1fr] items-center p-4 lg:px-6 lg:py-4",
                selectedIds.includes(student.id)
                  ? "bg-indigo-50/40"
                  : "hover:bg-slate-50",
              )}
            >
              {/* Checkbox */}
              <div className="hidden lg:flex justify-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedIds.includes(student.id)}
                  readOnly
                />
              </div>

              {/* Info Column */}
              <div className="flex items-center gap-3">
                <div className="lg:hidden flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-indigo-600 mr-3 h-5 w-5"
                    checked={selectedIds.includes(student.id)}
                    readOnly
                  />
                </div>
                <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {student.fullName.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-800 truncate">
                    {student.fullName}
                  </span>
                  <span className="lg:hidden text-xs text-slate-500 truncate">
                    {student.email}
                  </span>
                </div>
              </div>

              {/* Email (Desktop Only) */}
              <div className="hidden lg:block text-sm text-slate-600 font-medium truncate">
                {student.email}
              </div>

              {/* Status Badge */}
              <div className="mt-3 lg:mt-0 flex items-center justify-between lg:justify-start">
                {student.supervisorId ? (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Assigned
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                    Unassigned
                  </span>
                )}
                <button className="lg:hidden p-2 text-slate-400">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE FLOATING ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] md:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {selectedIds.length} Students Selected
              </span>
              <span className="text-sm text-slate-200 font-medium truncate max-w-35">
                {!targetSupervisor
                  ? "Select Supervisor"
                  : studentsToUpdate.length === 0
                    ? "No Changes Needed"
                    : `Update ${studentsToUpdate.length} records`}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBulkAssign();
              }}
              disabled={
                studentsToUpdate.length === 0 ||
                !targetSupervisor ||
                bulkAssignData.isPending
              }
              className="bg-indigo-500 px-5 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-all disabled:bg-slate-700 disabled:text-slate-500"
            >
              {bulkAssignData.isPending ? "..." : "Confirm"}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredStudents?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <Users className="text-slate-300" size={40} />
          </div>
          <h3 className="text-slate-900 font-bold text-lg">
            No students found
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            We couldn't find any students matching your current search or
            filter.
          </p>
        </div>
      )}
    </div>
  );
}
