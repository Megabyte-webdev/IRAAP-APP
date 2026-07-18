"use client";

import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  FolderOpen,
  AlertCircle,
  ChevronDown,
  X,
} from "lucide-react";
import ProjectCard from "./ProjectCard";
import ProfileDropdown from "./ProfileDropdown";
import Link from "next/link";
import ProjectCardSkeleton from "../../../../_components/ProjectCardSkeleton";
import { useProject } from "@/app/_hooks/use-projects";
import { useAuth } from "@/app/_context/AuthContext";
import ThemeButton from "@/app/_components/ThemeButton";

export default function ArchiveDashboard() {
  const { getAllProjects } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { authDetails } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200 antialiased selection:bg-blue-500/30">
      {/* TRANSFORMING HERO & SEARCH BAR LAYER */}
      <div
        className={`fixed left-0 right-0 top-0 z-30 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm py-3"
            : "bg-[#F8FAFC] dark:bg-slate-950 pt-20 pb-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div
            className={`flex flex-col items-center text-center transition-all duration-300 ease-in-out ${
              isScrolled ? "md:flex-row md:justify-between md:gap-4" : "w-full"
            }`}
          >
            {/* Hero Typography */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isScrolled
                  ? "h-0 opacity-0 m-0 pointer-events-none hidden md:block md:h-auto md:opacity-100 md:visible"
                  : "h-auto opacity-100 mb-2"
              }`}
            >
              <h1
                className={`font-bold text-slate-900 dark:text-slate-50 tracking-tight transition-all duration-300 ${
                  isScrolled ? "text-base" : "text-2xl md:text-3xl mb-1"
                }`}
              >
                Explore the Institutional Archive
              </h1>
              <p
                className={`text-slate-500 dark:text-slate-400 transition-all duration-300 ${
                  isScrolled ? "hidden" : "text-sm max-w-xl mb-4"
                }`}
              >
                Search thousands of approved theses, journals, and project
                proposals.
              </p>
            </div>

            {/* Input & Filters Shell */}
            <div
              className={`flex flex-col sm:flex-row items-center gap-3 w-full transition-all duration-300 ${
                isScrolled
                  ? "md:flex-row md:flex-1 md:max-w-4xl md:justify-end"
                  : "max-w-3xl"
              }`}
            >
              {/* Search Field */}
              <div
                className={`relative w-full shadow-sm rounded-full border transition-all duration-200 ${
                  isScrolled
                    ? "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-sky-500 dark:focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 dark:focus-within:ring-sky-950/50"
                    : "bg-[#F8FAFC] dark:bg-slate-950 border-sky-400/70 dark:border-sky-500/50 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100/50 dark:focus-within:ring-sky-950/30"
                }`}
              >
                <input
                  type="text"
                  placeholder="Search by title, author, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-6 pr-14 bg-transparent rounded-full text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-200 transition-all duration-300 ${
                    isScrolled ? "py-2" : "py-3.5"
                  }`}
                />
                <div
                  className={`absolute right-2 top-1/2 -translate-y-1/2 bg-[#38BDF8] hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 text-white rounded-full shadow-sm transition-all cursor-pointer ${
                    isScrolled ? "p-1.5" : "p-2.5"
                  }`}
                >
                  <Search className="h-4 w-4 stroke-[2.5]" />
                </div>
              </div>

              {/* Action items container */}
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                {/* Dropdown Action Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-sky-200/60 dark:border-slate-800 text-xs font-normal text-sky-500 dark:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all shadow-sm dynamic-btn"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 stroke-[1.5]" />
                    <span>Filter Options</span>
                    {selectedFilters.length > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-full font-bold text-[10px]">
                        {selectedFilters.length}
                      </span>
                    )}
                  </button>

                  {/* Dropdown menu markup placeholder */}
                </div>

                {/* INTEGRATED BLOCK */}
                <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
                  <ThemeButton />

                  {authDetails?.user ? (
                    <ProfileDropdown />
                  ) : (
                    <Link
                      href="/login"
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Structural Margin Offset */}
      <div
        className={`transition-all duration-300 mt-20 ${
          isScrolled ? "pt-36 md:pt-32" : "pt-70 md:pt-65"
        }`}
      >
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
