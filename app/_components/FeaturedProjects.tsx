"use client";

import {
  ArrowUpRight,
  BookOpen,
  Layers,
  Sparkles,
  Eye,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FeaturedProjects({ projects }: any) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative py-32 bg-linear-to-b from-[#0a0f1f] via-transparent to-[#0a0f1f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header Section - Premium */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl space-y-6">
            {/* Accent Line */}
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-blue-600 to-transparent" />
              <span className="text-xs font-bold tracking-[0.3em] text-blue-400 uppercase">
                Curated Collection
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.1]">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Research
              </span>
            </h2>

            {/* Subheading */}
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl font-light">
              Showcasing innovation and{" "}
              <span className="text-white">academic excellence</span> through
              high-impact research initiatives from leading institutions.
            </p>
          </div>

          {/* CTA Link */}
          <Link
            href="/repository"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold text-blue-400 hover:text-white border border-blue-400/30 hover:border-blue-400/60 bg-white/5 hover:bg-blue-500/10 transition-all duration-500 whitespace-nowrap"
          >
            <span>Explore Full Repository</span>
            <div className="flex items-center justify-center h-8 w-8 rounded-lg border border-blue-400/30 group-hover:border-blue-400/60 group-hover:bg-blue-500/20 transition-all duration-500">
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Projects Grid - Premium */}
        {projects?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any, idx: number) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-2xl transition-all duration-500"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Premium Border Glow */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                {/* Main Card */}
                <article
                  className={`relative h-full flex flex-col bg-gradient-to-br from-white/8 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 transition-all duration-500 ${
                    hoveredId === project.id
                      ? "border-blue-400/40 shadow-2xl shadow-blue-500/10"
                      : "hover:border-blue-400/20 shadow-lg shadow-blue-900/5"
                  }`}
                >
                  {/* Top Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />

                  {/* Content */}
                  <div className="relative z-10 space-y-6 flex-1">
                    {/* Category Badge - Premium */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border border-blue-400/30 group-hover:border-blue-400/60 transition-all duration-500">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
                        {project?.category}
                      </span>
                    </div>

                    {/* Title - Premium Typography */}
                    <Link
                      href={`/repository/${project.id}`}
                      className="block group/title"
                    >
                      <h3 className="text-xl lg:text-2xl font-semibold text-white leading-snug mb-4 group-hover/title:text-transparent group-hover/title:bg-clip-text group-hover/title:bg-gradient-to-r group-hover/title:from-blue-400 group-hover/title:to-cyan-400 transition-all duration-500">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 group-hover/title:text-slate-300 transition-colors">
                        {project.abstract}
                      </p>
                    </Link>
                  </div>

                  {/* Metadata Footer - Premium */}
                  <div className="mt-8 pt-6 border-t border-white/10 group-hover:border-blue-400/30 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                      <Layers className="h-3.5 w-3.5 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                      Project Details
                    </div>

                    <Link
                      href={`/repository/${project.id}`}
                      className="text-xs font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 hover:text-cyan-400"
                    >
                      View Full
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* Corner accent - visible on hover */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Eye className="w-4 h-4 text-blue-400/40" />
                  </div>
                </article>
              </div>
            ))}
          </div>
        ) : (
          /* Premium Empty State */
          <div className="relative text-center py-32 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl overflow-hidden group">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-400/30 group-hover:border-blue-400/60 transition-all duration-500">
                  <BookOpen className="w-8 h-8 text-blue-400/60 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
                  No Featured Projects
                </h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors max-w-sm mx-auto text-sm">
                  Check back soon for the latest academic publications and
                  research highlights from our community.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom accent line */}
        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>
    </section>
  );
}
