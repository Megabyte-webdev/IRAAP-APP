import { Project } from "@/app/_utils/types";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/10";
      case "PENDING":
        return "bg-amber-500/10 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/10";
      case "COMPLETED":
        return "bg-blue-500/10 dark:bg-blue-500/5 text-blue-700 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/10";
      default:
        return "bg-slate-500/10 dark:bg-slate-500/5 text-slate-600 dark:text-slate-400 border-slate-500/20 dark:border-slate-500/10";
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-200 hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-none cursor-pointer"
    >
      <div>
        {/* Workspace Title & Status Tag */}
        <div className="pt-2 gap-3 mb-2.5">
          {project.status && (
            <span
              className={`absolute right-2 top-2 px-2.5 py-0.5 text-[11px] font-bold tracking-wide rounded-full border shadow-sm uppercase ${getStatusStyle(
                project.status,
              )}`}
            >
              {project.status}
            </span>
          )}
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150 line-clamp-1">
            {project.title}
          </h3>
        </div>

        {/* Content Briefing */}
        {project.abstract ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-5">
            {project.abstract}
          </p>
        ) : (
          <p className="text-sm italic text-slate-400 dark:text-slate-600 line-clamp-2 leading-relaxed mb-5">
            No descriptive specifications provided for this engineering module.
          </p>
        )}
      </div>

      {/* Footer Metadata Blocks */}
      <div className="space-y-4">
        {/* Progress Tracker Slider */}
        {/* {project.completedPercentage !== undefined && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 dark:text-slate-500">
              <span className="uppercase tracking-wider">
                Completion Matrix
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {project.completedPercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  project.completedPercentage >= 75
                    ? "bg-emerald-500"
                    : project.completedPercentage >= 50
                      ? "bg-blue-500"
                      : project.completedPercentage >= 25
                        ? "bg-amber-500"
                        : "bg-orange-500"
                }`}
                style={{ width: `${project.completedPercentage}%` }}
              />
            </div>
          </div>
        )} */}

        {/* Technical Specification Counts */}
        {/* <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          {project.taskCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <span>
                {project.taskCount} Task{project.taskCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {project.membersCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <span>
                {project.membersCount} Member
                {project.membersCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div> */}

        {/* View Details Interactive Indicator */}
        <div
          className={`flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all duration-200 overflow-hidden ${
            isHovered ? "max-h-6 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <span>Open Workspace</span>
          <span className="transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </div>
  );
}
