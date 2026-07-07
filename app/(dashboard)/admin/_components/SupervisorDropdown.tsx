"use client";

import { useState, useRef, useEffect, JSX } from "react";
import { ChevronDown, Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { useInView } from "react-intersection-observer";

interface SupervisorDropdownProps {
  supervisors: Array<{ id: number; name: string; studentCount: number }>;
  selectedId: string;
  onSelect: (id: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  placeholder?: string;
}

export default function SupervisorDropdown({
  supervisors,
  selectedId,
  onSelect,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  placeholder = "Select Target Supervisor",
}: SupervisorDropdownProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && hasMore && onLoadMore && !isLoading) {
        onLoadMore();
      }
    },
  });

  const selectedSupervisor = supervisors.find(
    (s) => String(s.id) === selectedId,
  );

  const filteredSupervisors = supervisors.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      searchInputRef.current?.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          setIsOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredSupervisors.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredSupervisors[highlightedIndex]) {
            onSelect(String(filteredSupervisors[highlightedIndex].id));
            setIsOpen(false);
            setSearchQuery("");
            setHighlightedIndex(-1);
          }
          break;
        default:
          break;
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, filteredSupervisors, highlightedIndex]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  const handleSelectSupervisor = (id: number) => {
    onSelect(String(id));
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
  };

  return (
    <div ref={dropdownRef} className="relative w-full md:w-64">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 lg:px-4 py-1.5 md:py-2.5 text-xs lg:text-sm font-medium border rounded-lg transition-all",
          isOpen
            ? "border-indigo-300 bg-indigo-50 ring-2 ring-indigo-500/20"
            : "border-slate-200 bg-white hover:border-slate-300",
        )}
      >
        <span className="truncate text-left">
          {selectedSupervisor ? (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">
                  {selectedSupervisor.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  {selectedSupervisor.studentCount} students
                </p>
              </div>
            </div>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 ml-2 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Search Input */}
          <div className="sticky top-0 bg-white border-b border-slate-100 p-2.5">
            <div className="relative">
              <SearchIcon
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search supervisors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            className="max-h-64 overflow-y-auto"
            role="listbox"
          >
            {filteredSupervisors.length > 0 ? (
              filteredSupervisors.map((supervisor, index) => (
                <button
                  key={supervisor.id}
                  onClick={() => handleSelectSupervisor(supervisor.id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={String(supervisor.id) === selectedId}
                  className={cn(
                    "w-full px-3 py-2 lg:py-2.5 text-left transition-colors border-b border-slate-100 last:border-b-0",
                    index === highlightedIndex
                      ? "bg-indigo-50"
                      : "hover:bg-slate-50",
                    String(supervisor.id) === selectedId &&
                      "bg-indigo-100 border-l-2",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs lg:text-sm font-medium truncate",
                          String(supervisor.id) === selectedId
                            ? "text-indigo-900"
                            : "text-slate-900",
                        )}
                      >
                        {supervisor.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {supervisor.studentCount}{" "}
                        {supervisor.studentCount === 1 ? "student" : "students"}
                      </p>
                    </div>
                    {String(supervisor.id) === selectedId && (
                      <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-slate-500">
                {searchQuery
                  ? "No supervisors found"
                  : "No supervisors available"}
              </div>
            )}

            {/* Load More Trigger */}
            {hasMore && filteredSupervisors.length > 0 && (
              <div
                ref={loadMoreRef}
                className="px-3 py-2 text-center border-t border-slate-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-xs text-slate-500">Loading...</span>
                  </div>
                ) : (
                  <button
                    onClick={onLoadMore}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    Load more supervisors
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
