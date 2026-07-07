import { useInView } from "react-intersection-observer";
import { ChevronDown, MoreHorizontal, ArrowRight, Users } from "lucide-react";
import { cn } from "@/app/_lib/utils";

interface BulkAssignListProps {
  filteredStudents: any[];
  selectedIds: number[];
  onToggleStudent: (id: number) => void;
  onToggleAll: () => void;
  supervisorMap: Record<number, any>;
  targetSupervisor: string;
  targetSupervisorData: any;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
}

export default function BulkAssignList({
  filteredStudents,
  selectedIds,
  onToggleStudent,
  onToggleAll,
  supervisorMap,
  targetSupervisor,
  targetSupervisorData,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  isLoading,
}: BulkAssignListProps) {
  const { ref: loadMoreRef } = useInView();

  const isAllSelected: boolean =
    selectedIds.length > 0 && selectedIds.length === filteredStudents.length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (id: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-emerald-500 to-emerald-600",
      "from-amber-500 to-amber-600",
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Desktop Header */}
      <div className="hidden lg:grid grid-cols-[48px_2.5fr_2fr_2fr_1.5fr] px-6 py-3 bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wide sticky top-0 z-10 gap-4">
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            checked={isAllSelected}
            onChange={onToggleAll}
          />
        </div>
        <div>Student</div>
        <div>Email</div>
        <div>Current Supervisor</div>
        <div>Status</div>
      </div>

      {/* Student Rows */}
      <div className="divide-y divide-slate-100">
        {filteredStudents.map((student: any) => {
          const isSelected: boolean = selectedIds.includes(student.id);
          const willUpdate: boolean =
            isSelected &&
            Boolean(targetSupervisor) &&
            String(student.supervisorId) !== String(targetSupervisor);
          const currentSupervisor = supervisorMap[student.supervisorId];

          return (
            <StudentRow
              key={student.id}
              student={student}
              isSelected={isSelected}
              willUpdate={willUpdate}
              currentSupervisor={currentSupervisor}
              targetSupervisor={targetSupervisor}
              targetSupervisorData={targetSupervisorData}
              onToggle={() => onToggleStudent(student.id)}
              getInitials={getInitials}
              getAvatarColor={getAvatarColor}
            />
          );
        })}

        {/* Load More */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            onClick={onLoadMore}
            className="flex items-center justify-center py-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
          >
            {isFetchingNextPage ? (
              <div className="animate-spin h-5 w-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full"></div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                <ChevronDown size={16} />
                Load more students
              </div>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 lg:py-24 text-center px-4">
          <div className="bg-slate-100 p-4 lg:p-6 rounded-full mb-3">
            <Users className="text-slate-400" size={32} />
          </div>
          <h3 className="text-slate-900 font-bold text-base lg:text-lg">
            No students found
          </h3>
          <p className="text-slate-500 text-xs lg:text-sm max-w-xs mx-auto mt-1">
            No students to assign
          </p>
        </div>
      )}
    </div>
  );
}

interface StudentRowProps {
  student: {
    id: number;
    fullName: string;
    email: string;
    supervisorId?: number;
  };
  isSelected: boolean;
  willUpdate: boolean;
  currentSupervisor?: any;
  targetSupervisor: string;
  targetSupervisorData?: any;
  onToggle: () => void;
  getInitials: (name: string) => string;
  getAvatarColor: (id: number) => string;
}

function StudentRow({
  student,
  isSelected,
  willUpdate,
  currentSupervisor,
  targetSupervisor,
  targetSupervisorData,
  onToggle,
  getInitials,
  getAvatarColor,
}: StudentRowProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "group cursor-pointer transition-all",
        willUpdate && "bg-amber-50/60",
        isSelected && !willUpdate && "bg-indigo-50/40",
        !isSelected && "hover:bg-slate-50/50",
      )}
    >
      {/* MOBILE LAYOUT */}
      <div className="lg:hidden p-2.5 space-y-1.5">
        {/* Header row with checkbox and name */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-indigo-600 mt-0.5 h-4 w-4 cursor-pointer shrink-0"
            checked={isSelected}
            readOnly
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "h-8 w-8 shrink-0 rounded-full bg-linear-to-br text-white flex items-center justify-center text-[10px] font-bold shadow-sm",
                  getAvatarColor(student.id),
                )}
              >
                {getInitials(student.fullName)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {student.fullName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {student.email}
                </p>
              </div>
            </div>
          </div>
          <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Current Supervisor - compact inline */}
        {student.supervisorId && (
          <div className="ml-6 flex items-center gap-1 text-[11px]">
            <span className="text-slate-500 font-medium">Supervisor:</span>
            <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600 shrink-0">
              {getInitials(currentSupervisor?.name || "?")}
            </div>
            <span className="text-slate-700 font-medium truncate">
              {currentSupervisor?.name}
            </span>
          </div>
        )}

        {/* Status */}
        <div className="ml-6 pt-1 border-t border-slate-100">
          {willUpdate ? (
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-600 font-medium">→</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                {targetSupervisorData?.name.split(" ")[0]}
              </span>
            </div>
          ) : student.supervisorId ? (
            <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
              Assigned
            </span>
          ) : (
            <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase bg-slate-100 text-slate-600 border border-slate-200">
              Unassigned
            </span>
          )}
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:grid grid-cols-[48px_2.5fr_2fr_2fr_1.5fr] items-center px-6 py-4 gap-4">
        {/* Checkbox */}
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            checked={isSelected}
            readOnly
          />
        </div>

        {/* Student Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "h-10 w-10 shrink-0 rounded-full bg-linear-to-br text-white flex items-center justify-center text-xs font-bold shadow-sm",
              getAvatarColor(student.id),
            )}
          >
            {getInitials(student.fullName)}
          </div>
          <span className="text-sm font-semibold text-slate-900 truncate">
            {student.fullName}
          </span>
        </div>

        {/* Email */}
        <div className="text-sm text-slate-600 truncate">{student.email}</div>

        {/* Current Supervisor */}
        <div className="min-w-0">
          {student.supervisorId ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                {getInitials(currentSupervisor?.name || "?")}
              </div>
              <span className="text-sm text-slate-700 font-medium truncate">
                {currentSupervisor?.name}
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-400 italic">
              Unassigned
            </span>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center justify-start">
          {willUpdate ? (
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                {currentSupervisor?.name.split(" ")[0]}
              </span>
              <ArrowRight size={14} className="text-amber-600" />
              <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 font-medium">
                {targetSupervisorData?.name.split(" ")[0]}
              </span>
            </div>
          ) : student.supervisorId ? (
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
              Assigned
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
              Unassigned
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
