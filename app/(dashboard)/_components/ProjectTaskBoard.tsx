"use client";

import { useState, useMemo } from "react";
import {
  Loader2,
  ChevronDown,
  ChevronRight,
  Hash,
  Plus,
  Trash2,
} from "lucide-react";
import TaskCard from "./TaskCard";
import NewReviewModal from "./NewReviewModal";
import useSupervisor from "@/app/_hooks/use-supervisor";
import { ConfirmationModal } from "./ConfirmationModal";
import { useAuth } from "@/app/_context/AuthContext";

const columns = ["PENDING", "IN_PROGRESS", "COMPLETED", "VERIFIED"];

const ProjectTaskBoard = ({ tasks, loading, projectId, reviews }: any) => {
  const { deleteReview } = useSupervisor();
  const { authDetails } = useAuth();
  const isSupervisor = authDetails?.user?.role === "SUPERVISOR";

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [confirmDeleteReview, setConfirmDeleteReview] = useState<{
    id: number;
    summary: string;
  } | null>(null);

  const groupedTasks = useMemo(() => {
    const groups: any = {};

    columns.forEach((col) => {
      groups[col] = {};

      groups[col]["General"] = {
        id: "General",
        summary: "General Tasks",
        items: [],
      };

      reviews?.forEach((r: any) => {
        groups[col][r.id] = {
          id: r.id,
          summary: r.summary,
          items: [],
        };
      });
    });

    tasks.forEach((task: any) => {
      const col = task.status;
      const reviewId = task.reviewId || "General";
      if (groups[col] && groups[col][reviewId]) {
        groups[col][reviewId].items.push(task);
      }
    });

    return groups;
  }, [tasks, reviews]);

  const handleDeleteReview = () => {
    if (!confirmDeleteReview) return;
    deleteReview.mutate(
      { reviewId: confirmDeleteReview.id, projectId },
      {
        onSuccess: () => {
          setConfirmDeleteReview(null);
        },
      },
    );
  };

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center w-full">
        <Loader2 className="animate-spin text-indigo-400" size={24} />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 pb-20 max-w-5xl mx-auto">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-sm font-bold text-slate-800">Task Board</h2>
        {isSupervisor && (
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-all shadow-md"
          >
            <Plus size={14} />
            New Revision Round
          </button>
        )}
      </div>

      {columns.map((col) => {
        const columnData = groupedTasks[col] || {};
        const isCollapsed = collapsed[col];
        const totalInCol = tasks.filter((t: any) => t.status === col).length;

        return (
          <div
            key={col}
            className="bg-white/50 rounded-xl border border-slate-200/60 shadow-sm overflow-hidden"
          >
            <div className="flex items-center bg-white pr-4">
              <button
                onClick={() => setCollapsed((p) => ({ ...p, [col]: !p[col] }))}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 flex-1 text-left"
              >
                {isCollapsed ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
                <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                  {col.replace("_", " ")}
                </h3>
              </button>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                <Hash size={10} /> {totalInCol}
              </div>
            </div>

            {!isCollapsed && (
              <div className="p-3 bg-[#F8FAFC]/50 border-t border-slate-100 space-y-8">
                {Object.keys(columnData).map((reviewId) => {
                  const round = columnData[reviewId];
                  const hasTasksInThisCol = round.items.length > 0;

                  // FIX: Check if this review round has tasks in ANY column on the board
                  const hasTasksAnywhere = tasks.some(
                    (t: any) =>
                      String(t.reviewId || "General") === String(reviewId),
                  );

                  // LOGIC:
                  // 1. Show if there are tasks currently in this column.
                  // 2. OR Show if we are in PENDING and the round is brand new (0 tasks globally).
                  const shouldShow =
                    hasTasksInThisCol ||
                    (col === "PENDING" && !hasTasksAnywhere);

                  if (reviewId === "General" && !hasTasksInThisCol) return null;
                  if (!shouldShow) return null;

                  return (
                    <div key={reviewId} className="space-y-4">
                      <div className="flex items-center gap-3 px-1">
                        <div className="h-px flex-1 bg-slate-200" />
                        <div className="flex items-center gap-2 group">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Review: {round.summary}
                          </span>
                          {isSupervisor && reviewId !== "General" && (
                            <button
                              onClick={() =>
                                setConfirmDeleteReview({
                                  id: Number(reviewId),
                                  summary: round.summary,
                                })
                              }
                              className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>

                      {hasTasksInThisCol ? (
                        <div className="grid grid-cols-responsive gap-3">
                          {round.items.map((task: any) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              projectId={projectId}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center bg-slate-50/30">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            No tasks in this stage
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <NewReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        projectId={projectId}
      />

      <ConfirmationModal
        isOpen={!!confirmDeleteReview}
        title="Delete Revision Round?"
        message={`This will permanently delete the review "${confirmDeleteReview?.summary}" and ALL tasks associated with it.`}
        onConfirm={handleDeleteReview}
        onCancel={() => setConfirmDeleteReview(null)}
        isLoading={deleteReview.isPending}
      />
    </div>
  );
};

export default ProjectTaskBoard;
