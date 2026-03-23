"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  BookOpen,
  Calendar,
  Microscope,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import useSearch from "@/app/_hooks/use-search";
import debounce from "lodash.debounce";

export default function AdminArchiveContent({ initialParams }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 1. Local input state (for immediate typing feedback)
  const [filters, setFilters] = useState({
    title: initialParams.get("title") || "",
    year: initialParams.get("year") || "",
    researchArea: initialParams.get("researchArea") || "",
    methodology: initialParams.get("methodology") || "",
  });

  const { getSearchResults } = useSearch();
  const { data: projects = [], isLoading } = getSearchResults({
    title: initialParams.get("title") || "",
    year: initialParams.get("year") || "",
    researchArea: initialParams.get("researchArea") || "",
    methodology: initialParams.get("methodology") || "",
  });

  const debouncedUpdateUrl = useMemo(
    () =>
      debounce((currentParams: URLSearchParams) => {
        router.push(`${pathname}?${currentParams.toString()}`, {
          scroll: false,
        });
      }, 500),

    [router, pathname],
  );
  useEffect(() => {
    return () => {
      debouncedUpdateUrl.cancel();
    };
  }, [debouncedUpdateUrl]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));

    const params = new URLSearchParams(initialParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);

    debouncedUpdateUrl(params);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Research Archive
        </h1>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <SlidersHorizontal size={16} />
          {showAdvanced ? "Hide Advanced" : "Advanced Search"}
        </button>
      </div>

      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by project title..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          value={filters.title}
          onChange={(e) => handleFilterChange("title", e.target.value)}
        />
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2">
          <FilterInput
            label="Year"
            icon={Calendar}
            value={filters.year}
            type="number"
            onChange={(v: string) => handleFilterChange("year", v)}
          />
          <FilterInput
            label="Area"
            icon={BookOpen}
            value={filters.researchArea}
            onChange={(v: string) => handleFilterChange("researchArea", v)}
          />
          <FilterInput
            label="Method"
            icon={Microscope}
            value={filters.methodology}
            onChange={(v: string) => handleFilterChange("methodology", v)}
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs font-bold text-slate-500 uppercase">
              <th className="px-6 py-4">Project Details</th>
              <th className="px-6 py-4">Research Area</th>
              <th className="px-6 py-4 text-right">Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-12 text-center">
                  <Loader2 className="animate-spin inline text-blue-500" />
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-12 text-center text-slate-400 font-medium"
                >
                  No archived projects found.
                </td>
              </tr>
            ) : (
              projects.map((p: any) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {p.category || "Uncategorized"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[11px] font-semibold uppercase tracking-wider">
                      {p.researchArea || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-slate-500 italic">
                    {p.submissionYear}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterInput({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
}: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
          size={14}
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500/10 outline-none"
        />
      </div>
    </div>
  );
}
