"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const [query, setQuery] = useState("");

  return (
    <section className="max-w-5xl mx-auto px-6 pt-28 pb-10">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">
          Discover Academic Research
        </h1>

        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Search thousands of research papers, theses, dissertations and
          scholarly publications across disciplines.
        </p>
      </div>

      <div className="mt-12 rounded-2xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <Search className="text-muted-foreground" size={20} />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search research..."
            className="w-full bg-transparent outline-none"
          />

          <button
            onClick={() => router.push(`/repository?title=${query}`)}
            className="px-5 py-2 rounded-lg bg-foreground text-background"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
