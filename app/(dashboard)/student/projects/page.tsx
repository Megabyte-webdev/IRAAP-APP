"use client";

import { useState } from "react";
import { useProject } from "@/app/_hooks/use-projects";
import ProjectList from "./_components/ProjectList";
import { FolderOpen } from "lucide-react";
import ProjectDetailView from "./_components/ProjectDetailView";

type Project = any;

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

  // LOADING STATE
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

  // ERROR STATE
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

  // EMPTY STATE
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-16 text-center bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
          <FolderOpen size={24} className="text-slate-400" />
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

  // PROJECT LIST VIEW
  if (!selectedProjectId) {
    return (
      <ProjectList
        projects={projects}
        onSelectProject={(projectId) => setSelectedProjectId(projectId)}
      />
    );
  }

  // DETAILED PROJECT VIEW
  return (
    <ProjectDetailView
      currentProject={currentProject}
      reviews={reviews}
      reviewsLoading={reviewsLoading}
      onBack={() => setSelectedProjectId(null)}
    />
  );
}
