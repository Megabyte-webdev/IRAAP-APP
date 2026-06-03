"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, BookOpen } from "lucide-react";

import useSearch from "../_hooks/use-search";

export default function RepositoryList({ searchParams }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const { getSearchResults } = useSearch();

  const [filters, setFilters] = useState({
    title: searchParams?.title || "",
    year: searchParams?.year || "",
    researchArea: searchParams?.researchArea || "",
    methodology: searchParams?.methodology || "",
  });

  const { data: results = [], isLoading } = getSearchResults(filters);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value?.trim()) {
          params.set(key, value);
        }
      });

      router.replace(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [filters, pathname, router]);

  return (
    <div className="min-h-screen bg-background">
      {" "}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}{" "}
        <div className="max-w-3xl mb-12">
          {" "}
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Research Repository{" "}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse academic research, theses, dissertations, and scholarly
            publications from across disciplines.
          </p>
        </div>
        {/* Search + Filters */}
        <div className="border rounded-2xl bg-card p-5 mb-10">
          <div className="flex items-center gap-3 border-b pb-4">
            <Search size={18} className="text-muted-foreground" />

            <input
              value={filters.title}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Search by title, keyword, author..."
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <input
              value={filters.researchArea}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  researchArea: e.target.value,
                }))
              }
              placeholder="Research Area"
              className="
            h-11
            px-4
            rounded-xl
            border
            bg-background
            outline-none
            focus:ring-2
            focus:ring-neutral-300
            dark:focus:ring-neutral-700
          "
            />

            <input
              value={filters.methodology}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  methodology: e.target.value,
                }))
              }
              placeholder="Methodology"
              className="
            h-11
            px-4
            rounded-xl
            border
            bg-background
            outline-none
            focus:ring-2
            focus:ring-neutral-300
            dark:focus:ring-neutral-700
          "
            />

            <input
              value={filters.year}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  year: e.target.value,
                }))
              }
              placeholder="Year"
              className="
            h-11
            px-4
            rounded-xl
            border
            bg-background
            outline-none
            focus:ring-2
            focus:ring-neutral-300
            dark:focus:ring-neutral-700
          "
            />
          </div>
        </div>
        {/* Results */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${results.length} result${results.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {/* Loading */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="
                border
                rounded-2xl
                p-6
                bg-card
              "
              >
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />

                <div className="h-6 mt-5 rounded bg-muted animate-pulse" />

                <div className="h-4 mt-4 rounded bg-muted animate-pulse" />

                <div className="h-4 mt-2 w-3/4 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        )}
        {/* Empty */}
        {!isLoading && results.length === 0 && (
          <div className="text-center py-24">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-5 text-xl font-medium">No research found</h3>

            <p className="mt-2 text-muted-foreground">
              Try changing your search criteria.
            </p>
          </div>
        )}
        {/* Results Grid */}
        {!isLoading && results.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item: any) => (
              <article
                key={item.id}
                className="
                rounded-2xl
                border
                bg-card
                p-6
                hover:shadow-md
                transition-all
              "
              >
                <div className="text-sm text-muted-foreground">
                  {item.category}
                </div>

                <h2 className="mt-3 text-xl font-semibold leading-tight">
                  <Link href={`/repository/${item.id}`}>{item.title}</Link>
                </h2>

                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                  {item.abstract}
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>{item.researchArea}</span>

                  <span>{item.submissionYear}</span>
                </div>

                <Link
                  href={`/repository/${item.id}`}
                  className="
                  mt-6
                  inline-flex
                  text-sm
                  font-medium
                "
                >
                  Read research →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
