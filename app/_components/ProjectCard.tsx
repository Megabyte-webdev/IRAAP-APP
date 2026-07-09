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
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow duration-200 relative group">
      <div>
        {/* Top Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {/* Dynamically falls back to category or defaults to the research area */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-blue-50 px-2 py-0.5 rounded">
            {project.researchType}
          </span>

          <span className="text-[10px] font-semibold px-2 py-0.5 rounded border text-emerald-700 bg-emerald-50 border-emerald-200">
            ★ {project.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-primary transition-colors mb-1.5 leading-snug">
          {project.title}
        </h3>

        {/* Contributors */}
        <p className="text-[11px] text-slate-500 font-medium mb-3">
          By{" "}
          <span className="text-slate-700 font-semibold">{project.author}</span>
        </p>

        {/* Abstract Snippet text */}
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
          {project.abstract}
        </p>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
        <span className="text-[11px] font-medium text-slate-400">
          Published {project.submissionYear}
        </span>
        <button className="text-slate-400 hover:text-blue-500 transition-colors p-1 rounded-md hover:bg-slate-50">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
