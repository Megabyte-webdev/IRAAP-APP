"use client";

import { useAuth } from "@/app/_context/AuthContext";
import NoSupervisor from "../../_components/NoSupervisor";
import {
  BookOpen,
  Plus,
  Search,
  X,
  ChevronDown,
  Layers,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn, extractErrorMessage } from "@/app/_lib/utils";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { usePublication } from "@/app/_hooks/use-publications";
import { FilterStatus, Publication } from "@/app/_utils/types";
import PublicationCard from "./_components/PublicationCard";

const FILTER_OPTIONS = [
  { value: "ALL" as FilterStatus, label: "All Publications", icon: Layers },
  { value: "PENDING" as FilterStatus, label: "Pending Review", icon: Clock },
  { value: "APPROVED" as FilterStatus, label: "Approved", icon: CheckCircle },
  {
    value: "REJECTED" as FilterStatus,
    label: "Revision Needed",
    icon: XCircle,
  },
];

export default function PublicationsPage() {
  const { authDetails } = useAuth();
  const { getMyPublications } = usePublication();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasSupervisor = authDetails?.user?.supervisorId;
  const { data: publications = [], isLoading, error } = getMyPublications();

  // Close custom dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = useMemo(() => {
    return (
      FILTER_OPTIONS.find((opt) => opt.value === filterStatus) ??
      FILTER_OPTIONS[0]
    );
  }, [filterStatus]);

  const SelectedIcon = selectedOption.icon;

  // Compute counts and filtered results efficiently in a single pass
  const { filteredPublications, counts } = useMemo(() => {
    const stats = {
      ALL: publications.length,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
    };

    const searchLower = searchQuery.toLowerCase();

    const filtered = publications.filter((pub: Publication) => {
      if (pub.status in stats) {
        stats[pub.status as keyof typeof stats] += 1;
      }

      const statusMatch = filterStatus === "ALL" || pub.status === filterStatus;

      const searchMatch =
        !searchQuery ||
        pub.title.toLowerCase().includes(searchLower) ||
        (pub.abstract && pub.abstract.toLowerCase().includes(searchLower));

      return statusMatch && searchMatch;
    });

    return { filteredPublications: filtered, counts: stats };
  }, [publications, filterStatus, searchQuery]);

  if (!hasSupervisor) return <NoSupervisor />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 px-4 py-10 lg:px-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-primary">
                  <BookOpen size={14} className="text-white" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  IRAAP Repository
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                My Publications
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Manage and track your research submissions
              </p>
            </div>

            <Link
              href="/student/publications/submit"
              className={cn(
                "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium",
                "bg-primary text-white hover:bg-primary/90 transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "whitespace-nowrap shadow-sm hover:shadow",
              )}
            >
              <Plus size={18} />
              Create Publication
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {FILTER_OPTIONS.map((option) => {
              const StatIcon = option.icon;
              const getStatColor = (status: FilterStatus) => {
                switch (status) {
                  case "PENDING":
                    return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20";
                  case "APPROVED":
                    return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20";
                  case "REJECTED":
                    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20";
                  default:
                    return "text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50";
                }
              };

              return (
                <div
                  key={option.value}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
                      {option.label}
                    </p>
                    <div
                      className={cn(
                        "p-1 rounded-md shrink-0 opacity-80",
                        getStatColor(option.value).split(" ")[1],
                      )}
                    >
                      <StatIcon
                        size={13}
                        className={getStatColor(option.value).split(" ")[0]}
                      />
                    </div>
                  </div>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      getStatColor(option.value).split(" ")[0],
                    )}
                  >
                    {counts[option.value]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filter Section */}
        {publications.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="flex gap-3 flex-col sm:flex-row items-stretch">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search by title or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-lg",
                    "bg-white dark:bg-slate-900",
                    "border border-slate-200 dark:border-slate-800",
                    "text-slate-900 dark:text-slate-100",
                    "placeholder:text-slate-500 dark:placeholder:text-slate-400",
                    "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                    "transition-all duration-200 text-sm",
                  )}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Custom Filter Dropdown */}
              <div className="relative shrink-0 sm:w-56" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150",
                    "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm",
                    "hover:bg-slate-50 dark:hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <SelectedIcon
                      size={16}
                      className="text-slate-400 dark:text-slate-500 shrink-0"
                    />
                    <span className="truncate">{selectedOption.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-slate-400 transition-transform duration-200 shrink-0",
                      isDropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Dropdown Card Flyout Overlay */}
                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-1.5 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                    {FILTER_OPTIONS.map((option) => {
                      const OptionIcon = option.icon;
                      const isSelected = option.value === filterStatus;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFilterStatus(option.value);
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors font-medium",
                            isSelected
                              ? "bg-slate-50 text-primary dark:bg-slate-800/80 dark:text-slate-100"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200",
                          )}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <OptionIcon
                              size={15}
                              className={cn(
                                "shrink-0",
                                isSelected
                                  ? "text-primary dark:text-slate-300"
                                  : "text-slate-400 dark:text-slate-500",
                              )}
                            />
                            <span className="truncate">{option.label}</span>
                          </div>
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {(filterStatus !== "ALL" || searchQuery) && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">
                  Filters:
                </span>
                <div className="flex flex-wrap gap-2">
                  {filterStatus !== "ALL" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-slate-300 border border-primary/10 text-xs font-medium">
                      {selectedOption.label}
                      <button
                        onClick={() => setFilterStatus("ALL")}
                        className="hover:opacity-70 transition-opacity ml-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-slate-300 border border-primary/10 text-xs font-medium">
                      "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery("")}
                        className="hover:opacity-70 transition-opacity ml-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-primary rounded-full" />
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
              Loading publications...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-6">
            <p className="text-red-900 dark:text-red-200 font-medium">
              Error loading publications
            </p>
            <p className="text-red-800 dark:text-red-300 text-sm mt-1">
              {extractErrorMessage(error)}
            </p>
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <BookOpen
                  size={24}
                  className="text-slate-400 dark:text-slate-500"
                />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {publications.length === 0
                ? "No publications yet"
                : "No publications found"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              {publications.length === 0
                ? "Start by creating your first publication submission"
                : searchQuery || filterStatus !== "ALL"
                  ? "Try adjusting your search or filters to find what you're looking for"
                  : "No results available"}
            </p>
            {publications.length === 0 && (
              <Link
                href="/student/publications/submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-all shadow-sm text-sm"
              >
                <Plus size={18} />
                Create Your First Publication
              </Link>
            )}
            {(searchQuery || filterStatus !== "ALL") &&
              publications.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("ALL");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-all mt-4 text-sm shadow-sm"
                >
                  Clear Filters
                </button>
              )}
          </div>
        ) : (
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-4 tracking-wide uppercase">
              Showing{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {filteredPublications.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {publications.length}
              </span>{" "}
              submission{publications.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-4 grid grid-cols-card">
              {filteredPublications.map((publication: Publication) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
