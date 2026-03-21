"use client";

import { FC } from "react";
import { Project } from "@/app/_utils/types";
import { Download, FileText, Calendar, User, BookOpen } from "lucide-react";

const ProjectInfo: FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Visual Header */}
      <div className="h-32 bg-slate-900 p-6 flex flex-col justify-end relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/5 rounded-full" />
        <h2 className="text-white font-bold text-lg leading-tight z-10 truncate">
          {project.title}
        </h2>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto">
        {/* Core Stats */}
        <div className="grid grid-cols-2 gap-3">
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

        {/* Abstract Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-slate-400" />
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Project Abstract
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50 italic">
            "{project.abstract}"
          </p>
        </section>

        {/* Document Links */}
        <section>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Resources
          </h4>
          <a
            href={project.fileUrl}
            className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/20 transition-all group"
          >
            <div className="flex items-center gap-2">
              <FileText
                size={16}
                className="text-slate-400 group-hover:text-indigo-500"
              />
              <span className="text-xs font-semibold text-slate-700">
                Project_Draft_Final.pdf
              </span>
            </div>
            <Download size={14} className="text-slate-300" />
          </a>
        </section>
      </div>

      {/* Footer Branding */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/30">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-5 h-5 bg-slate-200 rounded-md" />
          <span className="text-[10px] font-bold uppercase tracking-tight">
            Management Suite
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
