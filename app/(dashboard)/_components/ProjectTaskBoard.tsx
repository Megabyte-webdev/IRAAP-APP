"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  ChevronDown,
  ChevronRight,
  Hash,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import TaskCard from "./TaskCard";
import NewReviewModal from "./NewReviewModal";
import useSupervisor from "@/app/_hooks/use-supervisor";
import { ConfirmationModal } from "./ConfirmationModal";
import { useAuth } from "@/app/_context/AuthContext";
import { ReviewTask, Task } from "@/app/_utils/types";
import { useProject } from "@/app/_hooks/use-projects";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED";

type Props = {
  tasks: ReviewTask[];
  loading: boolean;
  projectId: number;
  reviews: ReviewTask[];
  activeTaskId?: string | null;
};

const columns: TaskStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "VERIFIED",
];

// Small inline modal for file + change note
function SubmitRevisionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, changeNote: string) => void;
  isLoading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [changeNote, setChangeNote] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-sm font-bold text-slate-800">
          Submit Revision for Review
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">
            Revised File
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">
            Change Note (optional)
          </label>
          <textarea
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            rows={3}
            placeholder="Describe what you changed..."
            className="w-full text-xs rounded-lg border border-slate-200 p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={!file || isLoading}
            onClick={() => file && onSubmit(file, changeNote)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Upload size={12} />
            )}
            Submit Revision
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectTaskBoard({
  tasks,
  loading,
  projectId,
  reviews,
  activeTaskId,
}: Props) {
  const { deleteReview } = useSupervisor();
  const { authDetails } = useAuth();
  const { submitRevisionForReview } = useProject();
  const isSupervisor = authDetails?.user?.role === "SUPERVISOR";
  const isStudent = authDetails?.user?.role === "STUDENT";

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(columns.map((col) => [col, true])),
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [confirmDeleteReview, setConfirmDeleteReview] = useState<{
    id: number;
    summary: string;
  } | null>(null);

  // Track which review round is pending submission
  const [submitTarget, setSubmitTarget] = useState<{
    reviewId: number;
    summary: string;
  } | null>(null);

  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isActiveTask = (taskId: number | string) =>
    String(taskId) === String(activeTaskId);

  // --- all your existing scroll/expand useEffects unchanged ---
  useEffect(() => {
    if (!activeTaskId) return;
    const el = taskRefs.current[activeTaskId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeTaskId]);

  useEffect(() => {
    if (!activeTaskId) return;
    const task = tasks.find((t) => t.id === Number(activeTaskId));
    if (!task) return;
    setCollapsed((prev) => ({ ...prev, [task.status]: false }));
  }, [activeTaskId, tasks]);

  useEffect(() => {
    if (!activeTaskId) return;
    const el = taskRefs.current[activeTaskId];
    if (!el) return;
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTaskId, collapsed]);

  // Helper: are ALL tasks in this review round completed?
  const isRoundFullyCompleted = (reviewId: string | number) => {
    const roundTasks = tasks.filter(
      (t) => String(t.reviewId ?? "General") === String(reviewId),
    );
    return (
      roundTasks.length > 0 && roundTasks.every((t) => t.status === "COMPLETED")
    );
  };

  const groupedTasks = useMemo(() => {
    const groups: Record<string, any> = {};

    columns.forEach((col) => {
      groups[col] = {};
      groups[col]["General"] = {
        id: "General",
        summary: "General Tasks",
        items: [],
      };
      reviews?.forEach((r: any) => {
        groups[col][r.id] = { id: r.id, summary: r.summary, items: [] };
      });
    });

    tasks.forEach((task) => {
      const col = task.status;
      const reviewId = task.reviewId || "General";
      if (groups[col]?.[reviewId]) groups[col][reviewId].items.push(task);
    });

    return groups;
  }, [tasks, reviews]);

  const handleDeleteReview = () => {
    if (!confirmDeleteReview) return;
    deleteReview.mutate(
      { reviewId: confirmDeleteReview.id, projectId },
      { onSuccess: () => setConfirmDeleteReview(null) },
    );
  };

  const handleSubmitRevision = (file: File, changeNote: string) => {
    if (!submitTarget) return;
    submitRevisionForReview.mutate(
      { reviewId: submitTarget.reviewId, file, changeNote },
      { onSuccess: () => setSubmitTarget(null) },
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center w-full">
        <Loader2 className="animate-spin text-indigo-400" size={24} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-20 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-sm font-bold text-slate-800">Task Board</h2>
        {isSupervisor && (
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
          >
            <Plus size={14} />
            New Revision Round
          </button>
        )}
      </div>

      {/* COLUMNS */}
      {columns.map((col) => {
        const columnData = groupedTasks[col] || {};
        const isCollapsed = collapsed[col];
        const totalInCol = tasks.filter((t) => t.status === col).length;

        return (
          <div
            key={col}
            className="bg-white/50 rounded-xl border border-slate-200/60 shadow-sm overflow-hidden"
          >
            {/* COLUMN HEADER */}
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
                <h3 className="text-[11px] font-bold text-slate-700 uppercase">
                  {col.replace("_", " ")}
                </h3>
              </button>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                <Hash size={10} /> {totalInCol}
              </div>
            </div>

            {/* COLUMN BODY */}
            {!isCollapsed && (
              <div className="p-3 bg-[#F8FAFC]/50 border-t border-slate-100 space-y-8">
                {Object.keys(columnData).map((reviewId) => {
                  const round = columnData[reviewId];
                  const hasTasks = round.items.length > 0;
                  const fullyCompleted = isRoundFullyCompleted(reviewId);

                  // Show "Submit for Review" banner only in COMPLETED column
                  // and only for students when the round is fully done
                  const showSubmitBanner =
                    col === "COMPLETED" &&
                    isStudent &&
                    fullyCompleted &&
                    reviewId !== "General";

                  const shouldShow =
                    hasTasks ||
                    (col === "PENDING" &&
                      !tasks.some(
                        (t) => String(t.reviewId) === String(reviewId),
                      ));

                  if (!shouldShow) return null;

                  return (
                    <div key={reviewId} className="space-y-4">
                      {/* REVIEW ROUND HEADER */}
                      <div className="flex items-center gap-3 px-1">
                        <div className="h-px flex-1 bg-slate-200" />

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                            {round.summary}
                          </span>

                          {/* Delete button — supervisors only, not for General */}
                          {isSupervisor && reviewId !== "General" && (
                            <button
                              onClick={() =>
                                setConfirmDeleteReview({
                                  id: round.id,
                                  summary: round.summary,
                                })
                              }
                              className="p-0.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Delete revision round"
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>

                        <div className="h-px flex-1 bg-slate-200" />
                      </div>

                      {/* TASKS */}
                      {hasTasks ? (
                        <div className="grid grid-cols-responsive gap-3">
                          {round.items.map((task: Task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              projectId={projectId}
                              active={isActiveTask(task.id)}
                              setRef={(el: HTMLDivElement | null) => {
                                taskRefs.current[task.id] = el;
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                          No tasks in this stage
                        </div>
                      )}

                      {/* ✅ SUBMIT FOR REVIEW BANNER */}
                      {showSubmitBanner && (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                          <div>
                            <p className="text-xs font-bold text-emerald-800">
                              All tasks completed!
                            </p>
                            <p className="text-[11px] text-emerald-600 mt-0.5">
                              You can now submit this revision round for
                              supervisor review.
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setSubmitTarget({
                                reviewId: round.id,
                                summary: round.summary,
                              })
                            }
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 whitespace-nowrap ml-4"
                          >
                            <Upload size={12} />
                            Submit for Review
                          </button>
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

      {/* MODALS */}
      <NewReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        projectId={projectId}
      />

      <ConfirmationModal
        isOpen={!!confirmDeleteReview}
        title="Delete Revision Round?"
        message={`This will permanently delete "${confirmDeleteReview?.summary}"`}
        onConfirm={handleDeleteReview}
        onCancel={() => setConfirmDeleteReview(null)}
        isLoading={deleteReview.isPending}
      />

      {/* SUBMIT REVISION MODAL */}
      <SubmitRevisionModal
        isOpen={!!submitTarget}
        onClose={() => setSubmitTarget(null)}
        onSubmit={handleSubmitRevision}
        isLoading={submitRevisionForReview.isPending}
      />
    </div>
  );
}
