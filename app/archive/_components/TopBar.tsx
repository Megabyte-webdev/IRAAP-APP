import { ArrowLeft } from "lucide-react";

export default function TopBar({ project, router }: any) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => router.push("/repository")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-medium text-sm cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back to Archive
        </button>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
              project.status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {project.status}
          </span>
        </div>
      </div>
    </div>
  );
}
