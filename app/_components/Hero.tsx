"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  // State for all metadata-driven fields
  const [searchState, setSearchState] = useState({
    title: "",
    year: "",
    researchArea: "",
    methodology: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Only append non-empty fields to the URL
    if (searchState.title) params.append("title", searchState.title);
    if (searchState.year) params.append("year", searchState.year);
    if (searchState.researchArea)
      params.append("researchArea", searchState.researchArea);
    if (searchState.methodology)
      params.append("methodology", searchState.methodology);

    router.push(`/repository?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative bg-[#0f172a] text-white py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          University <span className="text-blue-500">Research</span> Hub
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Access a comprehensive database of student projects, powered by
          intelligent metadata search.
        </p>

        <div className="bg-white/5 p-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-2">
            {/* Primary Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by project title..."
                value={searchState.title}
                onChange={(e) =>
                  setSearchState({ ...searchState, title: e.target.value })
                }
                onKeyDown={handleKeyDown}
                className="w-full bg-white/10 text-white placeholder:text-slate-500 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex gap-2">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-4 rounded-xl font-medium transition-all ${
                  showFilters
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters</span>
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {/* Main Search Button */}
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                Search
              </button>
            </div>
          </div>

          {/* Expanded Metadata Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mt-2 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-left text-xs font-semibold text-slate-400 uppercase mb-2 ml-1">
                  Submission Year
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2026"
                  value={searchState.year}
                  onChange={(e) =>
                    setSearchState({ ...searchState, year: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-left text-xs font-semibold text-slate-400 uppercase mb-2 ml-1">
                  Research Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. IoT, AI"
                  value={searchState.researchArea}
                  onChange={(e) =>
                    setSearchState({
                      ...searchState,
                      researchArea: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-left text-xs font-semibold text-slate-400 uppercase mb-2 ml-1">
                  Methodology
                </label>
                <input
                  type="text"
                  placeholder="e.g. Qualitative"
                  value={searchState.methodology}
                  onChange={(e) =>
                    setSearchState({
                      ...searchState,
                      methodology: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
