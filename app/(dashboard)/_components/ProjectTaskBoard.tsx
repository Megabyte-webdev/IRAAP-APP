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
  CheckCircle2,
  ArrowRight,
  Play,
} from "lucide-react";
import TaskCard from "./TaskCard";
import NewReviewModal from "./NewReviewModal";
import useSupervisor from "@/app/_hooks/use-supervisor";
import { ConfirmationModal } from "./ConfirmationModal";
import { useAuth } from "@/app/_context/AuthContext";
import { ReviewTask, Task } from "@/app/_utils/types";
import { useProject } from "@/app/_hooks/use-projects";
import SubmitRevisionModal from "@/app/modals/SubmitRevisionModal";
import useStudent from "@/app/_hooks/use-student";

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
  const { deleteReview, verifyReviewRound } = useSupervisor();
  const { authDetails } = useAuth();
  const { submitRevisionForReview } = useProject();
  const { updateAllReviewTasksByStudent } = useStudent();
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

  // Tracks which specific review round row is currently mutating state asynchronously
  const [mutatingReviewId, setMutatingReviewId] = useState<
    string | number | null
  >(null);

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

  const handleAdvanceAllTasksInRound = (
    reviewId: string | number,
    currentStatus: TaskStatus,
  ) => {
    const currentIndex = columns.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === columns.length - 1) return;

    const nextStatus = columns[currentIndex + 1];
    setMutatingReviewId(reviewId);

    updateAllReviewTasksByStudent.mutate(
      {
        reviewId: Number(reviewId),
        projectId,
        status: nextStatus,
      },
      {
        onSettled: () => setMutatingReviewId(null),
      },
    );
  };

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

  const isRoundFullyCompleted = (reviewId: string | number) => {
    const roundTasks = tasks.filter(
      (t) => String(t.reviewId ?? "General") === String(reviewId),
    );
    return (
      roundTasks.length > 0 && roundTasks.every((t) => t.status === "COMPLETED")
    );
  };

  const isRoundFullyVerified = (reviewId: string | number) => {
    const roundTasks = tasks.filter(
      (t) => String(t.reviewId ?? "General") === String(reviewId),
    );
    return (
      roundTasks.length > 0 && roundTasks.every((t) => t.status === "VERIFIED")
    );
  };

  const submittedMap = useMemo(() => {
    return new Set(
      reviews?.filter((r: any) => r.revisionSubmitted).map((r: any) => r.id),
    );
  }, [reviews]);

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

  const handleVerifyVersion = (reviewId: number) => {
    setMutatingReviewId(reviewId);
    verifyReviewRound.mutate(
      { reviewId, projectId },
      {
        onSettled: () => setMutatingReviewId(null),
        onSuccess: () => console.log("Review round verified successfully."),
      },
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center w-full">
        <Loader2
          className="animate-spin text-indigo-400 dark:text-indigo-500"
          size={24}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-20 max-w-5xl mx-auto">
      {/* BOARD HEADER */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Task Board
        </h2>
        {isSupervisor && (
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 dark:bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 dark:hover:bg-indigo-700 transition-colors"
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
            className="bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm dark:shadow-slate-900/20 overflow-hidden"
          >
            {/* COLUMN HEADER */}
            <div className="flex items-center bg-white dark:bg-slate-800 pr-4">
              <button
                onClick={() => setCollapsed((p) => ({ ...p, [col]: !p[col] }))}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex-1 text-left transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight
                    size={16}
                    className="text-slate-400 dark:text-slate-500"
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    className="text-slate-400 dark:text-slate-500"
                  />
                )}
                <h3 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {col.replace("_", " ")}
                </h3>
              </button>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/40 px-2 py-0.5 rounded-full">
                <Hash size={10} /> {totalInCol}
              </div>
            </div>

            {/* COLUMN BODY */}
            {!isCollapsed && (
              <div className="p-3 bg-[#F8FAFC]/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-700/50 space-y-4">
                {Object.keys(columnData).map((reviewId) => {
                  const round = columnData[reviewId];
                  const hasTasks = round.items.length > 0;
                  const fullyCompleted = isRoundFullyCompleted(reviewId);
                  const fullyVerified = isRoundFullyVerified(reviewId);
                  const isSubmitted = submittedMap.has(Number(reviewId));
                  const hasSubmissions = round.submissions?.length > 0;
                  const isHistoryOpen = expandedHistory.has(reviewId);

                  const dynamicRoundTasks = tasks.filter(
                    (t) => String(t.reviewId ?? "General") === String(reviewId),
                  );
                  const roundHasAnyTasksTotal = dynamicRoundTasks.length > 0;

                  // Banner Condition Rules
                  const showStartRoundBanner =
                    isStudent && col === "PENDING" && hasTasks;
                  const showCompleteRoundBanner =
                    isStudent && col === "IN_PROGRESS" && hasTasks;

                  const showStudentSubmitBanner =
                    col === "COMPLETED" &&
                    isStudent &&
                    fullyCompleted &&
                    reviewId !== "General" &&
                    !isSubmitted;

                  const showSupervisorActionBanner =
                    col === "COMPLETED" &&
                    isSupervisor &&
                    reviewId !== "General" &&
                    isSubmitted &&
                    !fullyVerified;

                  const showStudentPendingBanner =
                    col === "COMPLETED" &&
                    isStudent &&
                    reviewId !== "General" &&
                    isSubmitted &&
                    !fullyVerified;

                  const shouldShow =
                    hasTasks ||
                    (!roundHasAnyTasksTotal && col === "PENDING") ||
                    (col === "COMPLETED" &&
                      reviewId !== "General" &&
                      (showStudentSubmitBanner ||
                        showSupervisorActionBanner ||
                        showStudentPendingBanner));

                  if (!shouldShow) return null;

                  // Evaluate row mutation locks
                  const isThisRowMutating =
                    String(mutatingReviewId) === String(reviewId);
                  const isBatchUpdating =
                    isThisRowMutating &&
                    updateAllReviewTasksByStudent.isPending;
                  const isRoundVerifying =
                    isThisRowMutating && verifyReviewRound.isPending;

                  return (
                    <div key={reviewId}>
                      <div
                        className={`
                          rounded-xl border overflow-hidden transition-all duration-200
                          ${
                            fullyVerified
                              ? "border-indigo-100 dark:border-indigo-900/40 bg-slate-50/20 dark:bg-indigo-900/10"
                              : fullyCompleted && !isSubmitted
                                ? "border-emerald-200 dark:border-emerald-900/40 shadow-sm shadow-emerald-100 dark:shadow-emerald-900/20"
                                : isSubmitted
                                  ? "border-amber-200 dark:border-amber-900/40 shadow-sm shadow-amber-100 dark:shadow-amber-900/20"
                                  : "border-slate-200 dark:border-slate-700/50"
                          }
                        `}
                      >
                        {/* ROUND HEADER */}
                        <div
                          className={`
                            flex items-center justify-between px-4 py-2.5 border-b
                            ${
                              fullyVerified
                                ? "bg-slate-50 dark:bg-indigo-900/15 border-slate-100 dark:border-indigo-900/30"
                                : fullyCompleted && !isSubmitted
                                  ? "bg-emerald-50 dark:bg-emerald-900/15 border-emerald-100 dark:border-emerald-900/30"
                                  : isSubmitted
                                    ? "bg-amber-50 dark:bg-amber-900/15 border-amber-100 dark:border-amber-900/30"
                                    : "bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700/50"
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                fullyVerified
                                  ? "bg-indigo-500 dark:bg-indigo-400"
                                  : isSubmitted
                                    ? "bg-amber-400 dark:bg-amber-400"
                                    : fullyCompleted
                                      ? "bg-emerald-400 dark:bg-emerald-400"
                                      : "bg-slate-300 dark:bg-slate-500"
                              }`}
                            />
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                              {round.summary}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                              · {round.items.length} task
                              {round.items.length !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {reviewId !== "General" && hasSubmissions && (
                              <button
                                onClick={() => toggleHistory(reviewId)}
                                className={`
                                  flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors
                                  ${
                                    isHistoryOpen
                                      ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300"
                                      : "bg-slate-100 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60"
                                  }
                                `}
                              >
                                <History size={10} />
                                {round.submissions.length} version
                                {round.submissions.length !== 1 ? "s" : ""}
                              </button>
                            )}

                            {reviewId !== "General" && (
                              <span
                                className={`
                                  text-[10px] font-semibold px-2 py-0.5 rounded-full
                                  ${
                                    fullyVerified
                                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100/80 dark:border-indigo-800/50"
                                      : isSubmitted
                                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                        : fullyCompleted
                                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                          : "bg-slate-100 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400"
                                  }
                                `}
                              >
                                {fullyVerified
                                  ? "Verified & Approved"
                                  : isSubmitted
                                    ? isSupervisor
                                      ? "Awaiting Action"
                                      : "Pending Review"
                                    : fullyCompleted
                                      ? isStudent
                                        ? "Ready to Submit"
                                        : "Awaiting Submission"
                                      : "In Progress"}
                              </span>
                            )}

                            {isSupervisor &&
                              reviewId !== "General" &&
                              !fullyVerified && (
                                <button
                                  onClick={() =>
                                    setConfirmDeleteReview({
                                      id: Number(round.id),
                                      summary: round.summary,
                                    })
                                  }
                                  className="p-1 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                  title="Delete revision round"
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                          </div>
                        </div>

                        {/* TASKS BODY */}
                        <div className="p-3 bg-white dark:bg-slate-800">
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
                            <div className="py-6 flex items-center justify-center text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                              No tasks in this stage
                            </div>
                          )}
                        </div>

                        {/* GLOBAL ACTIONS WRAPPER BANNER */}
                        {showStartRoundBanner && (
                          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700/50">
                            <div>
                              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                Round Pending Execution
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                Move all tasks in this round to In Progress
                                status.
                              </p>
                            </div>
                            <button
                              disabled={isBatchUpdating}
                              onClick={() =>
                                handleAdvanceAllTasksInRound(reviewId, col)
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap ml-4 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                              {isBatchUpdating ? (
                                <Loader2 size={11} className="animate-spin" />
                              ) : (
                                <Play size={11} fill="currentColor" />
                              )}
                              Start Round Tasks
                            </button>
                          </div>
                        )}

                        {showCompleteRoundBanner && (
                          <div className="flex items-center justify-between px-4 py-3 bg-indigo-50/40 dark:bg-indigo-900/10 border-t border-slate-100 dark:border-slate-700/50">
                            <div>
                              <p className="text-[11px] font-bold text-indigo-950 dark:text-indigo-300">
                                Batch Transition Check
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                Advance all currently remaining tasks into the
                                Completed container.
                              </p>
                            </div>
                            <button
                              disabled={isBatchUpdating}
                              onClick={() =>
                                handleAdvanceAllTasksInRound(reviewId, col)
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors whitespace-nowrap ml-4 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                              {isBatchUpdating ? (
                                <Loader2 size={11} className="animate-spin" />
                              ) : (
                                <>
                                  Mark All Completed
                                  <ArrowRight size={11} />
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {reviewId !== "General" && (
                          <>
                            {showStudentSubmitBanner && (
                              <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-900/15 border-t border-emerald-100 dark:border-emerald-900/30">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                                    <svg
                                      className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
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
                                    <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                                      All tasks completed
                                    </p>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                      Submit your revision for supervisor review
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setSubmitTarget({
                                      reviewId: Number(round.id),
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

                            {showSupervisorActionBanner && (
                              <div className="flex items-center justify-between px-4 py-3 bg-indigo-50/70 dark:bg-indigo-900/15 border-t border-indigo-100 dark:border-indigo-900/30">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300">
                                      Revision Version Awaiting Action
                                    </p>
                                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400">
                                      Review the uploaded version update and
                                      verify this round.
                                    </p>
                                  </div>
                                </div>
                                <button
                                  disabled={isRoundVerifying}
                                  onClick={() =>
                                    handleVerifyVersion(Number(reviewId))
                                  }
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap ml-4 disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                  {isRoundVerifying && (
                                    <Loader2
                                      size={11}
                                      className="animate-spin"
                                    />
                                  )}
                                  Verify & Approve Round
                                </button>
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
      {isReviewModalOpen && (
        <NewReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          projectId={projectId}
        />
      )}

      {confirmDeleteReview && (
        <ConfirmationModal
          isOpen={!!confirmDeleteReview}
          onClose={() => setConfirmDeleteReview(null)}
          onConfirm={handleDeleteReview}
          title="Delete Revision Round"
          description={`Are you sure you want to delete "${confirmDeleteReview.summary}"? All tasks attached will be lost permanently.`}
          isLoading={deleteReview.isPending}
        />
      )}

      {submitTarget && (
        <SubmitRevisionModal
          isOpen={!!submitTarget}
          onClose={() => setSubmitTarget(null)}
          onSubmit={handleSubmitRevision}
          reviewSummary={submitTarget.summary}
          isLoading={submitRevisionForReview.isPending}
        />
      )}
    </div>
  );
}
