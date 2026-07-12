"use client";

import { FC, useMemo } from "react";
import { ProjectDetails } from "@/app/_utils/types";
import { Download, FileText, BookOpen } from "lucide-react";

const gradients = [
  "from-indigo-600 via-blue-600 to-cyan-500",
  "from-emerald-600 via-teal-600 to-cyan-500",
  "from-violet-600 via-purple-600 to-fuchsia-500",
  "from-rose-600 via-pink-600 to-orange-500",
  "from-amber-600 via-orange-600 to-red-500",
  "from-sky-600 via-blue-600 to-indigo-600",
  "from-green-600 via-emerald-600 to-teal-500",
  "from-purple-600 via-violet-600 to-indigo-500",
  "from-red-600 via-rose-600 to-pink-500",
  "from-slate-700 via-slate-800 to-slate-900",
];

// numeric-safe deterministic hash
const getGradient = (id: number) => {
  const hash = (id * 9301 + 49297) % 233280;
  return gradients[hash % gradients.length];
};

const ProjectInfo: FC<{ project: ProjectDetails }> = ({ project }) => {
  const gradient = useMemo(() => getGradient(project.id), [project.id]);

  // Generate a clean, download-safe filename from the project title
  const fileName = useMemo(() => {
    if (!project.title) return "Project-Document.pdf";

    const cleanTitle = project.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .trim()
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    return `${cleanTitle || "project-document"}.pdf`;
  }, [project.title]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 transition-colors duration-200">
      {/* HEADER */}
      <div
        className={`relative h-40 bg-linear-to-br ${gradient} p-6 flex flex-col justify-end overflow-hidden`}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-2">
          <h2 className="text-white text-lg font-semibold leading-snug line-clamp-2">
            {project.title}
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-medium backdrop-blur">
              {project.submissionYear}
            </span>

            {project.category && (
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-medium backdrop-blur">
                {project.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="py-4 pb-0 space-y-8 flex-1 overflow-y-auto">
        {/* META MATRIX */}
        <div className="grid grid-cols-2 gap-3 px-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800/60">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Supervisor
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              {project.supervisor?.fullName ?? "Not Assigned"}
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800/60">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Year
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              {project.submissionYear}
            </p>
          </div>
        </div>

        {/* ABSTRACT */}
        <section className="px-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen
              size={14}
              className="text-slate-400 dark:text-slate-500"
            />
            <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Abstract
            </h4>
          </div>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            {project.abstract}
          </p>
        </section>

        {/* KEYWORDS */}
        {project?.keywords && project?.keywords?.length > 0 && (
          <section className="px-4">
            <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
              Keywords
            </h4>

            <div className="flex flex-wrap gap-2">
              {project.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs border border-transparent dark:border-slate-800/40"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* DOCUMENT EXTRACTION ACTION */}
        <section className="sticky bottom-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 py-3 border-t border-slate-100/80 dark:border-slate-900/80">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
            Document
          </h4>

          <a
            href={project.fileUrl}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText
                size={18}
                className="shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"
              />
              <div className="min-w-0">
                <p
                  className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1 truncate"
                  title={fileName}
                >
                  {fileName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  PDF Document
                </p>
              </div>
            </div>

            <Download
              size={16}
              className="text-slate-400 dark:text-slate-500 shrink-0 ml-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors"
            />
          </a>
        </section>
      </div>
    </div>
  );
};

export default ProjectInfo;
