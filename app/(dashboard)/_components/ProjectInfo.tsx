"use client";

import { FC, useMemo } from "react";
import { Project } from "@/app/_utils/types";
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

const ProjectInfo: FC<{ project: Project }> = ({ project }) => {
  const gradient = useMemo(() => getGradient(project.id), [project.id]);

  const fileName = useMemo(() => {
    if (!project.fileUrl) return "Project Document.pdf";
    return project.fileUrl.split("/").pop() || "Project Document.pdf";
  }, [project.fileUrl]);

  return (
    <div className="flex flex-col h-full bg-white border border-slate-100">
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
        {/* META */}
        <div className="grid grid-cols-2 gap-3 px-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Supervisor
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1">
              {project.supervisor}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Year
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1">
              {project.submissionYear}
            </p>
          </div>
        </div>

        {/* ABSTRACT */}
        <section className="px-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-slate-400" />
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Abstract
            </h4>
          </div>

          <p className="text-sm leading-7 text-slate-600">{project.abstract}</p>
        </section>

        {/* KEYWORDS */}
        {project?.keywords && project?.keywords?.length > 0 && (
          <section className="px-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              Keywords
            </h4>

            <div className="flex flex-wrap gap-2">
              {project.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* DOCUMENT */}
        <section className="sticky bottom-0 bg-white/10 backdrop-blur-md px-4 py-2">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Document
          </h4>

          <a
            href={project.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-800">{fileName}</p>
                <p className="text-[11px] text-slate-500">PDF Document</p>
              </div>
            </div>

            <Download size={16} className="text-slate-400" />
          </a>
        </section>
      </div>
    </div>
  );
};

export default ProjectInfo;
