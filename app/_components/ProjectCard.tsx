import { Bookmark } from "lucide-react";

// Update the interface to match your exact backend response schema
interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    abstract: string;
    fileUrl: string;
    submissionYear: number;
    status: string;
    categoryId: number | null;
    researchType: string;
    category: string | null;
    keywords: string[];
    researchArea: string;
    methodology: string;
    totalVersions: number;
    author: string;
    createdAt: string;
    updatedAt: string;
  };
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between hover:shadow-md dark:hover:shadow-sky-950/20 transition-shadow duration-200 relative group">
      <div>
        {/* Top Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {/* Dynamically falls back to category or defaults to the research area */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-sky-400 bg-blue-50 dark:bg-sky-950/50 px-2 py-0.5 rounded">
            {project.researchType}
          </span>

          <span className="text-[10px] font-semibold px-2 py-0.5 rounded border text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50">
            ★ {project.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-primary dark:group-hover:text-sky-400 transition-colors mb-1.5 leading-snug">
          {project.title}
        </h3>

        {/* Contributors */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-3">
          By{" "}
          <span className="text-slate-700 dark:text-slate-200 font-semibold">
            {project.author}
          </span>
        </p>

        {/* Abstract Snippet text */}
        <p className="text-xs text-slate-400 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
          {project.abstract}
        </p>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800/60 mt-auto">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Published {project.submissionYear}
        </span>
        <button className="text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-sky-400 transition-colors p-1 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
