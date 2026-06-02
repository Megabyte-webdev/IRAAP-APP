"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [searchState, setSearchState] = useState({
    title: "",
    year: "",
    researchArea: "",
    methodology: "",
  });

  // Track mouse for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const activeFilterCount = useMemo(() => {
    const { title, ...rest } = searchState;
    return Object.values(rest).filter(Boolean).length;
  }, [searchState]);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    const params = new URLSearchParams();
    Object.entries(searchState).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    setTimeout(() => {
      router.push(`/repository?${params.toString()}`);
      setIsSearching(false);
    }, 600);
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

  const suggestedSearches = [
    "Machine Learning",
    "Quantum Computing",
    "Biomedical Research",
    "Climate Science",
  ];

  return (
    <section className="relative pt-56 pb-32 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0f1f] via-[#0f1626] to-[#0a0f1f] overflow-hidden selection:bg-blue-600/30">
      {/* Premium Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient blooms */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl opacity-30" />

        {/* Grid background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] invert pointer-events-none" />

        {/* Spotlight effect */}
        <div
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: "translate(-50%, -50%)",
            opacity: isFocused ? 0.3 : 0.1,
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-16 items-start px-6 lg:px-10">
        {/* LEFT: Premium Branding */}
        <div className="lg:col-span-5 pt-4 space-y-8">
          {/* Version Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-blue-400/20 rounded-full group hover:border-blue-400/40 transition-all duration-500 cursor-default">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[9px] font-mono text-blue-300/70 group-hover:text-blue-300 transition-colors">
              v2.4.1 — Live Index
            </span>
          </div>

          {/* Hero Headline - Premium Typography */}
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-white leading-[0.9] group">
              <span className="block">Search</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 font-light italic">
                the Archive.
              </span>
            </h1>
          </div>

          {/* Description - Premium Typography */}
          <p className="max-w-md text-slate-400 text-lg leading-relaxed font-light border-l-2 border-blue-500/40 pl-6 hover:border-blue-500/70 transition-all duration-500">
            Access a{" "}
            <span className="text-white font-semibold">high-performance</span>{" "}
            repository for advanced research. Engineered for precision and{" "}
            <span className="text-cyan-400">scholarly impact</span>.
          </p>

          {/* Stats Display - Premium Version */}
          <div className="flex items-center gap-12 pt-8">
            <div className="group">
              <p className="text-4xl font-mono font-semibold text-white tabular-nums tracking-tighter group-hover:text-blue-300 transition-colors">
                4,802+
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold group-hover:text-blue-400 transition-colors">
                Records Indexed
              </p>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
            <div className="group">
              <p className="text-4xl font-mono font-semibold text-white tabular-nums tracking-tighter group-hover:text-cyan-300 transition-colors">
                12ms
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold group-hover:text-cyan-400 transition-colors">
                Query Latency
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Premium Search Console */}
        <div className="lg:col-span-7">
          {/* Outer glow border */}
          <div
            className={`relative p-px rounded-3xl transition-all duration-700 group ${
              isFocused
                ? "shadow-2xl shadow-blue-500/20"
                : "shadow-xl shadow-blue-900/10"
            }`}
            style={{
              background: isFocused
                ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                : "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.1))",
            }}
          >
            {/* Inner card */}
            <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl rounded-[1.75rem] p-10 border border-white/10 space-y-8">
              {/* Header with Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 px-3 py-1.5 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-500/30">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-300 uppercase tracking-tight">
                    Active Connection
                  </span>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-widest px-4 py-2.5 rounded-lg border backdrop-blur-md ${
                    showFilters
                      ? "bg-white/10 border-blue-400/40 text-white shadow-lg shadow-blue-500/20"
                      : "bg-white/5 border-white/20 text-slate-300 hover:border-blue-400/40 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <SlidersHorizontal size={14} />
                  {showFilters ? "Close" : "Refine"}
                </button>
              </div>

              {/* Main Search Input - Premium */}
              <div className="relative group/search">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isFocused
                      ? "text-blue-400 scale-110"
                      : "text-slate-500 scale-100"
                  }`}
                  size={24}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search by title, author, or keyword..."
                  value={searchState.title}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) =>
                    setSearchState((p) => ({ ...p, title: e.target.value }))
                  }
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-b border-white/10 py-6 pl-14 pr-4 text-2xl font-light text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400/50 transition-all focus:bg-white/5"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700/50 bg-white/5 text-[9px] text-slate-400 font-mono opacity-0 group-focus-within/search:opacity-100 transition-opacity">
                  <Command size={10} /> K
                </div>
              </div>

              {/* Expandable Filter Panel - Premium */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  showFilters
                    ? "max-h-96 opacity-100 mb-4 mt-6"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid grid-cols-2 gap-6 p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                  {/* Research Domain */}
                  <div className="col-span-2 space-y-3 group/field">
                    <label className="text-[9px] font-bold text-blue-300/70 uppercase tracking-[0.2em] ml-1 group-focus-within/field:text-blue-300 transition-colors">
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
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
                    />
                  </div>

                  {/* Year */}
                  <div className="space-y-3 group/field">
                    <label className="text-[9px] font-bold text-blue-300/70 uppercase tracking-[0.2em] ml-1 group-focus-within/field:text-blue-300 transition-colors">
                      Year
                    </label>
                    <input
                      type="number"
                      placeholder="2026"
                      value={searchState.year}
                      onChange={(e) =>
                        setSearchState((p) => ({ ...p, year: e.target.value }))
                      }
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
                    />
                  </div>

                  {/* Methodology */}
                  <div className="space-y-3 group/field">
                    <label className="text-[9px] font-bold text-blue-300/70 uppercase tracking-[0.2em] ml-1 group-focus-within/field:text-blue-300 transition-colors">
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
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Suggested Searches */}
              {!showFilters && searchState.title === "" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest">
                    Try searching:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() =>
                          setSearchState((p) => ({ ...p, title: search }))
                        }
                        className="px-3 py-2 text-[10px] font-bold uppercase bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/40 text-slate-300 hover:text-blue-300 rounded-lg transition-all duration-300"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button - Premium */}
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white py-6 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 active:scale-[0.98] shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-400/40 overflow-hidden"
              >
                {isSearching && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                )}
                <span className="relative flex items-center gap-3">
                  {isSearching ? "Searching..." : "Execute Query"}
                  <ArrowRight
                    size={18}
                    className={`transition-all duration-300 ${
                      isSearching
                        ? "translate-x-1"
                        : "group-hover:translate-x-2"
                    }`}
                  />
                </span>
              </button>

              {/* Console Footer - Premium */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <Cpu size={12} className="text-blue-400/50" />
                    <span>Node: 01-A</span>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-cyan-400 transition-colors uppercase"
                    >
                      <RotateCcw size={12} />
                      Reset ({activeFilterCount})
                    </button>
                  )}
                </div>
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                  © 2026 IRAP_OS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
