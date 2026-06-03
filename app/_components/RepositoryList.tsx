"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSearch from "../_hooks/use-search";
import {
  BookOpen,
  Calendar,
  X,
  Check,
  ArrowUpRight,
  Database,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function RepositoryList({ searchParams }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { getSearchResults } = useSearch();

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const searchFilters = {
    title: searchParams?.title || "",
    year: searchParams?.year || "",
    researchArea: searchParams?.researchArea || "",
    methodology: searchParams?.methodology || "",
  };

  const { data: results = [], isLoading } = getSearchResults(searchFilters);

  // ---------------- URL HANDLER (SAFE MERGE) ----------------
  const buildParams = (base: any, updates: Record<string, string | null>) => {
    const params = new URLSearchParams();

    Object.entries(base || {}).forEach(([k, v]) => {
      if (v) params.set(k, v as string);
    });

    Object.entries(updates).forEach(([k, v]) => {
      if (v && v.trim()) params.set(k, v);
      else params.delete(k);
    });

    return params.toString();
  };

  const updateFilter = (key: string, value: string) => {
    const query = buildParams(searchParams, { [key]: value });
    router.push(`${pathname}?${query}`);
    setEditingKey(null);
  };

  const removeFilter = (key: string) => {
    const query = buildParams(searchParams, { [key]: "" });
    router.push(`${pathname}?${query}`);
  };

  const allFilters = Object.entries(searchFilters).map(([key, value]) => ({
    key,
    label: key.replace(/([A-Z])/g, " $1").toLowerCase(),
    value,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Database className="w-4 h-4" />
            <span>Academic Archive Index</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold mt-3 tracking-tight">
            Research Repository
          </h1>

          <p className="mt-3 text-muted-foreground max-w-2xl">
            Structured academic archive — query, filter, and inspect research
            records.
          </p>
        </div>

        {/* ================= FILTER CONSOLE (UPGRADED) ================= */}
        <div className="mb-10 border border-border bg-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4 text-xs uppercase tracking-widest text-muted-foreground">
            <Filter className="w-4 h-4" />
            Active Index Filters
          </div>

          <div className="flex flex-wrap gap-3">
            {allFilters.map((filter) => {
              const isActive = Boolean(filter.value);

              return (
                <div
                  key={filter.key}
                  className={[
                    "flex items-center rounded-full border overflow-hidden transition-all",
                    "hover:border-blue-400/40",
                    isActive
                      ? "bg-muted border-border"
                      : "opacity-60 border-border bg-transparent",
                  ].join(" ")}
                >
                  {/* LABEL */}
                  <span className="px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">
                    {filter.label}
                  </span>

                  {/* VALUE / EDIT MODE */}
                  {editingKey === filter.key ? (
                    <div className="flex items-center px-2">
                      <input
                        autoFocus
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          updateFilter(filter.key, tempValue)
                        }
                        className="bg-transparent outline-none text-sm w-28 text-blue-500"
                      />

                      <button
                        onClick={() => updateFilter(filter.key, tempValue)}
                      >
                        <Check className="w-3.5 h-3.5 text-green-500 ml-1" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span
                        onClick={() => {
                          setEditingKey(filter.key);
                          setTempValue(filter.value);
                        }}
                        className={[
                          "px-3 py-1 text-sm cursor-text transition",
                          "hover:bg-muted",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground italic",
                        ].join(" ")}
                      >
                        {filter.value || "Any"}
                      </span>

                      {isActive && (
                        <button
                          onClick={() => removeFilter(filter.key)}
                          className="px-2 hover:text-red-500 transition"
                        >
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= GRID ARCHIVE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* LOADING */}
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-muted animate-pulse"
              />
            ))}

          {/* EMPTY STATE */}
          {!isLoading && results.length === 0 && (
            <div className="col-span-full text-center py-20 border border-dashed border-border rounded-2xl">
              <BookOpen className="mx-auto w-10 h-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No records found</h3>
              <p className="text-muted-foreground mt-1">
                Adjust filters or broaden your search scope.
              </p>
            </div>
          )}

          {/* CARDS */}
          {!isLoading &&
            results.map((item: any) => (
              <article
                key={item.id}
                className="group rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* META */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="uppercase tracking-widest">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.submissionYear}
                  </div>
                </div>

                {/* TITLE */}
                <h2 className="mt-3 text-lg font-semibold group-hover:text-blue-500 transition-colors">
                  <Link href={`/repository/${item.id}`}>{item.title}</Link>
                </h2>

                {/* ABSTRACT */}
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {item.abstract}
                </p>

                {/* FOOTER */}
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate max-w-[60%]">
                    {item.researchArea}
                  </span>

                  <Link
                    href={`/repository/${item.id}`}
                    className="flex items-center gap-1 font-medium hover:text-blue-500 transition-colors"
                  >
                    Open
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
        </div>
      </div>
    </div>
  );
}
