"use client";

import { Project } from "@/app/_utils/types";
import { getChapterState } from "@/app/_utils/utility";
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import TaskItem from "./TaskItem";
import TaskList from "./TaskList";

type Review = any;
type Task = any;

export default function ProjectDetailView({
  currentProject,
  reviews,
  reviewsLoading,
  onBack,
}: {
  currentProject: Project | undefined;
  reviews: Review[];
  reviewsLoading: boolean;
  onBack: () => void;
}) {
  // LOADING STATE
  if (reviewsLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-6" />
        <div className="h-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl mb-8 animate-pulse" />

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                  </div>
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="h-48 bg-slate-100 dark:bg-[#1E293B] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // EMPTY REVIEWS STATE
  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </button>

        <div className="flex flex-col items-center justify-center gap-3 p-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
            <span className="text-slate-400 dark:text-slate-500 text-xl">
              ✓
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No reviews yet
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Reviews will appear once they're created.
          </p>
        </div>
      </div>
    );
  }

  // DATA PROCESSING
  const allTasks = reviews.flatMap((r: Review) =>
    (r.tasks || []).map((t: Task) => ({
      ...t,
      chapter: r.summary,
    })),
  );

  const latestTasksMap = new Map();
  allTasks.forEach((task: Task) => {
    const existing = latestTasksMap.get(task.id);
    if (!existing || new Date(task.updatedAt) > new Date(existing.updatedAt)) {
      latestTasksMap.set(task.id, task);
    }
  });

  const tasks = Array.from(latestTasksMap.values());

  const getTaskScore = (task: Task): number => {
    if (task.status === "VERIFIED") return 0;

    let score = 0;
    if (task.status === "PENDING") score += 2;
    if (task.status === "IN_PROGRESS") score += 1;
    if (task.status === "COMPLETED") score += 1;

    if (
      task.completedAt &&
      new Date(task.completedAt) > new Date(task.createdAt)
    ) {
      score += 3;
    }

    return score;
  };

  const getProgress = (chapterTasks: Task[]): number => {
    const done = chapterTasks.filter((t) => t.status === "VERIFIED").length;
    return chapterTasks.length ? (done / chapterTasks.length) * 100 : 0;
  };

  const groupedByChapter = tasks.reduce((acc: any, task: Task) => {
    if (!acc[task.chapter]) {
      acc[task.chapter] = {
        tasks: [],
        review: reviews.find((r: Review) => r.summary === task.chapter) ?? null,
      };
    }
    acc[task.chapter].tasks.push(task);
    return acc;
  }, {});

  const chapters = Object.entries(groupedByChapter).sort(
    ([, a]: any, [, b]: any) => {
      const scoreA = a.tasks.reduce(
        (s: number, t: Task) => s + getTaskScore(t),
        0,
      );
      const scoreB = b.tasks.reduce(
        (s: number, t: Task) => s + getTaskScore(t),
        0,
      );
      return scoreB - scoreA;
    },
  );

  const mostUrgent = chapters[0];
  const firstUnfinishedTask = tasks.find((t) => t.status !== "VERIFIED");

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors">
      {/* PROFESSIONAL COMPACT HEADER */}
      <div className="mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-center">
          {/* Main Info Block */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-colors"
                title="Back to Projects"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Research Project
                </p>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight">
                  {currentProject?.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pl-11">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-100 dark:border-slate-700/60">
                <BookOpen size={12} className="text-slate-400" />
                {chapters.length}{" "}
                {chapters.length === 1 ? "Chapter" : "Chapters"}
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
                <CheckCircle2
                  size={12}
                  className="text-emerald-500 dark:text-emerald-400"
                />
                {tasks.filter((t) => t.status === "VERIFIED").length} /{" "}
                {tasks.length} Verified
              </span>
            </div>
          </div>

          {/* Metric / Action Block */}
          <div className="lg:col-span-4 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-8 flex flex-col justify-center">
            <div className="flex justify-between items-baseline mb-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Overall Completion
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {getProgress(tasks).toFixed(0)}%
              </p>
            </div>

            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden w-full">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${getProgress(tasks)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8">
        {/* LEFT - CHAPTERS */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {chapters.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 p-12 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No tasks found
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Tasks will appear once they're created.
              </p>
            </div>
          ) : (
            chapters.map(([chapter, { tasks: chapterTasks, review }]: any) => {
              const state = getChapterState(chapterTasks, review);
              const progress = getProgress(chapterTasks);

              return (
                <div
                  key={chapter}
                  className={`bg-white dark:bg-[#1E293B] border rounded-2xl shadow-sm overflow-hidden transition-colors ${
                    state.urgent
                      ? "border-red-200 dark:border-red-900/50"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-white dark:bg-[#1E293B] transition-colors">
                    <div>
                      <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                        {chapter}
                      </h2>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {progress.toFixed(0)}% complete
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1.5 text-xs font-bold rounded-full h-max border whitespace-nowrap ml-4 transition-colors ${
                        state.style
                      }`}
                    >
                      {state.label}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    {chapterTasks.map((task: Task) => (
                      <TaskItem
                        key={task.id}
                        text={task.title}
                        completed={task.status === "VERIFIED"}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT - SIDEBAR */}
        <TaskList
          currentProject={currentProject}
          mostUrgent={mostUrgent}
          firstUnfinishedTask={firstUnfinishedTask}
          chapters={chapters}
        />
      </div>
    </div>
  );
}
