"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Bookmark,
  Quote,
  Code2,
  FileSpreadsheet,
  Zap,
  BookOpen,
  FileText,
  Tag,
  Search,
} from "lucide-react";
import LoadingSkeleton from "./loadingSkeleton";
import { useProject } from "@/app/_hooks/use-projects";
import ErrorState from "./ErrorState";

export default function ProjectDetailPage() {
  const { getProjectById } = useProject();
  const { pageId } = useParams();
  const router = useRouter();

  const { data: project, isLoading, error } = getProjectById(Number(pageId));

  if (isLoading) return <LoadingSkeleton />;
  if (error || !project) {
    return <ErrorState message="Project not found or has been moved." />;
  }

  // Extract author & supervisor safely
  const authorName =
    typeof project.student === "object"
      ? project.student?.fullName
      : typeof project.author === "object"
        ? project.author?.fullName
        : project.student || project.author || "N/A";

  const supervisorName =
    typeof project.supervisor === "object"
      ? project.supervisor?.fullName
      : project.supervisor || "N/A";

  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  // Key findings array normalization
  const keyFindings: string[] = Array.isArray(project.keyFindings)
    ? project.keyFindings
    : Array.isArray(project.highlights)
      ? project.highlights
      : [];

  // Keywords / Tags normalization
  const tags: string[] = Array.isArray(project.keywords)
    ? project.keywords
    : Array.isArray(project.tags)
      ? project.tags
      : [];

  // Breadcrumbs path handling
  const breadcrumbPath = [
    project.faculty?.name || project.faculty,
    project.department?.name || project.department,
  ]
    .filter(Boolean)
    .join(" / ");

  const pdfUrl = typeof project.fileUrl === "string" && project.fileUrl.trim()
    ? project.fileUrl.trim().replace(/\.pdf\.pdf$/i, ".pdf")
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-24 font-sans">
      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        {/* Back Button */}
        <div>
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-full hover:bg-slate-200/60 transition-colors text-slate-700 inline-flex items-center justify-center cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Breadcrumbs & Title Block */}
        <div className="space-y-4">
          {breadcrumbPath && (
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Research Library / {breadcrumbPath}
            </p>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 pt-1">
            {(project.researchType || project.category) && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                {(
                  project.researchType ||
                  project.category?.name ||
                  project.category
                )?.replace("_", " ")}
              </span>
            )}
            {project.status === "APPROVED" && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                Approved
              </span>
            )}
            {project.isSignaledForPublication && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 flex items-center gap-1">
                <span>⭐</span> Distinction
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug max-w-4xl">
            {project.title}
          </h1>

          {/* Author / Supervisor Meta */}
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            By{" "}
            <span className="text-slate-700 font-semibold">{authorName}</span>
            {supervisorName !== "N/A" && (
              <>
                {" • "}
                Supervised by{" "}
                <span className="text-slate-700 font-semibold">
                  {supervisorName}
                </span>
              </>
            )}
            {formattedDate && (
              <>
                {" • "}
                {formattedDate}
              </>
            )}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Key Findings Card */}
            {keyFindings.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                  <Zap size={18} className="text-amber-500 fill-amber-500" />
                  Key Findings
                </h2>
                <ul className="space-y-3 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                  {keyFindings.map((finding, idx) => (
                    <li key={idx}>{finding}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Abstract Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <BookOpen size={18} className="text-slate-700" />
                Abstract
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {project.abstract || "No abstract provided."}
              </p>
            </div>

            {/* Document Preview Placeholder */}
            {pdfUrl && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                  <FileText size={18} className="text-slate-700" />
                  Document Preview
                </h2>

                <div className="w-full h-125 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                  <iframe
                    src={`${pdfUrl}#toolbar=0`}
                    className="w-full h-full border-none"
                    title="Document Preview"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (Col 5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 self-start">
            {/* Download & Actions Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-colors shadow-sm"
                >
                  <Download size={16} />
                  Download Full PDF
                </a>
              ) : (
                <div className="text-center py-2 text-xs text-slate-400 font-medium">
                  No document attached
                </div>
              )}

              {/* Removed invalid sticky from this nested div */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 py-2.5 px-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Bookmark size={14} />
                  Save
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 py-2.5 px-3 rounded-xl font-semibold text-xs transition-colors border border-sky-200/60 cursor-pointer"
                >
                  <Quote size={14} />
                  Cite
                </button>
              </div>
            </div>

            {/* Project Assets */}
            {(project.githubUrl ||
              project.datasetUrl ||
              project.sourceCodeUrl) && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-slate-600">📂</span> Project Assets
                </h3>

                <div className="space-y-2.5">
                  {(project.githubUrl || project.sourceCodeUrl) && (
                    <a
                      href={project.githubUrl || project.sourceCodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 text-slate-800 text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      <Code2 size={16} className="text-slate-500" />
                      View Source Code
                    </a>
                  )}
                  {project.datasetUrl && (
                    <a
                      href={project.datasetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 text-slate-800 text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      <FileSpreadsheet size={16} className="text-slate-500" />
                      Download Dataset
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Tag size={16} className="text-slate-600" /> Tags
                </h3>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-sky-50 text-sky-800 border border-sky-100/80 px-3.5 py-1.5 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Projects */}
            {Array.isArray(project.relatedProjects) &&
              project.relatedProjects.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Search size={16} className="text-slate-600" /> Related
                    Projects
                  </h3>

                  <div className="space-y-3">
                    {project.relatedProjects.map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => router.push(`/archive/${item.id}`)}
                        className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-2 hover:border-slate-300 transition-colors cursor-pointer"
                      >
                        {item.researchType && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100/70 text-sky-800 inline-block">
                            {item.researchType.replace("_", " ")}
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-slate-900">
                          {item.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}
