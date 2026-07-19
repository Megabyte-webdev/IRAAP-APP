"use client";

import { useState, useEffect } from "react";
import { FolderOpen, AlertCircle, ChevronDown, X } from "lucide-react";
import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { useProject } from "@/app/_hooks/use-projects";
import ArchiveHeader from "./ArchiveHeader";

export default function ArchiveDashboard() {
  const { getAllProjects } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const handleFilterClick = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = getAllProjects({
    title: searchQuery || undefined,
    keyword: selectedFilters.length > 0 ? selectedFilters : undefined,
    status: "APPROVED",
    limit: 20,
  });

  const projects = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <main className="min-h-screen overflow-y-auto bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200 antialiased selection:bg-blue-500/30">
      {/* TRANSFORMING HERO & SEARCH BAR LAYER */}
      <ArchiveHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterClick={handleFilterClick}
      />

      {/* Dynamic Structural Margin Offset */}
      <div className="pt-8">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
          {/* Active Filtering Row */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/60 dark:bg-slate-900/40 p-2 rounded-lg animate-fadeIn">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 px-1">
                Active Filters:
              </span>
              {selectedFilters.map((filter) => (
                <div
                  key={filter}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 shadow-sm"
                >
                  {filter}
                  <button
                    onClick={() => toggleFilter(filter)}
                    className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 dark:border-red-950/50 bg-red-50 dark:bg-red-950/20 p-6 flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-0.5">
                  Failed to load projects
                </h3>
                <p className="text-xs text-red-700 dark:text-red-400">
                  Something went wrong. Please refresh the page or try again.
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <section className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <FolderOpen className="h-8 w-8 text-slate-300 dark:text-slate-700" />
              <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                No results found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Try adjusting your filters or query strings.
              </p>
            </section>
          ) : (
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                  Recently Published Archive
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {projects.length} files visible
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {isFetchingNextPage && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  {[...Array(3)].map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </div>
              )}

              <footer className="flex justify-center pt-8">
                {hasNextPage ? (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-blue-600 dark:bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 dark:hover:bg-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-600 italic">
                    End of the institutional archive feed.
                  </p>
                )}
              </footer>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
