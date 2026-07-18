"use client";

import React, { useState } from "react";
import { GraduationCap, ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  badgeIcon?: React.ReactNode;
  badgeText: string;
  title: string;
  description: string;
  variant?: "home" | "archive";
  // Search specific props
  onSearchSubmit?: (query: string) => void;
  searchPlaceholder?: string;
  trendingTags?: string[];
  onTagClick?: (tag: string) => void;
}

export default function Hero({
  badgeIcon = (
    <GraduationCap
      size={14}
      className="transition-transform duration-300 group-hover:rotate-6"
    />
  ),
  badgeText = "Exclusive to OOU Computer Engineering",
  title = "The Central Hub for OOU Computer Engineering Research",
  description = `Search thousands of past projects, manage your current drafts, and
collaborate seamlessly with your supervisor in one centralized, secure
environment designed specifically for engineering scholars.`,
  variant = "home",
  onSearchSubmit,
  searchPlaceholder = "Search projects by title, author, or keyword...",
  trendingTags = [],
  onTagClick,
}: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(searchQuery);
  };

  return (
    <div
      style={{
        background:
          "radial-gradient(105.7% 113.5% at 50% 0%, #EBF6FD 0%, #FFFFFF 70%)",
      }}
    >
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        {/* Universal Dynamic Badge */}
        <div className="inline-flex items-center space-x-1.5 rounded-xl border border-[#C2E3FA] px-3.5 py-1 text-[10px] md:text-xs font-semibold text-[#FFC107] mb-2.5 bg-white/60 backdrop-blur-sm transition-all duration-300 hover:border-primary hover:shadow-md hover:shadow-blue-100">
          {badgeIcon}
          <span>{badgeText}</span>
        </div>

        {/* Dynamic Typography Header Elements */}
        <h1 className="mx-auto max-w-4xl text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-black">
          {title}
        </h1>

        <p className="mt-6 mx-auto max-w-2xl text-base leading-relaxed text-gray-600">
          {description}
        </p>

        {/* --- VARIANT A: HOME PAGE ACTIONS & PREVIEW --- */}
        {variant === "home" && (
          <>
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="group w-full md:w-auto bg-primary text-white text-xs font-semibold px-7 py-4 rounded-md shadow-md shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-300 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary/30 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/archive"
                className="group w-full md:w-auto border border-primary bg-transparent text-primary text-xs font-semibold px-7 py-4 rounded-lg transition-all duration-300 hover:bg-primary/5 hover:border-primary hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Explore Global Archives</span>
              </Link>
            </div>

            {/* Dashboard Mockup Display */}
            <div className="mt-16 relative">
              <Image
                src="/dashboard_preview.png"
                alt="System Interface Preview"
                width={1200}
                height={700}
                className="w-full transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:drop-shadow-2xl"
                priority
              />
            </div>
          </>
        )}

        {/* --- VARIANT B: ARCHIVE PAGE LIVE SEARCH BAR --- */}
        {variant === "archive" && (
          <div className="mt-10 max-w-3xl mx-auto w-full">
            {/* Live Interactive Search Box Container */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center bg-white border border-slate-200 rounded-full py-1.5 pl-5 pr-2 shadow-md shadow-slate-100 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300"
            >
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent border-0 outline-none px-3 text-sm text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-[#38BDF8] hover:bg-blue-500 text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors duration-200 shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Trending Tag Filters Array */}
            {trendingTags.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-400 font-medium mr-1">
                  Trending:
                </span>
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onTagClick && onTagClick(tag)}
                    className="bg-white border border-slate-100 hover:border-primary/30 hover:bg-slate-50 text-slate-600 px-3.5 py-1.5 rounded-full shadow-xs transition-all duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
