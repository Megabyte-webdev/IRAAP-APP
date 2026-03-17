"use client";

import { useSearchParams } from "next/navigation";
import useSearch from "../_hooks/use-search";
import { BookOpen, Calendar, Tag, ExternalLink } from "lucide-react";

export default function RepositoryPage() {
  const searchParams = useSearchParams();
  const { getSearchResults } = useSearch();

  // Extract all metadata parameters from the URL
  const searchFilters = {
    title: searchParams.get("title") || "",
    year: searchParams.get("year") || "",
    researchArea: searchParams.get("researchArea") || "",
    methodology: searchParams.get("methodology") || "",
  };

  // Pass the entire object to your hook
  const { data: results = [], isLoading } = getSearchResults(searchFilters);

  // Accessing the nested array from your JSON structure

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Research Repository
            </h1>
            <p className="text-slate-500 mt-1">
              Explore student projects and academic research.
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
            <span className="text-sm text-slate-500">Results for: </span>
            <span className="text-sm font-semibold text-blue-600">
              "{searchFilters.title || "All Projects"}"
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Results Feed */}
          <div className="lg:col-span-4 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-slate-200 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : results?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-medium text-slate-900">
                  No projects found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            ) : (
              results.map((item: any) => (
                <article
                  key={item.projects.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div className="flex flex-col gap-4">
                    {/* Top Row: Category & Year */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                        {item.categories.name}
                      </span>
                      <div className="flex items-center text-slate-400 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {item.projects.submissionYear}
                      </div>
                    </div>

                    {/* Title & Abstract */}
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {item.projects.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed line-clamp-3">
                        {item.projects.abstract}
                      </p>
                    </div>

                    {/* Keywords / Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Tag className="h-4 w-4 text-slate-400 self-center mr-1" />
                      {item.metadata.keywords
                        .split(",")
                        .map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                    </div>

                    {/* Footer: Research Area & Action */}
                    <div className="pt-6 mt-2 border-t border-slate-50 flex items-center justify-between">
                      <div className="text-xs text-slate-400 italic">
                        Area: {item.metadata.researchArea}
                      </div>
                      <a
                        href={item.projects.fileUrl}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Full Project
                      </a>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
