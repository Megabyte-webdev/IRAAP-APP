"use client";

import { useProject } from "@/app/_hooks/use-projects";
import TaskItem from "./_components/TaskItem";
import TaskList from "./_components/TaskList";
import { getChapterState } from "@/app/_utils/utility";

export default function Projects() {
  const { getProjects, getProjectReviews } = useProject();
  const { data: projects = [], isLoading, isError } = getProjects();

  const currentProject = projects?.[0];

  const { data: reviews = [], isLoading: reviewsLoading } = getProjectReviews(
    Number(currentProject?.id),
  );

  if (isLoading || reviewsLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
                <div className="h-6 w-24 bg-slate-200 rounded-full" />
              </div>
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 bg-slate-100 rounded w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
          <span className="text-red-400 text-xl">!</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">
            Failed to load your workspace
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Check your connection and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
        <p className="text-sm font-semibold text-slate-700">
          No active project found
        </p>
        <p className="text-xs text-slate-400">
          You haven't been assigned to a project yet.
        </p>
      </div>
    );
  }

  const allTasks = reviews.flatMap((r: any) =>
    (r.tasks || []).map((t: any) => ({
      ...t,
      chapter: r.summary,
    })),
  );

  const latestTasksMap = new Map();

  allTasks.forEach((task) => {
    const existing = latestTasksMap.get(task.id);

    if (!existing || new Date(task.updatedAt) > new Date(existing.updatedAt)) {
      latestTasksMap.set(task.id, task);
    }
  });

  const tasks = Array.from(latestTasksMap.values());

  // INTELLIGENCE ENGINE

  const isOverdue = (task: any) =>
    task.completedAt && new Date(task.completedAt) > new Date(task.createdAt);

  const isCompleted = (chapterTasks: any[]) =>
    chapterTasks.length > 0 &&
    chapterTasks.every((t: any) => t.status === "VERIFIED");

  const getProgress = (chapterTasks: any[]) => {
    const done = chapterTasks.filter((t) => t.status === "VERIFIED").length;
    return chapterTasks.length ? (done / chapterTasks.length) * 100 : 0;
  };

  const getTaskScore = (task: any) => {
    // VERIFIED tasks are done — score 0, they don't contribute urgency
    if (task.status === "VERIFIED") return 0;

    let score = 0;
    if (task.status === "PENDING") score += 2;
    if (task.status === "IN_PROGRESS") score += 1;
    if (task.status === "COMPLETED") score += 1; // done but not verified yet

    // Only check overdue if completedAt actually exists
    if (
      task.completedAt &&
      new Date(task.completedAt) > new Date(task.createdAt)
    ) {
      score += 3;
    }

    return score;
  };

  const groupedByChapter = tasks.reduce((acc: any, task: any) => {
    if (!acc[task.chapter]) {
      acc[task.chapter] = {
        tasks: [],
        // Find the parent review for this chapter
        review: reviews.find((r: any) => r.summary === task.chapter) ?? null,
      };
    }
    acc[task.chapter].tasks.push(task);
    return acc;
  }, {});

  const chapters = Object.entries(groupedByChapter).sort(
    ([, a]: any, [, b]: any) => {
      const scoreA = a.tasks.reduce(
        (s: number, t: any) => s + getTaskScore(t),
        0,
      );
      const scoreB = b.tasks.reduce(
        (s: number, t: any) => s + getTaskScore(t),
        0,
      );
      return scoreB - scoreA;
    },
  );

  const mostUrgent = chapters[0];

  const firstUnfinishedTask = tasks.find((t) => t.status !== "VERIFIED");

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8">
      {/* LEFT */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        {chapters.map(([chapter, { tasks: chapterTasks, review }]: any) => {
          const state = getChapterState(chapterTasks, review);
          const score = chapterTasks.reduce(
            (s: number, t: any) => s + getTaskScore(t),
            0,
          );
          const progress = getProgress(chapterTasks);

          return (
            <div
              key={chapter}
              className={`bg-white border rounded-2xl shadow-sm overflow-hidden ${
                state.urgent ? "border-red-200" : "border-slate-200"
              }`}
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {chapter}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {progress.toFixed(0)}% complete
                  </p>
                </div>

                <span
                  className={`px-3 py-1.5 text-xs font-bold rounded-full h-max border ${state.style}`}
                >
                  {state.label}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {chapterTasks.map((task: any) => (
                  <TaskItem
                    key={task.id}
                    text={task.title}
                    completed={task.status === "VERIFIED"}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <TaskList
        currentProject={currentProject}
        mostUrgent={mostUrgent}
        firstUnfinishedTask={firstUnfinishedTask}
        chapters={chapters}
      />
    </div>
  );
}
