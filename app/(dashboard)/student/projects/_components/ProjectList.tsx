"use client";

import { Project } from "@/app/_utils/types";
import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (projectId: number) => void;
}

export default function ProjectsList({
  projects,
  onSelectProject,
}: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "title" | "year" | "category" | "status"
  >("title");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // FILTERING & SORTING
  const filtered = projects
    .filter((project: Project) => {
      const matchesSearch =
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !filterStatus || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a: Project, b: Project) => {
      switch (sortBy) {
        case "year":
          return Number(b.submissionYear || 0) - Number(a.submissionYear || 0);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        case "title":
        default:
          return (a.title || "").localeCompare(b.title || "");
      }
    });

  const uniqueStatuses = Array.from(
    new Set(projects.map((p: Project) => p.status)),
  ).filter(Boolean);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
            Showing {filtered.length} of {projects.length} workspace
            {projects.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* SEARCH & FILTERS CONTROLS */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        {/* Search Field Wrapper */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search workspaces or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-slate-100 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500/50 transition-all shadow-sm"
          />
        </div>

        {/* Actions and Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm"
            >
              <option value="title">Sort by Title</option>
              <option value="year">Sort by Year</option>
              <option value="category">Sort by Category</option>
              <option value="status">Sort by Status</option>
            </select>
            <SlidersHorizontal
              size={12}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Status Filter */}
          {uniqueStatuses.length > 0 && (
            <div className="relative">
              <select
                value={filterStatus || ""}
                onChange={(e) => setFilterStatus(e.target.value || null)}
                className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 pointer-events-none" />
            </div>
          )}

          {/* Reset Filters Toggle */}
          {(searchQuery || filterStatus) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all shadow-sm"
            >
              <X size={12} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* WORKSPACE GRID / EMPTY RESULTS */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-700/60 mb-3">
            <Search size={16} className="text-slate-400 dark:text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No matching records found
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              {searchQuery
                ? "Refine your keywords or adjust status parameters to discover other active workspaces."
                : "There are currently no active projects linked to this workspace profile."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-card gap-5">
          {filtered.map((project: Project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onSelectProject(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
