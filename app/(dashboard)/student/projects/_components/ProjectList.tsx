"use client";

import { Project } from "@/app/_utils/types";
import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { Search, SlidersHorizontal, X, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";

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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 text-slate-800 dark:text-slate-200">
      {/* DASHBOARD SUB-HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage and monitor your submissions ({filtered.length} found)
          </p>
        </div>

        {/* SUBMIT PROJECT NAVIGATION BUTTON */}
        <Link
          href="/student/upload"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:shadow-lg active:shadow-lg text-white font-medium text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors duration-150"
        >
          <Plus size={14} strokeWidth={2.5} />
          Submit Project
        </Link>
      </div>

      {/* FILTER & CONTROL BAR */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg text-slate-900 dark:text-slate-100 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all shadow-sm"
          />
        </div>

        {/* Dropdowns & Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort Selection */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-600 cursor-pointer shadow-sm"
            >
              <option value="title">Sort by Title</option>
              <option value="year">Sort by Year</option>
              <option value="category">Sort by Category</option>
              <option value="status">Sort by Status</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Status Selection */}
          {uniqueStatuses.length > 0 && (
            <div className="relative">
              <select
                value={filterStatus || ""}
                onChange={(e) => setFilterStatus(e.target.value || null)}
                className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-600 cursor-pointer shadow-sm"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          )}

          {/* Clear Filters */}
          {(searchQuery || filterStatus) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 transition-all shadow-sm"
            >
              <X size={12} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* DASHBOARD CONTENT GRID */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-xl shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-700/60 mb-3">
            <Search size={16} className="text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            No matching records found
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Adjust your keyword or filter options to discover other active
            entries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
