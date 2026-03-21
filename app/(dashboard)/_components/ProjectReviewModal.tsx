"use client";

import { FC, useState, useEffect, useMemo } from "react";
import {
  X,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ProjectReviewModalProps } from "@/app/_utils/types";
import ProjectSummary from "./ProjectSummary";

const ProjectReviewModal: FC<ProjectReviewModalProps> = ({
  project,
  isOpen,
  onClose,
  onSaveReview,
  onStatusChange,
  reviewLoading = false,
  statusLoading = false,
}) => {
  const [showPdf, setShowPdf] = useState(true);

  const pdfUrl = useMemo(() => `${project?.fileUrl}.pdf`, [project?.fileUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white shadow-2xl w-full max-w-7xl h-full sm:h-[95vh] sm:rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-blue-50 rounded-lg shrink-0">
              <FileText className="text-blue-600" size={20} />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-lg font-bold text-slate-900 truncate">
                {project?.title || "Project Review"}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                Review Portal • ID: {project?.id || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
          {/* Left: PDF Viewer Section */}
          <section
            className={`lg:flex-3 p-4 lg:p-6 border-r border-slate-200 overflow-hidden transition-all duration-300 ${
              showPdf ? "h-1/2 lg:h-full" : "h-18 lg:h-full"
            }`}
          >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
              <div
                className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 cursor-pointer"
                onClick={() => setShowPdf(!showPdf)}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                  Document Preview
                </span>
                <div className="flex gap-4 items-center">
                  <span className="lg:hidden">
                    {showPdf ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:flex text-xs items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={14} /> Fullscreen
                  </a>
                </div>
              </div>
              {showPdf && (
                <iframe
                  src={pdfUrl}
                  className="w-full flex-1"
                  title="Project PDF Content"
                />
              )}
            </div>
          </section>

          {/* Right: Review & Task History Section */}
          <ProjectSummary
            project={project}
            onSaveReview={onSaveReview}
            onStatusChange={onStatusChange}
            reviewLoading={reviewLoading}
            statusLoading={statusLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectReviewModal;
