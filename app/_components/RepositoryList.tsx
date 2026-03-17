"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSearch from "../_hooks/use-search";
import {
  BookOpen,
  Calendar,
  Search,
  X,
  Check,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function RepositoryList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { getSearchResults } = useSearch();

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const searchFilters = {
    title: searchParams.get("title") || "",
    year: searchParams.get("year") || "",
    researchArea: searchParams.get("researchArea") || "",
    methodology: searchParams.get("methodology") || "",
  };

  const { data: results = [], isLoading } = getSearchResults(searchFilters);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
    setEditingKey(null);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Removed the .filter() so all keys show up
  const allFilters = Object.entries(searchFilters).map(([key, value]) => ({
    key,
    label: key.replace(/([A-Z])/g, " $1").toLowerCase(),
    value: value,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Research Repository
            </h1>
            <p className="text-slate-500 mt-1">
              Explore student projects and academic research.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Search className="h-4 w-4" />
              <span>Search Parameters:</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-start md:justify-end">
              {allFilters.map((filter) => (
                <div
                  key={filter.key}
                  className={`flex items-center border rounded-full shadow-sm overflow-hidden transition-all ${
                    filter.value
                      ? "bg-white border-blue-100"
                      : "bg-slate-100 border-slate-200 opacity-80"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider text-slate-600 pl-3 pr-2 font-bold bg-slate-50 border-r py-1.5">
                    {filter.label}
                  </span>

                  {editingKey === filter.key ? (
                    <div className="flex items-center px-2 py-1">
                      <input
                        autoFocus
                        placeholder="Type to search..."
                        className="text-sm font-semibold text-blue-600 outline-none w-32 bg-blue-50/50 rounded px-1"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          updateFilter(filter.key, tempValue)
                        }
                        onBlur={() => updateFilter(filter.key, tempValue)}
                      />
                      <button
                        onClick={() => updateFilter(filter.key, tempValue)}
                      >
                        <Check className="h-3.5 w-3.5 text-green-500 ml-1" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-semibold px-3 py-1 cursor-text hover:bg-blue-50 transition-colors ${
                          filter.value
                            ? "text-blue-600"
                            : "text-slate-400 italic"
                        }`}
                        onClick={() => {
                          setEditingKey(filter.key);
                          setTempValue(filter.value);
                        }}
                      >
                        {filter.value || "Any"}
                      </span>
                      {filter.value && (
                        <button
                          onClick={() => removeFilter(filter.key)}
                          className="pr-2 pl-1 group"
                        >
                          <X className="h-3.5 w-3.5 text-slate-300 group-hover:text-red-500 transition-colors" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-slate-200 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">
                No matches found
              </h3>
              <p className="text-slate-500">
                Try adjusting your search criteria or explore the full
                repository.
              </p>
            </div>
          ) : (
            results.map((item: any) => (
              <article
                key={item.projects.id}
                className="group relative flex flex-col bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {item.categories.name}
                  </span>
                  <div className="flex items-center text-slate-400 text-xs">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {item.projects.submissionYear}
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors mb-2">
                    <Link
                      href={`/repository/${item.projects.id}`}
                      className="hover:underline"
                    >
                      {item.projects.title}
                    </Link>
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                    {item.projects.abstract}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[180px]">
                    <span className="uppercase opacity-60 mr-1">Area:</span>
                    {item.metadata.researchArea}
                  </span>

                  <Link
                    href={`/repository/${item.projects.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                  >
                    Details
                    <ArrowUpRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
