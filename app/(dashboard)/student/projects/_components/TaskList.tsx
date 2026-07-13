"use client";

import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import TaskItem from "./TaskItem";

const getChapterStateMini = (chapterTasks: any[], review: any) => {
  if (chapterTasks.every((t: any) => t.status === "VERIFIED"))
    return {
      label: "Verified",
      style:
        "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/40",
    };

  if (
    review?.revisionSubmitted &&
    chapterTasks.every(
      (t: any) => t.status === "COMPLETED" || t.status === "VERIFIED",
    )
  )
    return {
      label: "Awaiting Review",
      style:
        "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40",
    };

  if (chapterTasks.every((t: any) => t.status === "COMPLETED"))
    return {
      label: "Ready to Submit",
      style:
        "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40",
    };

  if (chapterTasks.some((t: any) => t.status === "IN_PROGRESS"))
    return {
      label: "In Progress",
      style:
        "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
    };

  return {
    label: "Needs Attention",
    style: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40",
  };
};

const TaskList = ({
  currentProject,
  mostUrgent,
  firstUnfinishedTask,
  chapters,
}: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  const toggleChapter = (chapter: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapter]: !(prev[chapter] ?? false),
    }));
  };

  const urgentChapterName = mostUrgent?.[0];
  const urgentData = mostUrgent?.[1];
  const urgentTasks = urgentData?.tasks ?? [];
  const urgentReview = urgentData?.review ?? null;
  const urgentState = urgentTasks.length
    ? getChapterStateMini(urgentTasks, urgentReview)
    : null;

  const isUrgentActuallyUrgent =
    urgentState?.label === "Needs Attention" ||
    urgentState?.label === "In Progress";

  return (
    <div className="col-span-12 md:col-span-5">
      <div className="md:sticky md:top-8 flex flex-col h-[calc(100dvh-100px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm py-4">
        {/* HEADER */}
        <div className="relative flex flex-wrap gap-2 items-center justify-between mb-4 pr-7 mx-4">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className="text-red-500 dark:text-red-400"
              size={16}
            />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Priority Tasks
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/student/projects/${currentProject.id}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Open Project →
            </Link>

            <button
              onClick={() => setCollapsed((v) => !v)}
              className="absolute right-0 top-0 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400"
            >
              {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* HIGHEST PRIORITY CARD */}
        <div
          className={`mb-4 p-4 rounded-xl space-y-2 mx-4 border ${
            isUrgentActuallyUrgent
              ? "bg-red-500/10 border-red-200 dark:border-red-900/50"
              : urgentState?.label === "Awaiting Review"
                ? "bg-amber-500/10 border-amber-200 dark:border-amber-900/50"
                : urgentState?.label === "Verified" ||
                    urgentState?.label === "Ready to Submit"
                  ? "bg-green-500/10 border-green-200 dark:border-green-900/50"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
          }`}
        >
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${
              isUrgentActuallyUrgent
                ? "text-red-600 dark:text-red-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {isUrgentActuallyUrgent ? "Highest Priority" : "Current Focus"}
          </p>

          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {urgentChapterName || "No urgent tasks"}
          </p>

          {/* Show real state badge */}
          {urgentState && (
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${urgentState.style}`}
            >
              {urgentState.label}
            </span>
          )}

          {/* Take Action Button */}
          {isUrgentActuallyUrgent && (
            <div className="pt-1">
              <Link
                href={`/student/projects/${currentProject.id}${
                  firstUnfinishedTask ? `?task=${firstUnfinishedTask.id}` : ""
                }`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 px-3 py-2 rounded-lg transition-colors"
              >
                Take Action <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Awaiting review */}
          {urgentState?.label === "Awaiting Review" && (
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5 pt-1">
              <Clock size={11} />
              Waiting for supervisor feedback
            </p>
          )}

          {/* Ready to submit */}
          {urgentState?.label === "Ready to Submit" && (
            <Link
              href={`/student/projects/${currentProject.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 px-3 py-2 rounded-lg transition-colors"
            >
              <Send size={12} />
              Submit for Review
            </Link>
          )}

          {/* Verified */}
          {urgentState?.label === "Verified" && (
            <p className="text-[11px] text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5 pt-1">
              <CheckCircle2 size={11} />
              All rounds verified
            </p>
          )}
        </div>

        {/* CHAPTER LIST */}
        {!collapsed && (
          <div className="space-y-3 overflow-y-auto px-4 pb-2">
            {chapters.map(([chapter, { tasks: chapterTasks, review }]: any) => {
              const isOpen = openChapters[chapter] ?? false;
              const state = getChapterStateMini(chapterTasks, review);

              return (
                <div
                  key={chapter}
                  className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
                >
                  {/* Chapter header */}
                  <button
                    onClick={() => toggleChapter(chapter)}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate text-left">
                        {chapter}
                      </p>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${state.style}`}
                      >
                        {state.label}
                      </span>
                    </div>

                    <ChevronDown
                      size={13}
                      className={`text-slate-400 dark:text-slate-500 shrink-0 ml-2 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Tasks */}
                  {isOpen && (
                    <div className="px-3 pb-3 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-2 bg-slate-50/50 dark:bg-slate-900/50">
                      {chapterTasks.map((task: any) => (
                        <TaskItem
                          key={task.id}
                          text={task.title}
                          completed={task.status === "VERIFIED"}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
