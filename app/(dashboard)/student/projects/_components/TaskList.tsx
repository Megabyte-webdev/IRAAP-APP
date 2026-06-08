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
    return { label: "Verified", style: "text-green-600 bg-green-50" };

  if (
    review?.revisionSubmitted &&
    chapterTasks.every(
      (t: any) => t.status === "COMPLETED" || t.status === "VERIFIED",
    )
  )
    return { label: "Awaiting Review", style: "text-indigo-600 bg-indigo-50" };

  if (chapterTasks.every((t: any) => t.status === "COMPLETED"))
    return {
      label: "Ready to Submit",
      style: "text-emerald-600 bg-emerald-50",
    };

  if (chapterTasks.some((t: any) => t.status === "IN_PROGRESS"))
    return { label: "In Progress", style: "text-amber-600 bg-amber-50" };

  return { label: "Needs Attention", style: "text-red-600 bg-red-50" };
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

  // mostUrgent is now [chapter, { tasks, review }]
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
    <div className="col-span-12 lg:col-span-4">
      <div className="lg:sticky lg:top-8 flex flex-col h-[calc(100dvh-100px)] bg-white border rounded-2xl shadow-sm py-4">
        {/* HEADER */}
        <div className="relative flex flex-wrap gap-2 items-center justify-between mb-4 pr-7 mx-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={16} />
            <h3 className="font-bold text-sm">Priority Tasks</h3>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/student/projects/${currentProject.id}`}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Open Project →
            </Link>

            <button
              onClick={() => setCollapsed((v) => !v)}
              className="absolute right-0 top-0 p-1 rounded hover:bg-slate-100 transition"
            >
              {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* HIGHEST PRIORITY CARD — reflects real state */}
        <div
          className={`mb-4 p-4 rounded-xl space-y-2 mx-4 border ${
            isUrgentActuallyUrgent
              ? "bg-red-500 border-red-200"
              : urgentState?.label === "Awaiting Review"
                ? "bg-amber-400 border-amber-200"
                : urgentState?.label === "Verified" ||
                    urgentState?.label === "Ready to Submit"
                  ? "bg-green-500 border-green-200"
                  : "bg-slate-50 border-slate-200"
          }`}
        >
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${
              isUrgentActuallyUrgent ? "text-red-500" : "text-slate-400"
            }`}
          >
            {isUrgentActuallyUrgent ? "Highest Priority" : "Current Focus"}
          </p>

          <p className="text-sm font-semibold text-slate-800">
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

          {/* Only show Take Action if actually something to do */}
          {isUrgentActuallyUrgent && (
            <div className="pt-1">
              <Link
                href={`/student/projects/${currentProject.id}${
                  firstUnfinishedTask ? `?task=${firstUnfinishedTask.id}` : ""
                }`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
              >
                Take Action <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Awaiting review — different CTA */}
          {urgentState?.label === "Awaiting Review" && (
            <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1.5 pt-1">
              <Clock size={11} />
              Waiting for supervisor feedback
            </p>
          )}

          {/* Ready to submit — nudge */}
          {urgentState?.label === "Ready to Submit" && (
            <Link
              href={`/student/projects/${currentProject.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-2 rounded-lg transition-colors"
            >
              <Send size={12} />
              Submit for Review
            </Link>
          )}

          {/* Verified — show done state */}
          {urgentState?.label === "Verified" && (
            <p className="text-[11px] text-green-600 font-medium flex items-center gap-1.5 pt-1">
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
                  className="rounded-xl border border-slate-100 overflow-hidden"
                >
                  {/* Chapter header */}
                  <button
                    onClick={() => toggleChapter(chapter)}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-xs font-bold text-slate-600 truncate text-left">
                        {chapter}
                      </p>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${state.style}`}
                      >
                        {state.label}
                      </span>
                    </div>

                    {isOpen ? (
                      <ChevronUp
                        size={13}
                        className="text-slate-400 shrink-0 ml-2"
                      />
                    ) : (
                      <ChevronDown
                        size={13}
                        className="text-slate-400 shrink-0 ml-2"
                      />
                    )}
                  </button>

                  {/* Tasks */}
                  {isOpen && (
                    <div className="px-3 pb-3 space-y-2 border-t border-slate-100 pt-2 bg-slate-50/50">
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
