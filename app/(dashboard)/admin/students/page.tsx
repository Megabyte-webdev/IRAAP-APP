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
  ChevronDown,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Student } from "@/app/_utils/types";
import { ProjectStatusBadge } from "../../_components/StatusHelper";
import Link from "next/link";

type SortKey = "name" | "supervisor" | "status";

const StudentsPage = () => {
  const { studentsInfiniteQuery } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [filterBySupervisor, setFilterBySupervisor] = useState<
    "all" | "assigned" | "unassigned"
  >("all");

  const { ref: loadMoreRef, inView } = useInView();

  const {
    data: studentsPages,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = studentsInfiniteQuery();

  // Flatten all pages
  const allStudents = useMemo(() => {
    return studentsPages?.pages?.flatMap((page) => page.data) || [];
  }, [studentsPages]);

  // Apply search and filter
  const filteredStudents = useMemo(() => {
    let filtered = allStudents.filter((s: Student) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterBySupervisor === "assigned") {
        return !!s.supervisorId;
      } else if (filterBySupervisor === "unassigned") {
        return !s.supervisorId;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a: Student, b: Student) => {
      switch (sortBy) {
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "supervisor":
          return (a.supervisorName || "").localeCompare(b.supervisorName || "");
        case "status":
          return (a.projectStatus || "").localeCompare(b.projectStatus || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [allStudents, searchTerm, filterBySupervisor, sortBy]);

  // Auto-fetch next page when user scrolls to bottom
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: allStudents.length,
      assigned: allStudents.filter((s: Student) => s.supervisorId).length,
      unassigned: allStudents.filter((s: Student) => !s.supervisorId).length,
    };
  }, [allStudents]);

  if (isError) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-100 space-y-6 bg-red-50 rounded-2xl p-8 border border-red-200">
          <div className="p-4 bg-red-100 rounded-full text-red-600">
            <AlertCircle size={40} />
          </div>
          <div className="text-center max-w-sm">
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Failed to Load Students
            </h3>
            <p className="text-red-700 text-sm mb-6">
              There was an error connecting to the institutional database.
              Please try again or contact support if the issue persists.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              <RefreshCcw size={16} /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2">
            Research Students
          </h1>
          <p className="text-slate-600 text-base">
            Manage student assignments and track archival progress
          </p>
        </div>

        {/* STATS CARDS */}
        {!isLoading && allStudents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-linear-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-200/50 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">
                    Assigned
                  </p>
                  <p className="text-3xl font-bold text-emerald-900 mt-2">
                    {stats.assigned}
                  </p>
                </div>
                <div className="p-3 bg-emerald-200/50 rounded-lg">
                  <TrendingUp className="text-emerald-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider">
                    Unassigned
                  </p>
                  <p className="text-3xl font-bold text-amber-900 mt-2">
                    {stats.unassigned}
                  </p>
                </div>
                <div className="p-3 bg-amber-200/50 rounded-lg">
                  <Clock className="text-amber-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-200 rounded-xl p-4 sticky top-0 z-20 shadow-sm backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 md:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={filterBySupervisor}
            onChange={(e) =>
              setFilterBySupervisor(
                e.target.value as "all" | "assigned" | "unassigned",
              )
            }
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="all">All Students</option>
            <option value="assigned">Assigned Only</option>
            <option value="unassigned">Unassigned Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="name">Sort by Name</option>
            <option value="supervisor">Sort by Supervisor</option>
            <option value="status">Sort by Status</option>
          </select>

          <Link
            href="/admin/students/upload"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <FileSpreadsheet size={16} />
            <span className="hidden sm:inline">Bulk Import</span>
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Researcher
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Supervisor
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Archival Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Loading Skeletons */}
              {isLoading && allStudents.length === 0
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse hover:bg-slate-50/50">
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div className="h-4 w-40 bg-slate-200 rounded-md" />
                          <div className="h-3 w-56 bg-slate-100 rounded-md" />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 w-32 bg-slate-200 rounded-md" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-6 w-24 bg-slate-200 rounded-full" />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="h-8 w-8 bg-slate-200 rounded-lg ml-auto" />
                      </td>
                    </tr>
                  ))
                : filteredStudents.map((student: Student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="h-10 w-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-slate-900 text-sm truncate">
                              {student.fullName}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                              <Mail size={11} className="shrink-0" />
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {student.supervisorName ? (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-sm text-slate-700 font-medium">
                              {student.supervisorName}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1.5 rounded-md border border-amber-200">
                            <UserMinus size={12} />
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <ProjectStatusBadge status={student.projectStatus} />
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="border-t border-slate-100 bg-slate-50/50 p-4 flex justify-center"
          >
            <button
              onClick={() => handleLoadMore()}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all"
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <>
                  <div className="h-4 w-4 border-2 border-indigo-600/30 border-t-indigo-600 animate-spin rounded-full" />
                  Loading more...
                </>
              ) : (
                <>
                  <ChevronDown size={18} />
                  Load More Students
                </>
              )}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredStudents.length === 0 && (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="mb-4 p-4 bg-slate-100 rounded-full">
              <Search size={48} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {searchTerm || filterBySupervisor !== "all"
                ? "No students found"
                : "No students yet"}
            </h3>
            <p className="text-slate-500 text-sm max-w-xs">
              {searchTerm
                ? `No researchers match "${searchTerm}". Try a different search.`
                : filterBySupervisor === "assigned"
                  ? "All students have been assigned to supervisors."
                  : filterBySupervisor === "unassigned"
                    ? "All students have supervisors assigned."
                    : "Start by importing student records to get started."}
            </p>
            {filterBySupervisor !== "all" && (
              <button
                onClick={() => setFilterBySupervisor("all")}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {!isLoading && allStudents.length > 0 && (
        <div className="text-center text-sm text-slate-500">
          Showing {filteredStudents.length} of {allStudents.length} students
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
