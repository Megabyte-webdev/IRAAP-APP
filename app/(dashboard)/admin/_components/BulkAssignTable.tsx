"use client";

import { useState, useMemo, useCallback } from "react";
import useAdmin from "@/app/_hooks/use-admin";
import BulkAssignHeader from "./BulkAssignHeader";
import BulkAssignList from "./BulkAssignList";

export default function BulkAssignTable() {
  const { supervisorsQuery, studentsInfiniteQuery, bulkAssignData } =
    useAdmin();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [targetSupervisor, setTargetSupervisor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Queries
  const {
    data: supervisors,
    isLoading: supLoading,
    isError: isSupError,
    error: supError,
  } = supervisorsQuery();

  const {
    data: studentsPages,
    isLoading: stuLoading,
    isError: isStuError,
    error: stuError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = studentsInfiniteQuery();

  const allStudents = useMemo(() => {
    return studentsPages?.pages?.flatMap((page) => page.data) || [];
  }, [studentsPages]);

  const supervisorMap = useMemo(() => {
    const map: Record<number, any> = {};
    supervisors?.forEach((s: any) => {
      map[s.id] = s;
    });
    return map;
  }, [supervisors]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(
      (s: any) =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allStudents, searchTerm]);

  const studentsToUpdate = useMemo(() => {
    if (!targetSupervisor) return [];
    return selectedIds.filter((id) => {
      const student = allStudents.find((s: any) => s.id === id);
      return (
        student && String(student.supervisorId) !== String(targetSupervisor)
      );
    });
  }, [selectedIds, targetSupervisor, allStudents]);

  const targetSupervisorData = useMemo(() => {
    return supervisorMap[Number(targetSupervisor)];
  }, [targetSupervisor, supervisorMap]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  const toggleAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s: any) => s.id));
    }
  };

  const toggleStudent = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  if (supLoading || stuLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          <p className="text-sm text-slate-500">
            Loading students and supervisors...
          </p>
        </div>
      </div>
    );
  }

  if (isSupError || isStuError) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex flex-col items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="font-bold text-red-900">Error loading data</p>
          <p className="text-sm text-red-700">{String(supError || stuError)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-150 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
      {/* HEADER */}
      <BulkAssignHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        supervisors={supervisors}
        targetSupervisor={targetSupervisor}
        onTargetSupervisorChange={setTargetSupervisor}
        selectedCount={selectedIds.length}
        studentsToUpdateCount={studentsToUpdate.length}
        targetSupervisorData={targetSupervisorData}
        onClear={() => {
          setSelectedIds([]);
          setTargetSupervisor("");
        }}
        onBulkAssign={handleBulkAssign}
        isAssigning={bulkAssignData.isPending}
      />

      {/* LIST */}
      <BulkAssignList
        filteredStudents={filteredStudents}
        selectedIds={selectedIds}
        onToggleStudent={toggleStudent}
        onToggleAll={toggleAll}
        supervisorMap={supervisorMap}
        targetSupervisor={targetSupervisor}
        targetSupervisorData={targetSupervisorData}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        isLoading={stuLoading}
      />

      {/* MOBILE ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-16px)] md:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-2xl flex items-center justify-between gap-2 border border-white/10">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                {selectedIds.length} selected
              </span>
              <span className="text-[10px] text-slate-300 font-medium truncate">
                {!targetSupervisor
                  ? "Choose supervisor"
                  : studentsToUpdate.length === 0
                    ? "No changes"
                    : `${studentsToUpdate.length} to update`}
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold active:scale-95 transition-all disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-500 shrink-0"
            >
              {bulkAssignData.isPending ? "..." : "OK"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
