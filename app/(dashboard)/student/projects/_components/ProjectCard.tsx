import { Project } from "@/app/_utils/types";
import {
  FolderGit2,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getStatusBadge = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "PUBLISHED":
      case "VERIFIED":
      case "ACTIVE":
        return {
          label: status,
          icon: CheckCircle2,
          style:
            "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
        };
      case "PENDING":
      case "REVISION_REQUESTED":
        return {
          label: status,
          icon: Clock,
          style:
            "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
        };
      default:
        return {
          label: status || "DRAFT",
          icon: AlertCircle,
          style:
            "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
        };
    }
  };

  const badge = getStatusBadge(project.status);
  const StatusIcon = badge.icon;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between text-left bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Header: Status & Icon */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
            <FolderGit2 className="w-4 h-4" />
          </div>

          {project.status && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md border uppercase tracking-wider ${badge.style}`}
            >
              <StatusIcon className="w-3 h-3" />
              {badge.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150 line-clamp-1 mb-2">
          {project.title}
        </h3>

        {/* Abstract / Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6 min-h-10">
          {project.abstract || "No project abstract provided yet."}
        </p>
      </div>

      {/* Footer: Static action row (no layout shifts) */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>Workspace</span>
        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform duration-150">
          Open
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
