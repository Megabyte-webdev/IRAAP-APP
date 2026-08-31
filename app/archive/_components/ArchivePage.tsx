"use client";

import { useState, useMemo, useEffect } from "react";
import Hero from "@/app/_components/Hero";
import {
  Archive,
  ChevronDown,
  RefreshCcw,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useProject } from "@/app/_hooks/use-projects";
import ProjectCard from "@/app/_components/ProjectCard";
import ProjectCardSkeleton from "@/app/(dashboard)/admin/archive/_components/ProjectCardSkeleton";
import useSearch from "@/app/_hooks/use-search";
import ArchiveFilters from "./ArchiveFilters";

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    "Most Recent" | "Oldest First" | "Alphabetical"
  >("Most Recent");

  const { getFilterOptions } = useSearch();
  const { getAllProjects } = useProject();

  const {
    data: filterOptions = {},
    isLoading: filterOptionsLoading,
    isError: filterOptionsError,
  } = getFilterOptions();

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = getAllProjects({
    title: debouncedSearch || undefined,
    keyword: selectedFocus.length > 0 ? selectedFocus : undefined,
    supervisor:
      selectedSupervisors.length > 0 ? selectedSupervisors : undefined,
    year: selectedYears.length > 0 ? selectedYears : undefined,
    status: "APPROVED",
    limit: 20,
    sortBy: sortBy,
  });

  const projects = data?.pages.flatMap((page) => page.data) ?? [];
  const metadata = data?.pages[data.pages.length - 1]?.metadata ?? data?.pages[data.pages.length - 1]?.pagination;

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleTagQuery = (tag: string) => {
    if (!selectedFocus.includes(tag)) {
      setSelectedFocus((prev) => [...prev, tag]);
    }
  };

  const toggleFocusFilter = (field: string) => {
    setSelectedFocus((prev) =>
      prev.includes(field)
        ? prev.filter((item) => item !== field)
        : [...prev, field],
    );
  };

  const toggleYearFilter = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  const toggleSupervisorFilter = (supervisor: string) => {
    setSelectedSupervisors((prev) =>
      prev.includes(supervisor)
        ? prev.filter((s) => s !== supervisor)
        : [...prev, supervisor],
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedFocus([]);
    setSelectedYears([]);
    setSelectedSupervisors([]);
  };

  const sortedYears: number[] = useMemo(() => {
    return (
      filterOptions?.years?.slice().sort((a: number, b: number) => b - a) || []
    );
  }, [filterOptions?.years]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
      {/* 1. TOP HERO CONTAINER AREA */}
      <Hero
        variant="archive"
        badgeIcon={<Archive size={14} />}
        badgeText="GLOBAL ARCHIVES"
        title="Search the OOU Computer Engineering Project Archive"
        description="Explore thousands of past final year projects. Filter by focus area, academic year, or supervisor to find the exact work you need."
        trendingTags={selectedFocus.slice(0, 4)}
        onSearchSubmit={handleSearch}
        onTagClick={handleTagQuery}
      />

      <div className="w-full bg-white py-12 border-t border-slate-100 dark:border-none flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8 items-start">
            {/* EXTRACTED RESPONSIVE SIDEBAR COMPONENT */}
            <ArchiveFilters
              filterOptions={filterOptions}
              filterOptionsLoading={filterOptionsLoading}
              filterOptionsError={filterOptionsError}
              selectedFocus={selectedFocus}
              selectedYears={selectedYears}
              selectedSupervisors={selectedSupervisors}
              sortedYears={sortedYears}
              onToggleFocus={toggleFocusFilter}
              onToggleYear={toggleYearFilter}
              onToggleSupervisor={toggleSupervisorFilter}
              onClearAll={clearAllFilters}
              metadata={metadata}
              currentProjectsCount={projects.length}
            />

            {/* MAIN CONTENT GRID */}
            <main className="lg:col-span-3 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
                <span className="text-sm font-medium text-slate-400">
                  Showing{" "}
                  <strong className="font-semibold text-slate-900">
                    {projects?.length || 0}
                  </strong>{" "}
                  {metadata && (
                    <>
                      of{" "}
                      <strong className="font-semibold text-slate-900">
                        {metadata.total}
                      </strong>
                    </>
                  )}{" "}
                  results
                </span>
                {isFetching && !isFetchingNextPage && (
                  <span className="text-[11px] text-slate-400 animate-pulse">Updating results…</span>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">
                    Sort by:
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as
                            | "Most Recent"
                            | "Oldest First"
                            | "Alphabetical",
                        )
                      }
                      className="appearance-none bg-[#111827] text-white text-xs font-medium pl-3 pr-8 py-1.5 rounded-md border border-slate-800 outline-none cursor-pointer focus:border-blue-500 transition-colors"
                    >
                      <option>Most Recent</option>
                      <option>Oldest First</option>
                      <option>Alphabetical</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* PROJECTS GRID */}
              <div className="grid md:grid-cols-2 gap-4">
                {isLoading &&
                  Array.from({ length: 6 }).map((_, index) => (
                    <ProjectCardSkeleton key={index} />
                  ))}

                {isError && (
                  <div className="md:col-span-2 flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 py-12">
                    <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
                    <h3 className="font-semibold text-gray-900">
                      Failed to load projects
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      We could not retrieve archive records.
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="mt-5 flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Retry
                    </button>
                  </div>
                )}

                {!isLoading && !isError && projects.length === 0 && (
                  <div className="h-full md:col-span-2 rounded-xl border border-gray-100 bg-gray-50 py-12 text-center">
                    <h3 className="font-semibold text-gray-900">
                      No projects found
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your filters or search query.
                    </p>
                  </div>
                )}

                {!isLoading &&
                  !isError &&
                  projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>

              {/* PAGINATION */}
              {(hasNextPage || isFetchingNextPage) && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    disabled={!hasNextPage || isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    className="flex items-center gap-1.5 border border-slate-200 text-slate-500 hover:border-primary hover:text-primary font-semibold text-xs px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
