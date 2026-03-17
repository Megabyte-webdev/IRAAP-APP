"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
} from "lucide-react";

type SearchState = {
  title: string;
  year: string;
  researchArea: string;
  methodology: string;
};

export default function Hero() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const [searchState, setSearchState] = useState<SearchState>({
    title: "",
    year: "",
    researchArea: "",
    methodology: "",
  });

  // Count active filters (excluding title)
  const activeFilterCount = useMemo(() => {
    return Object.entries(searchState).filter(
      ([key, value]) => key !== "title" && value,
    ).length;
  }, [searchState]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    Object.entries(searchState).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    router.push(`/repository?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearFilters = () => {
    setSearchState({
      title: searchState.title, // preserve main search
      year: "",
      researchArea: "",
      methodology: "",
    });
  };

  return (
    <section className="relative bg-[#0f172a] text-white py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Discover Student Research Excellence
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Access a comprehensive repository of student research projects,
          fostering collaboration and innovation across disciplines.
        </p>

        <div className="bg-white/5 p-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-2">
            {/* 🔍 Main Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by title, keyword..."
                value={searchState.title}
                onChange={(e) =>
                  setSearchState({ ...searchState, title: e.target.value })
                }
                onKeyDown={handleKeyDown}
                className="w-full bg-white/10 text-white placeholder:text-slate-500 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              {/* 🎯 Filter Toggle with Count */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-2 px-4 py-4 rounded-xl font-medium transition-all ${
                  showFilters
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters</span>

                {/* Active Filter Count Badge */}
                {!showFilters && activeFilterCount > 0 && (
                  <span className="ml-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}

                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {/* 🚀 Search Button */}
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                Search
              </button>
            </div>
          </div>

          {/* 🔽 Filters */}
          {showFilters && (
            <div className="mt-4 border-t border-white/10 pt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Year */}
                <div>
                  <label className="label">Submission Year</label>
                  <input
                    type="number"
                    value={searchState.year}
                    onChange={(e) =>
                      setSearchState({
                        ...searchState,
                        year: e.target.value,
                      })
                    }
                    className="input"
                    placeholder="2026"
                  />
                </div>

                {/* Research Area */}
                <div>
                  <label className="label">Research Area</label>
                  <input
                    type="text"
                    value={searchState.researchArea}
                    onChange={(e) =>
                      setSearchState({
                        ...searchState,
                        researchArea: e.target.value,
                      })
                    }
                    className="input"
                    placeholder="AI, IoT..."
                  />
                </div>

                {/* Methodology */}
                <div>
                  <label className="label">Methodology</label>
                  <input
                    type="text"
                    value={searchState.methodology}
                    onChange={(e) =>
                      setSearchState({
                        ...searchState,
                        methodology: e.target.value,
                      })
                    }
                    className="input"
                    placeholder="Qualitative..."
                  />
                </div>
              </div>

              {/* 🧹 Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🎨 Reusable styles */}
      <style jsx>{`
        .label {
          display: block;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 0.4rem;
          margin-left: 0.25rem;
          text-transform: uppercase;
        }
        .input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
        }
      `}</style>
    </section>
  );
}
