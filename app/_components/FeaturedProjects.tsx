"use client";

import { ArrowUpRight, BookOpen, Layers } from "lucide-react";
import Link from "next/link";

export default function FeaturedProjects({ projects }: any) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-blue-600"></span>
              <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                Projects
              </span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Featured Research
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Showcasing innovation and academic excellence through high-impact
              student projects.
            </p>
          </div>

          <Link
            href="/repository"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-all group"
          >
            Explore Full Repository
            <div className="flex items-center justify-center h-8 w-8 rounded-full border border-slate-200 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all">
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* Projects Grid */}
        {projects?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project: any) => (
              <article
                key={project.id}
                className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(8,112,184,0.05)]"
              >
                {/* Category Badge */}
                <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {project?.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <Link href={`/repository/${project.id}`}>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug mb-4 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {project.abstract}
                    </p>
                  </Link>
                </div>

                {/* Metadata Footer */}
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                    <Layers className="h-3.5 w-3.5 mr-2 text-slate-300" />
                    Project Details
                  </div>

                  <Link
                    href={`/repository/${project.id}`}
                    className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
                  >
                    View Full Text
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">
              No Featured Projects
            </h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Check back soon for the latest academic publications and research
              highlights.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
