import { Plus } from "lucide-react";
import Link from "next/link";

const ProjectHeader = ({ projectCount = 0 }: { projectCount?: number }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Projects
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage and monitor your submissions ({projectCount} found)
        </p>
      </div>

      {/* SUBMIT PROJECT NAVIGATION BUTTON */}
      <Link
        href="/student/upload"
        className="inline-flex items-center justify-center gap-2 bg-primary hover:shadow-lg active:shadow-lg text-white font-medium text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors duration-150"
      >
        <Plus size={14} strokeWidth={2.5} />
        Submit Project
      </Link>
    </div>
  );
};

export default ProjectHeader;
