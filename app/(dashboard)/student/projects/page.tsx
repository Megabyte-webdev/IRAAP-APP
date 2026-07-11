"use client";

import { useState } from "react";
import { useProject } from "@/app/_hooks/use-projects";
import TaskItem from "./_components/TaskItem";
import TaskList from "./_components/TaskList";
import { getChapterState } from "@/app/_utils/utility";
import ProjectList from "./_components/ProjectList";

type Project = any;
type Review = any;
type Task = any;

export default function Projects() {
  const { getProjects, getProjectReviews } = useProject();
  const { data: projects = [], isLoading, isError } = getProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const currentProject = selectedProjectId
    ? projects.find((p: Project) => p.id === selectedProjectId)
    : null;

  const { data: reviews = [], isLoading: reviewsLoading } = getProjectReviews(
    currentProject?.id || 0,
  );

  // ==================== LOADING STATE ====================
  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="mb-8">
          <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 animate-pulse"
            >
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
              <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== ERROR STATE ====================
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-center bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex items-center justify-center">
          <span className="text-red-400 dark:text-red-500 text-xl font-bold">
            !
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Failed to load projects
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Check your connection and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // ==================== EMPTY STATE ====================
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-16 text-center bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
          <span className="text-slate-400 dark:text-slate-500 text-xl">📁</span>
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No projects available
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          You haven't been assigned to any projects yet.
        </p>
      </div>
    );
  }

  // ==================== PROJECT LIST VIEW ====================
  if (!selectedProjectId) {
    return (
      <ProjectList
        projects={projects}
        onSelectProject={(projectId) => setSelectedProjectId(projectId)}
      />
    );
  }

  // ==================== DETAILED PROJECT VIEW ====================
  return (
    <ProjectDetailView
      currentProject={currentProject}
      reviews={reviews}
      reviewsLoading={reviewsLoading}
      onBack={() => setSelectedProjectId(null)}
    />
  );
}

// ==================== DETAIL VIEW COMPONENT ====================
function ProjectDetailView({
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
  // ==================== LOADING STATE ====================
  if (reviewsLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
        >
          ← Back to Projects
        </button>

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
            <div className="h-32 bg-slate-100 dark:bg-[#1E293B] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ==================== EMPTY REVIEWS STATE ====================
  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
        >
          ← Back to Projects
        </button>

        <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
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

  // ==================== DATA PROCESSING ====================
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

  // ==================== INTELLIGENCE ENGINE ====================
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

  // ==================== RENDER ====================
  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
      >
        ← Back to Projects
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {currentProject?.name}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
        </p>
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
