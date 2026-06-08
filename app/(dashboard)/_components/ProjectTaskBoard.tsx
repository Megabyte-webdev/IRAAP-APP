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
  History,
  FileText,
} from "lucide-react";
import TaskCard from "./TaskCard";
import NewReviewModal from "./NewReviewModal";
import useSupervisor from "@/app/_hooks/use-supervisor";
import { ConfirmationModal } from "./ConfirmationModal";
import { useAuth } from "@/app/_context/AuthContext";
import { ReviewTask, Task } from "@/app/_utils/types";
import { useProject } from "@/app/_hooks/use-projects";
import SubmitRevisionModal from "@/app/modals/SubmitRevisionModal";

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
  const [submitTarget, setSubmitTarget] = useState<{
    reviewId: number;
    summary: string;
  } | null>(null);
  const [expandedHistory, setExpandedHistory] = useState<Set<string>>(
    new Set(),
  );

  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActiveTask = (taskId: number | string) =>
    String(taskId) === String(activeTaskId);

  const toggleHistory = (reviewId: string) => {
    setExpandedHistory((prev) => {
      const next = new Set(prev);
      next.has(reviewId) ? next.delete(reviewId) : next.add(reviewId);
      return next;
    });
  };

  // Scroll to active task
  useEffect(() => {
    if (!activeTaskId) return;
    const el = taskRefs.current[activeTaskId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeTaskId]);

  // Expand column containing active task
  useEffect(() => {
    if (!activeTaskId) return;
    const task = tasks.find((t) => t.id === Number(activeTaskId));
    if (!task) return;
    setCollapsed((prev) => ({ ...prev, [task.status]: false }));
  }, [activeTaskId, tasks]);

  // Scroll after column expands
  useEffect(() => {
    if (!activeTaskId) return;
    const el = taskRefs.current[activeTaskId];
    if (!el) return;
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTaskId, collapsed]);

  // Are ALL tasks in this review round completed?
  const isRoundFullyCompleted = (reviewId: string | number) => {
    const roundTasks = tasks.filter(
      (t) => String(t.reviewId ?? "General") === String(reviewId),
    );
    return (
      roundTasks.length > 0 && roundTasks.every((t) => t.status === "COMPLETED")
    );
  };

  // Set of review IDs that have been submitted
  const submittedMap = useMemo(() => {
    return new Set(
      reviews?.filter((r: any) => r.revisionSubmitted).map((r: any) => r.id),
    );
  }, [reviews]);

  // Group tasks by column and review round, also attach submissions
  const groupedTasks = useMemo(() => {
    const groups: Record<string, any> = {};

    columns.forEach((col) => {
      groups[col] = {};
      groups[col]["General"] = {
        id: "General",
        summary: "General Tasks",
        items: [],
        submissions: [],
      };
      reviews?.forEach((r: any) => {
        groups[col][r.id] = {
          id: r.id,
          summary: r.summary,
          items: [],
          // Build submissions array from the single revisionVersion for now
          submissions: r.revisionVersion ? [r.revisionVersion] : [],
        };
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
      {/* BOARD HEADER */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-sm font-bold text-slate-800">Task Board</h2>
        {isSupervisor && (
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
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
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 flex-1 text-left transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
                <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {col.replace("_", " ")}
                </h3>
              </button>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                <Hash size={10} /> {totalInCol}
              </div>
            </div>

            {/* COLUMN BODY */}
            {!isCollapsed && (
              <div className="p-3 bg-[#F8FAFC]/50 border-t border-slate-100 space-y-4">
                {Object.keys(columnData).map((reviewId) => {
                  const round = columnData[reviewId];
                  const hasTasks = round.items.length > 0;
                  const fullyCompleted = isRoundFullyCompleted(reviewId);
                  const isSubmitted = submittedMap.has(Number(reviewId));
                  const hasSubmissions = round.submissions?.length > 0;
                  const isHistoryOpen = expandedHistory.has(reviewId);

                  const showSubmitBanner =
                    col === "COMPLETED" &&
                    isStudent &&
                    fullyCompleted &&
                    reviewId !== "General" &&
                    !isSubmitted;

                  const isAwaitingVerification =
                    isSubmitted && col === "COMPLETED";

                  const shouldShow =
                    hasTasks ||
                    (col === "PENDING" &&
                      !tasks.some(
                        (t) => String(t.reviewId) === String(reviewId),
                      ));

                  if (!shouldShow) return null;

                  return (
                    <div key={reviewId}>
                      {/* ROUND CARD */}
                      <div
                        className={`
                          rounded-xl border overflow-hidden transition-all duration-200
                          ${
                            fullyCompleted && !isSubmitted
                              ? "border-emerald-200 shadow-sm shadow-emerald-100"
                              : isSubmitted
                                ? "border-amber-200 shadow-sm shadow-amber-100"
                                : "border-slate-200"
                          }
                        `}
                      >
                        {/* ROUND HEADER */}
                        <div
                          className={`
                            flex items-center justify-between px-4 py-2.5 border-b
                            ${
                              fullyCompleted && !isSubmitted
                                ? "bg-emerald-50 border-emerald-100"
                                : isSubmitted
                                  ? "bg-amber-50 border-amber-100"
                                  : "bg-slate-50 border-slate-100"
                            }
                          `}
                        >
                          {/* Left: dot + name + task count */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isSubmitted
                                  ? "bg-amber-400"
                                  : fullyCompleted
                                    ? "bg-emerald-400"
                                    : "bg-slate-300"
                              }`}
                            />
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                              {round.summary}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              · {round.items.length} task
                              {round.items.length !== 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* Right: history toggle + status pill + delete */}
                          <div className="flex items-center gap-2">
                            {/* Version history toggle */}
                            {reviewId !== "General" && hasSubmissions && (
                              <button
                                onClick={() => toggleHistory(reviewId)}
                                className={`
                                  flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors
                                  ${
                                    isHistoryOpen
                                      ? "bg-indigo-100 text-indigo-600"
                                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                  }
                                `}
                              >
                                <History size={10} />
                                {round.submissions.length} version
                                {round.submissions.length !== 1 ? "s" : ""}
                              </button>
                            )}

                            {/* Status pill */}
                            {reviewId !== "General" && (
                              <span
                                className={`
                                  text-[10px] font-semibold px-2 py-0.5 rounded-full
                                  ${
                                    isSubmitted
                                      ? "bg-amber-100 text-amber-700"
                                      : fullyCompleted
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-slate-100 text-slate-500"
                                  }
                                `}
                              >
                                {isSubmitted
                                  ? "Pending Review"
                                  : fullyCompleted
                                    ? "Ready to Submit"
                                    : "In Progress"}
                              </span>
                            )}

                            {/* Supervisor delete */}
                            {isSupervisor && reviewId !== "General" && (
                              <button
                                onClick={() =>
                                  setConfirmDeleteReview({
                                    id: round.id,
                                    summary: round.summary,
                                  })
                                }
                                className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="Delete revision round"
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* TASKS BODY */}
                        <div className="p-3 bg-white">
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
                            <div className="py-6 flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                              No tasks in this stage
                            </div>
                          )}
                        </div>

                        {/* VERSION HISTORY PANEL */}
                        {isHistoryOpen && hasSubmissions && (
                          <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                              Version History
                            </p>

                            {[...round.submissions]
                              .sort(
                                (a: any, b: any) =>
                                  b.versionNumber - a.versionNumber,
                              )
                              .map((sub: any) => (
                                <div
                                  key={sub.id}
                                  className="flex items-start gap-3 bg-white rounded-lg border border-slate-100 px-3 py-2.5"
                                >
                                  {/* Version badge */}
                                  <div className="mt-0.5 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                    <span className="text-[9px] font-bold text-indigo-500">
                                      v{sub.versionNumber}
                                    </span>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      {/* File link */}
                                      <a
                                        href={sub.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-semibold text-slate-700 hover:text-indigo-600 truncate flex items-center gap-1 transition-colors"
                                      >
                                        <FileText
                                          size={10}
                                          className="shrink-0"
                                        />
                                        {sub.publicId?.split("/").pop() ??
                                          `version-${sub.versionNumber}`}
                                      </a>

                                      {/* Timestamp */}
                                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                                        {new Date(
                                          sub.createdAt,
                                        ).toLocaleDateString("en-GB", {
                                          day: "numeric",
                                          month: "short",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>

                                    {/* Change note */}
                                    {sub.changeNote && (
                                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                                        {sub.changeNote}
                                      </p>
                                    )}

                                    {/* Trigger badge */}
                                    <span className="inline-block mt-1 text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                      {sub.trigger?.replace("_", " ") ??
                                        "Submission"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* ROUND FOOTER — student actions only */}
                        {isStudent && reviewId !== "General" && (
                          <>
                            {/* Ready to submit */}
                            {showSubmitBanner && (
                              <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border-t border-emerald-100">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <svg
                                      className="w-3.5 h-3.5 text-emerald-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2.5}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-bold text-emerald-800">
                                      All tasks completed
                                    </p>
                                    <p className="text-[10px] text-emerald-600">
                                      Submit your revision for supervisor review
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setSubmitTarget({
                                      reviewId: round.id,
                                      summary: round.summary,
                                    })
                                  }
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap ml-4"
                                >
                                  <Upload size={11} />
                                  Submit for Review
                                </button>
                              </div>
                            )}

                            {/* Awaiting verification */}
                            {isAwaitingVerification && (
                              <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-t border-amber-100">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                    <Loader2
                                      size={12}
                                      className="text-amber-500 animate-spin"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-bold text-amber-800">
                                      Awaiting supervisor review
                                    </p>
                                    <p className="text-[10px] text-amber-600">
                                      Your revision has been submitted
                                      successfully
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                                  Under Review
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
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

      <SubmitRevisionModal
        isOpen={!!submitTarget}
        onClose={() => setSubmitTarget(null)}
        onSubmit={handleSubmitRevision}
        isLoading={submitRevisionForReview.isPending}
      />
    </div>
  );
}
