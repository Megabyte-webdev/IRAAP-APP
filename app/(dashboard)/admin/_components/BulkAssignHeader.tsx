import { Search, UserPlus } from "lucide-react";
import SupervisorDropdown from "./SupervisorDropdown";
import { JSX } from "react";

interface BulkAssignHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  supervisors: Array<{ id: number; name: string; studentCount: number }>;
  targetSupervisor: string;
  onTargetSupervisorChange: (value: string) => void;
  selectedCount: number;
  studentsToUpdateCount: number;
  targetSupervisorData?: { id: number; name: string };
  onClear: () => void;
  onBulkAssign: () => void;
  isAssigning: boolean;
  isLoadingSupervisors?: boolean;
  hasMoreSupervisors?: boolean;
  onLoadMoreSupervisors?: () => void;
}

export default function BulkAssignHeader({
  searchTerm,
  onSearchChange,
  supervisors,
  targetSupervisor,
  onTargetSupervisorChange,
  selectedCount,
  studentsToUpdateCount,
  targetSupervisorData,
  onClear,
  onBulkAssign,
  isAssigning,
  isLoadingSupervisors = false,
  hasMoreSupervisors = false,
  onLoadMoreSupervisors,
}: BulkAssignHeaderProps): JSX.Element {
  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-3 lg:p-6">
      <div className="flex flex-col gap-2 lg:gap-4">
        {/* Search and Supervisor Selection */}
        <div className="flex flex-col md:flex-row gap-2 lg:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 md:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Supervisor Dropdown */}
          <SupervisorDropdown
            supervisors={supervisors}
            selectedId={targetSupervisor}
            onSelect={onTargetSupervisorChange}
          />

          {/* Assign Button (Desktop) */}
          <button
            onClick={onBulkAssign}
            disabled={
              !targetSupervisor || studentsToUpdateCount === 0 || isAssigning
            }
            className="hidden md:flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isAssigning ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
            ) : (
              <UserPlus size={16} />
            )}
            {studentsToUpdateCount > 0
              ? `Update ${studentsToUpdateCount}`
              : "Assign"}
          </button>
        </div>

        {/* Selection Summary */}
        {selectedCount > 0 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 lg:gap-3 p-2 lg:p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs lg:text-sm font-semibold text-indigo-900">
                {selectedCount} {selectedCount === 1 ? "student" : "students"}{" "}
                selected
              </p>
              {targetSupervisor && (
                <p className="text-[11px] lg:text-xs text-indigo-700">
                  {studentsToUpdateCount === 0 ? (
                    <span className="font-medium">
                      All already assigned to {targetSupervisorData?.name}
                    </span>
                  ) : (
                    <span>
                      <span className="font-semibold text-indigo-900">
                        {studentsToUpdateCount}
                      </span>{" "}
                      to reassign
                    </span>
                  )}
                </p>
              )}
            </div>
            <button
              onClick={onClear}
              className="text-[11px] lg:text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
