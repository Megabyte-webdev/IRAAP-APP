"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ArrowRight,
  Database,
  Fingerprint,
  Cpu,
  Command,
} from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchState, setSearchState] = useState({
    title: "",
    year: "",
    researchArea: "",
    methodology: "",
  });

  const activeFilterCount = useMemo(() => {
    const { title, ...rest } = searchState;
    return Object.values(rest).filter(Boolean).length;
  }, [searchState]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(searchState).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    router.push(`/repository?${params.toString()}`);
  }, [searchState, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  const resetFilters = () => {
    setSearchState({
      title: searchState.title,
      year: "",
      researchArea: "",
      methodology: "",
    });
  };

  return (
    <section className="relative pt-52 pb-32 flex flex-col items-center justify-center bg-slate-50 overflow-hidden selection:bg-blue-600/10">
      {/* Structural Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#3b82f605,transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] invert pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-16 items-start px-10">
        {/* Left: Branding & Narrative */}
        <div className="lg:col-span-5 pt-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
              <Database size={16} className="text-blue-600" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
              V2.4 — Academic Index
            </span>
          </div>

          <h1 className="text-7xl xl:text-8xl font-light tracking-tight text-slate-900 mb-8 leading-[0.85]">
            Search <br />
            <span className="text-slate-400 italic font-serif">the</span>{" "}
            Archive.
          </h1>

          <p className="max-w-md text-slate-500 text-lg leading-relaxed font-light border-l border-slate-200 pl-6 mb-12">
            Access a high-performance repository for advanced research.
            Engineered for precision and scholarly impact.
          </p>

          <div className="flex items-center gap-10">
            <div>
              <p className="text-2xl font-mono text-slate-900">4,802</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Records
              </p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <p className="text-2xl font-mono text-slate-900">12ms</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Latency
              </p>
            </div>
          </div>
        </div>

        {/* Right: The Search Console */}
        <div className="lg:col-span-7">
          <div
            className={`relative p-px rounded-[2.5rem] transition-all duration-700 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] ${
              isFocused ? "bg-blue-500/20" : "bg-slate-200"
            }`}
          >
            <div className="bg-white rounded-[2.4rem] p-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                  <Fingerprint size={12} className="text-blue-600" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tight">
                    Secure Access
                  </span>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-widest px-4 py-2 rounded-full border ${
                    showFilters
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900"
                  }`}
                >
                  <SlidersHorizontal size={14} />
                  {showFilters ? "Close Params" : "Refine Search"}
                </button>
              </div>

              {/* Main Search Input */}
              <div className="relative mb-6">
                <Search
                  className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? "text-blue-600" : "text-slate-300"}`}
                  size={22}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search by title..."
                  value={searchState.title}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) =>
                    setSearchState((p) => ({ ...p, title: e.target.value }))
                  }
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-b border-slate-100 py-6 pl-10 text-2xl font-light text-slate-900 placeholder:text-slate-200 focus:outline-none focus:border-blue-600 transition-all"
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 rounded border border-slate-100 bg-slate-50 text-[9px] text-slate-400 font-mono">
                  <Command size={10} /> K
                </div>
              </div>

              {/* Expandable Filter Bay */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  showFilters
                    ? "max-h-100 opacity-100 mb-8 mt-6"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid grid-cols-2 gap-6 p-8 bg-slate-50 border border-slate-100 rounded-3xl">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                      Research Domain
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bio-Engineering"
                      value={searchState.researchArea}
                      onChange={(e) =>
                        setSearchState((p) => ({
                          ...p,
                          researchArea: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-600 focus:outline-none focus:border-blue-600/40 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                      Year
                    </label>
                    <input
                      type="number"
                      placeholder="2026"
                      value={searchState.year}
                      onChange={(e) =>
                        setSearchState((p) => ({ ...p, year: e.target.value }))
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-600 focus:outline-none focus:border-blue-600/40 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                      Methodology
                    </label>
                    <input
                      type="text"
                      placeholder="Qualitative"
                      value={searchState.methodology}
                      onChange={(e) =>
                        setSearchState((p) => ({
                          ...p,
                          methodology: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-600 focus:outline-none focus:border-blue-600/40 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSearch}
                className="w-full group bg-slate-900 text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all duration-500 active:scale-[0.98] shadow-lg shadow-slate-900/10"
              >
                Execute Search
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              {/* Console Footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <Cpu size={12} />
                    <span>Node: 01-A</span>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase"
                    >
                      <RotateCcw size={12} />
                      Reset ({activeFilterCount})
                    </button>
                  )}
                </div>
                <span className="text-[9px] font-mono text-slate-300 uppercase tracking-widest">
                  © 2026 CORE_OS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
