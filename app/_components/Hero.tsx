"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowRight, RotateCcw } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchState, setSearchState] = useState({
    title: "",
    year: "",
    researchArea: "",
    methodology: "",
  });

  const activeFilterCount = useMemo(() => {
    return Object.values(searchState).filter(Boolean).length;
  }, [searchState]);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    Object.entries(searchState).forEach(([key, value]) => {
      if (value.trim()) {
        params.set(key, value);
      }
    });

    return params.toString();
  }, [searchState]);

  const handleSearch = useCallback(() => {
    setIsSearching(true);

    const query = buildQueryString();

    setTimeout(() => {
      router.push(`/repository?${query}`);
      setIsSearching(false);
    }, 400);
  }, [router, buildQueryString]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const resetFilters = () => {
    setSearchState({
      title: searchState.title, // keep main search
      year: "",
      researchArea: "",
      methodology: "",
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 pt-28 pb-10">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
          Discover Academic Research
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Search thousands of research papers, theses, dissertations and
          scholarly publications.
        </p>
      </div>

      {/* SEARCH CONTAINER */}
      <div className="mt-12 rounded-2xl border bg-card p-6 space-y-6">
        {/* MAIN SEARCH */}
        <div className="flex items-center gap-3">
          <Search className="text-muted-foreground" size={20} />

          <input
            value={searchState.title}
            onChange={(e) =>
              setSearchState((p) => ({ ...p, title: e.target.value }))
            }
            onKeyDown={handleKeyDown}
            placeholder="Search by title, keyword, author..."
            className="w-full bg-transparent outline-none text-lg"
          />

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-5 py-2 rounded-lg bg-foreground text-background font-medium flex items-center gap-2"
          >
            {isSearching ? "Searching..." : "Search"}
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => setShowFilters((s) => !s)}
            className="p-2 rounded-lg border"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* FILTERS */}
        {showFilters && (
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <input
              placeholder="Year (e.g. 2025)"
              value={searchState.year}
              onChange={(e) =>
                setSearchState((p) => ({ ...p, year: e.target.value }))
              }
              className="border rounded-lg px-3 py-2 bg-transparent"
            />

            <input
              placeholder="Research Area"
              value={searchState.researchArea}
              onChange={(e) =>
                setSearchState((p) => ({
                  ...p,
                  researchArea: e.target.value,
                }))
              }
              className="border rounded-lg px-3 py-2 bg-transparent"
            />

            <input
              placeholder="Methodology"
              value={searchState.methodology}
              onChange={(e) =>
                setSearchState((p) => ({
                  ...p,
                  methodology: e.target.value,
                }))
              }
              className="border rounded-lg px-3 py-2 bg-transparent"
            />
          </div>
        )}

        {/* SUGGESTIONS */}
        {/* {!searchState.title && (
          <div className="flex flex-wrap gap-2 pt-2">
            {suggestedSearches.map((item) => (
              <button
                key={item}
                onClick={() => setSearchState((p) => ({ ...p, title: item }))}
                className="px-3 py-1 text-sm rounded-full border hover:bg-muted transition"
              >
                {item}
              </button>
            ))}
          </div>
        )} */}

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
          <div>Active filters: {activeFilterCount}</div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-red-500"
            >
              <RotateCcw size={14} />
              Reset filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
