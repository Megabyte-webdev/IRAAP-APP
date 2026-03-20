"use client";

import { FC, useState, useEffect, useMemo } from "react";
import {
  X,
  FileText,
  CheckCircle,
  RotateCcw,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  History,
  MessageSquare,
} from "lucide-react";
import { Project } from "@/app/_utils/types";
import useSupervisor from "@/app/_hooks/use-supervisor";

interface ProjectReviewModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSaveReview: (review: string) => void;
  onStatusChange: (
    status: "APPROVED" | "REJECTED" | "REVISION_REQUESTED",
  ) => void;
  reviewLoading?: boolean;
  statusLoading?: boolean;
}

type ProjectStatus = "APPROVED" | "REJECTED" | "REVISION_REQUESTED";

const ProjectReviewModal: FC<ProjectReviewModalProps> = ({
  project,
  isOpen,
  onClose,
  onSaveReview,
  onStatusChange,
  reviewLoading = false,
  statusLoading = false,
}) => {
  const [reviewText, setReviewText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    ProjectStatus | undefined
  >();
  const [showPdf, setShowPdf] = useState(true);
  const [activeTab, setActiveTab] = useState<"action" | "history">("action");

  const { getProjectReviews } = useSupervisor();
  const { data: history, isLoading: historyLoading } = getProjectReviews(
    project?.id,
  );

  const pdfUrl = useMemo(() => `${project?.fileUrl}.pdf`, [project?.fileUrl]);

  useEffect(() => {
    if (isOpen && project) {
      setReviewText(project.review || "");
      const validStatuses: ProjectStatus[] = [
        "APPROVED",
        "REJECTED",
        "REVISION_REQUESTED",
      ];
      if (validStatuses.includes(project.status as any)) {
        setSelectedStatus(project.status as ProjectStatus);
      } else {
        setSelectedStatus(undefined);
      }
    }
  }, [isOpen, project]);

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
            className={`lg:flex-3 p-4 lg:p-6 border-r border-slate-200 overflow-hidden transition-all duration-300 ${showPdf ? "h-1/2 lg:h-full" : "h-18 lg:h-full"}`}
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
                  src={`${project?.fileUrl}.pdf`}
                  className="w-full flex-1"
                  title="Project PDF Content"
                />
              )}
            </div>
          </section>

          {/* Right: Review & History Tabs Section */}
          <section className="lg:flex-2 flex flex-col bg-white h-full border-l border-slate-100">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-100 shrink-0">
              <button
                onClick={() => setActiveTab("action")}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === "action"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageSquare size={14} />
                  <span>Review Action</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === "history"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <History size={14} />
                  <span>History ({history?.length || 0})</span>
                </div>
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "action" ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Current Abstract (Context) */}
                  {project?.abstract && (
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Project Abstract
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl italic border border-slate-100">
                        "{project.abstract}"
                      </p>
                    </div>
                  )}

                  {/* Decision Picker */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Change Decision
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      <StatusButton
                        active={selectedStatus === "APPROVED"}
                        onClick={() => setSelectedStatus("APPROVED")}
                        icon={<CheckCircle size={18} />}
                        label="Approve Submission"
                        activeClass="border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/10"
                      />
                      <StatusButton
                        active={selectedStatus === "REVISION_REQUESTED"}
                        onClick={() => setSelectedStatus("REVISION_REQUESTED")}
                        icon={<RotateCcw size={18} />}
                        label="Request Revision"
                        activeClass="border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-500/10"
                      />
                      <StatusButton
                        active={selectedStatus === "REJECTED"}
                        onClick={() => setSelectedStatus("REJECTED")}
                        icon={<AlertCircle size={18} />}
                        label="Reject Project"
                        activeClass="border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/10"
                      />
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Review Comments
                    </h3>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Explain your decision or suggest changes..."
                      className="w-full min-h-40 p-4 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50/30 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                  {historyLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <Loader2 className="animate-spin mb-2" size={24} />
                      <p className="text-xs font-medium">Fetching history...</p>
                    </div>
                  ) : history?.length > 0 ? (
                    history.map((rev: any) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {new Date(rev.createdAt).toLocaleDateString(
                              undefined,
                              { dateStyle: "medium" },
                            )}
                          </span>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                              rev.status === "APPROVED"
                                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                : rev.status === "REJECTED"
                                  ? "bg-rose-50 border-rose-100 text-rose-600"
                                  : "bg-amber-50 border-amber-100 text-amber-600"
                            }`}
                          >
                            {rev.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed italic">
                          "{rev.comments}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20">
                      <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <History size={20} className="text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-400 font-medium">
                        No previous reviews found.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sticky Footer Actions */}
            <footer className="border-t border-slate-100 bg-white p-6 space-y-2 shrink-0">
              <button
                onClick={() => selectedStatus && onStatusChange(selectedStatus)}
                disabled={statusLoading || !selectedStatus}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {statusLoading && (
                  <Loader2 size={18} className="animate-spin" />
                )}
                Confirm & Update Status
              </button>
              <button
                onClick={() => onSaveReview(reviewText)}
                disabled={reviewLoading || !reviewText.trim()}
                className="w-full py-3 border border-slate-200 text-slate-600 bg-white rounded-xl font-semibold hover:bg-slate-50 transition-all disabled:opacity-40"
              >
                {reviewLoading ? "Saving..." : "Save Comments Only"}
              </button>
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
};

interface StatusBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  activeClass: string;
}

const StatusButton: FC<StatusBtnProps> = ({
  active,
  onClick,
  icon,
  label,
  activeClass,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
      active
        ? activeClass
        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
    }`}
  >
    <span className={active ? "scale-110 transition-transform" : "opacity-70"}>
      {icon}
    </span>
    {label}
  </button>
);

export default ProjectReviewModal;
