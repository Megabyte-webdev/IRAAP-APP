"use client";

import { useState } from "react";

type Project = any;

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

  // ==================== FILTERING & SORTING ====================
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
          return (b.submissionYear || 0) - (a.submissionYear || 0);
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
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Projects
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            Showing {filtered.length} of {projects.length} workspace
            {projects.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ==================== SEARCH & FILTERS CONTROLS ==================== */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search workspaces or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500/50 transition duration-150"
            />
          </div>

          {/* Actions and Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 transition duration-150 cursor-pointer"
            >
              <option value="title">Sort by Title</option>
              <option value="year">Sort by Year</option>
              <option value="category">Sort by Category</option>
              <option value="status">Sort by Status</option>
            </select>

            {/* Status Filter */}
            {uniqueStatuses.length > 0 && (
              <select
                value={filterStatus || ""}
                onChange={(e) => setFilterStatus(e.target.value || null)}
                className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 transition duration-150 cursor-pointer"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            )}

            {/* Reset Filters Toggle */}
            {(searchQuery || filterStatus) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus(null);
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200/70 dark:hover:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-800/60 transition duration-150"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================== WORKSPACE GRID / EMPTY RESULTS ==================== */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 p-16 text-center bg-white dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
              Empty
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">
              No matching records found
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
              {searchQuery
                ? "Refine your keywords or adjust filters to discover available workspaces."
                : "There are currently no active projects linked to this profile."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

// ==================== COMPONENT CARD ====================
interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/10";
      case "PENDING":
        return "bg-amber-500/10 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/10";
      case "COMPLETED":
        return "bg-blue-500/10 dark:bg-blue-500/5 text-blue-700 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/10";
      default:
        return "bg-slate-500/10 dark:bg-slate-500/5 text-slate-600 dark:text-slate-400 border-slate-500/20 dark:border-slate-500/10";
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-200 hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-none cursor-pointer"
    >
      <div>
        {/* Workspace Title & Status Tag */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150 line-clamp-1">
            {project.title}
          </h3>

          {project.status && (
            <span
              className={`px-2.5 py-0.5 text-[11px] font-bold tracking-wide rounded-full border shadow-sm uppercase ${getStatusStyle(
                project.status,
              )}`}
            >
              {project.status}
            </span>
          )}
        </div>

        {/* Content Briefing */}
        {project.description ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-5">
            {project.description}
          </p>
        ) : (
          <p className="text-sm italic text-slate-400 dark:text-slate-600 line-clamp-2 leading-relaxed mb-5">
            No descriptive specifications provided for this engineering module.
          </p>
        )}
      </div>

      {/* Footer Metadata Blocks */}
      <div className="space-y-4">
        {/* Progress Tracker Slider */}
        {project.completedPercentage !== undefined && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 dark:text-slate-500">
              <span className="uppercase tracking-wider">
                Completion Matrix
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {project.completedPercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  project.completedPercentage >= 75
                    ? "bg-emerald-500"
                    : project.completedPercentage >= 50
                      ? "bg-blue-500"
                      : project.completedPercentage >= 25
                        ? "bg-amber-500"
                        : "bg-orange-500"
                }`}
                style={{ width: `${project.completedPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Technical Specification Counts */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          {project.taskCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <span>
                {project.taskCount} Task{project.taskCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {project.membersCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <span>
                {project.membersCount} Member
                {project.membersCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* View Details Interactive Indicator */}
        <div
          className={`flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all duration-200 overflow-hidden ${
            isHovered ? "max-h-6 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <span>Open Workspace</span>
          <span className="transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </div>
  );
}
