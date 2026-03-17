"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Calendar,
  Tag,
  User,
  FileText,
  Globe,
  Microscope,
  ShieldCheck,
  Clock,
  X,
} from "lucide-react";
import { useProject } from "@/app/_hooks/use-projects";

export default function ProjectDetailPage() {
  const { getProjectById } = useProject();
  const { pageId } = useParams();
  const router = useRouter();
  const { data: project, isLoading, error } = getProjectById(pageId as string);

  if (isLoading) return <LoadingSkeleton />;
  if (error || !project)
    return <ErrorState message="Project not found or has been moved." />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Back to Archive
          </button>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                project?.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {project?.status}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Main Project Content (Col 8) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Title Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                <Globe size={14} />
                {project?.category || "Uncategorized"}
              </div>
              <h1 className="text-4xl font-black text-slate-900 leading-[1.1]">
                {project?.title}
              </h1>
            </section>

            {/* Abstract Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                <FileText className="text-blue-500" size={24} />
                Project Abstract
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                {project?.abstract}
              </p>
            </div>

            {/* Methodology Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                <Microscope className="text-blue-500" size={24} />
                Research Methodology
              </h3>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <p className="text-slate-700 italic leading-relaxed whitespace-pre-line">
                  {project?.methodology || "No methodology details provided."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Technical Metadata Sidebar (Col 4) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl shadow-blue-900/20 space-y-8">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-400" />
                Technical Metadata
              </h4>

              <div className="space-y-6">
                <SidebarItem
                  label="Submission Year"
                  value={project?.submissionYear}
                  icon={Calendar}
                />
                <SidebarItem
                  label="Research Area"
                  value={project?.researchArea}
                  icon={Globe}
                />
                <SidebarItem
                  label="Keywords"
                  value={project?.keywords}
                  icon={Tag}
                />
                <SidebarItem
                  label="Submission Date"
                  value={new Date(project?.createdAt).toLocaleDateString()}
                  icon={Clock}
                />
              </div>

              <a
                href={project?.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full flex items-center justify-between bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-bold transition-all transform active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <Download size={20} />
                  <span>Download Full PDF</span>
                </div>
                <ArrowLeft
                  size={18}
                  className="rotate-180 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                />
              </a>
            </div>

            {/* Student and supervisor Info Card (Optional) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                <User size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Author
                </p>
                <p className="font-bold text-slate-900">{project?.author}</p>
                <p className="text-sm text-slate-500">
                  {project?.supervisor || "Supervisor not specified"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

// Sub-components for cleaner code
function SidebarItem({ label, value, icon: Icon }: any) {
  return (
    <div className="flex gap-4">
      <div className="text-blue-400 mt-1">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-100 mt-0.5">
          {value || "Not Specified"}
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-20 text-center animate-pulse text-slate-400 font-medium">
      Fetching Archive Details...
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-20 text-center">
      <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full mb-4">
        <X size={32} />
      </div>
      <p className="text-slate-900 font-bold text-xl">{message}</p>
    </div>
  );
}
