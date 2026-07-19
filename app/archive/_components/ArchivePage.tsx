"use client";

import React, { useState } from "react";
import Hero from "@/app/_components/Hero";
import {
  Archive,
  Bookmark,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Lock,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useProject } from "@/app/_hooks/use-projects";
import ProjectCard from "@/app/_components/ProjectCard";
import ProjectCardSkeleton from "@/app/(dashboard)/admin/archive/_components/ProjectCardSkeleton";
import FilterCheckbox from "./FilterCheckbox";

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFocus, setSelectedFocus] = useState<string[]>(["IoT"]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Most Recent");
  const { getAllProjects } = useProject();

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = getAllProjects({
    title: searchQuery || undefined,
    keyword: selectedFocus.length > 0 ? selectedFocus : undefined,
    status: "APPROVED",
    limit: 20,
  });
  const projects = data?.pages.flatMap((page) => page.data) ?? [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching database records for:", query);
  };

  const handleTagQuery = (tag: string) => {
    if (!selectedFocus.includes(tag)) {
      setSelectedFocus((prev) => [...prev, tag]);
    }
    console.log("Adding filter parameter tag:", tag);
  };

  const toggleFocusFilter = (field: string) => {
    setSelectedFocus((prev) =>
      prev.includes(field)
        ? prev.filter((item) => item !== field)
        : [...prev, field],
    );
  };

  const clearAllFilters = () => {
    setSelectedFocus([]);
    setSelectedYears([]);
    setSelectedSupervisors([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
      {/* 1. TOP HERO CONTAINER AREA */}
      <Hero
        variant="archive"
        badgeIcon={<Archive size={14} />}
        badgeText="GLOBAL ARCHIVES"
        title="Search the OOU Computer Engineering Project Archive"
        description="Explore thousands of past final year projects. Filter by focus area, academic year, or supervisor to find the exact work you need."
        trendingTags={[
          "Embedded Systems",
          "Machine Learning",
          "IoT",
          "Network Security",
        ]}
        onSearchSubmit={handleSearch}
        onTagClick={handleTagQuery}
      />

      <div className="w-full bg-white py-12 border-t border-slate-100 dark:border-none flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8 items-start">
            <aside className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-1">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Filters</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-primary transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">
                  Research Focus
                </h3>
                <div className="space-y-2.5">
                  {[
                    "Embedded Systems",
                    "Machine Learning",
                    "IoT",
                    "Network Security",
                  ].map((focus) => (
                    <FilterCheckbox
                      key={focus}
                      label={focus}
                      checked={selectedFocus.includes(focus)}
                      onChange={() => toggleFocusFilter(focus)}
                    />
                  ))}
                </div>
              </div>

              {/* SECTION B: ACADEMIC YEARS OPTIONS */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">
                  Academic Year
                </h3>
                <div className="space-y-2.5">
                  {[2025, 2024, 2023, 2022].map((year) => (
                    <FilterCheckbox
                      key={year}
                      label={year}
                      checked={selectedYears.includes(year)}
                      onChange={() =>
                        setSelectedYears((prev) =>
                          prev.includes(year)
                            ? prev.filter((y) => y !== year)
                            : [...prev, year],
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              {/* SECTION C: SUPERVISOR OPTIONS */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">
                  Supervisor
                </h3>
                <div className="space-y-2.5">
                  {["Dr. A. O. Smith", "Prof. B. Johnson"].map((supervisor) => (
                    <FilterCheckbox
                      key={supervisor}
                      label={supervisor}
                      checked={selectedSupervisors.includes(supervisor)}
                      onChange={() =>
                        setSelectedSupervisors((prev) =>
                          prev.includes(supervisor)
                            ? prev.filter((s) => s !== supervisor)
                            : [...prev, supervisor],
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </aside>

            {/* RIGHT RESULTS MAIN CARD CONTAINER GRID */}
            <main className="lg:col-span-3 flex flex-col gap-6">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <span className="text-sm font-medium text-slate-400">
                  Showing{" "}
                  <strong className=" font-semibold">{projects?.length}</strong>{" "}
                  results
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">
                    Sort by:
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
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
              <div className="grid md:grid-cols-2 gap-4">
                {/* Loading */}
                {isLoading &&
                  Array.from({ length: 6 }).map((_, index) => (
                    <ProjectCardSkeleton key={index} />
                  ))}

                {/* Error */}
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

                {/* Empty */}
                {!isLoading && !isError && projects.length === 0 && (
                  <div className="h-full md:col-span-2 rounded-xl border border-gray-100 bg-gray-50 py-12 text-center">
                    <h3 className="font-semibold text-gray-900">
                      No projects found
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your filters.
                    </p>
                  </div>
                )}

                {/* Projects */}
                {!isLoading &&
                  !isError &&
                  projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>

              {/* PAGINATION INTERACTION CONTROLS BAR */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  disabled={!hasNextPage || isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  className="flex items-center gap-1.5 border border-slate-200 text-slate-500 hover:border-primary hover:text-primary font-semibold text-xs px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
