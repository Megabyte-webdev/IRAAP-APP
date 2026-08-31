"use client";

import { useState, useRef, useEffect } from "react";
import FilterCheckbox from "./FilterCheckbox";
import { Filter, X, RotateCcw, ChevronDown, Check, Search } from "lucide-react";

interface Supervisor {
  id: number;
  name: string;
}

interface FilterOptions {
  keywords?: string[];
  years?: number[];
  supervisors?: Supervisor[];
}

interface ArchiveFiltersProps {
  filterOptions: FilterOptions;
  filterOptionsLoading: boolean;
  filterOptionsError?: boolean;
  selectedFocus: string[];
  selectedYears: number[];
  selectedSupervisors: string[];
  sortedYears: number[];
  onToggleFocus: (field: string) => void;
  onToggleYear: (year: number) => void;
  onToggleSupervisor: (supervisor: string) => void;
  onClearAll: () => void;
  metadata?: {
    facets?: any;
    total?: number;
  };
  currentProjectsCount: number;
}

export default function ArchiveFilters({
  filterOptions,
  filterOptionsLoading,
  filterOptionsError,
  selectedFocus,
  selectedYears,
  selectedSupervisors,
  sortedYears,
  onToggleFocus,
  onToggleYear,
  onToggleSupervisor,
  onClearAll,
  metadata,
  currentProjectsCount,
}: ArchiveFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSupervisorOpen, setIsSupervisorOpen] = useState(false);
  const [supervisorSearch, setSupervisorSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeFiltersCount =
    selectedFocus.length + selectedYears.length + selectedSupervisors.length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSupervisorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSupervisors = filterOptions?.supervisors?.filter((s) =>
    s.name.toLowerCase().includes(supervisorSearch.toLowerCase()),
  );

  const FilterContent = (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">Filters</h2>

          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>

          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter sections */}
      <div className="space-y-7 pt-5">
        {/* RESEARCH FOCUS */}
        <section>
          <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">
            Research Focus
          </h3>

          {filterOptionsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-slate-200 rounded animate-pulse"
                />
              ))}
            </div>
          ) : filterOptionsError ? (
            <p className="text-xs text-red-500">Filter options could not be loaded.</p>
          ) : (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {filterOptions?.keywords?.map((focus: string) => (
                <FilterCheckbox
                  key={focus}
                  label={focus}
                  checked={selectedFocus.includes(focus)}
                  onChange={() => onToggleFocus(focus)}
                />
              ))}

              {(!filterOptions?.keywords ||
                filterOptions.keywords.length === 0) && (
                <p className="text-xs text-slate-400">No options available</p>
              )}
            </div>
          )}
        </section>

        {/* ACADEMIC YEAR */}
        <section>
          <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">
            Academic Year
          </h3>

          {filterOptionsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-slate-200 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {sortedYears?.map((year: number) => (
                <FilterCheckbox
                  key={year}
                  label={year.toString()}
                  checked={selectedYears.includes(year)}
                  onChange={() => onToggleYear(year)}
                />
              ))}

              {(!sortedYears || sortedYears.length === 0) && (
                <p className="text-xs text-slate-400">No options available</p>
              )}
            </div>
          )}
        </section>

        {/* SUPERVISOR DROPDOWN */}
        <section>
          <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">
            Supervisor
          </h3>

          {filterOptionsLoading ? (
            <div className="h-9 bg-slate-200 rounded-lg animate-pulse" />
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsSupervisorOpen((prev) => !prev)}
                className="w-full flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:border-slate-300 transition focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <span className="truncate">
                  {selectedSupervisors.length > 0
                    ? `${selectedSupervisors.length} selected`
                    : "Select Supervisor..."}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isSupervisorOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isSupervisorOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg z-30 p-2 space-y-2">
                  {/* Search input inside dropdown */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search supervisor..."
                      value={supervisorSearch}
                      onChange={(e) => setSupervisorSearch(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* List items */}
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {filteredSupervisors && filteredSupervisors.length > 0 ? (
                      filteredSupervisors.map((supervisor: Supervisor) => {
                        const isSelected = selectedSupervisors.includes(
                          supervisor.name,
                        );
                        return (
                          <div
                            key={supervisor.id}
                            onClick={() => onToggleSupervisor(supervisor.name)}
                            className={`flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer transition ${
                              isSelected
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="truncate">{supervisor.name}</span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 shrink-0" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 py-2 text-center">
                        No supervisor found
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Active Selected Tags display */}
              {selectedSupervisors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {selectedSupervisors.map((sup) => (
                    <span
                      key={sup}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                    >
                      <span className="max-w-32.5 truncate">{sup}</span>
                      <button
                        type="button"
                        onClick={() => onToggleSupervisor(sup)}
                        className="hover:text-red-500 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* FACETS */}
      {metadata?.total !== undefined && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="font-semibold text-slate-700">
              {currentProjectsCount}
            </strong>{" "}
            of{" "}
            <strong className="font-semibold text-slate-700">
              {metadata.total}
            </strong>{" "}
            results
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-semibold text-sm shadow-sm hover:border-slate-300 transition"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Filters</span>
          </div>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </button>
      </div>

      {/* Mobile Slide-over Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Layout Container */}
      <aside
        className={`
          fixed lg:sticky lg:top-24 inset-y-0 right-0 z-50 lg:z-10
          w-full sm:w-80 lg:w-auto
          bg-white lg:bg-transparent
          p-6 lg:p-0
          shadow-xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          lg:col-span-1
        `}
      >
        <div className="bg-white rounded-2xl lg:p-6 lg:border lg:border-slate-200 lg:shadow-sm">
          {FilterContent}
        </div>
      </aside>
    </>
  );
}
