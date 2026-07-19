"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
interface ArchiveHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilterClick: () => void;
}

export default function ArchiveHeader({
  searchQuery,
  setSearchQuery,
  onFilterClick,
}: ArchiveHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <motion.header className="backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 pt-10">
        {/* Hero Section - Collapses on scroll */}
        <motion.div className="overflow-hidden text-center mb-4">
          <motion.h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Explore the Institutional Archive
          </motion.h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Search thousands of approved theses, journals and projects.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <div
          className="
            flex
            items-center
            gap-3
            w-full
            max-w-3xl
            mx-auto
          "
        >
          <div
            className="
              relative
              flex-1
              bg-white
              dark:bg-slate-900
              border
              border-slate-200
              dark:border-slate-800
              rounded-full
              shadow-sm
              hover:shadow-md
              transition-shadow
            "
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="
                w-full
                py-3
                pl-5
                pr-12
                rounded-full
                outline-none
                text-sm
                bg-transparent
                text-slate-900
                dark:text-slate-50
                placeholder-slate-400
                dark:placeholder-slate-500
              "
            />

            <button
              className="
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                bg-sky-500
                hover:bg-sky-600
                text-white
                rounded-full
                p-2
                transition-colors
              "
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <button
            className="
              flex
              items-center
              gap-2
              bg-white
              dark:bg-slate-900
              border
              border-slate-200
              dark:border-slate-800
              hover:bg-slate-50
              dark:hover:bg-slate-800
              rounded-full
              px-4
              py-2.5
              text-sm
              text-slate-700
              dark:text-slate-300
              transition-colors
            "
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>
    </motion.header>
  );
}
