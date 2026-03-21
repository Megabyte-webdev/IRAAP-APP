import {
  AlertCircle,
  CheckCircle,
  Loader2,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { StatusButton } from "./StatusHelper";
import { ProjectStatus } from "@/app/_utils/types";
import ProjectReviews from "./ProjectReviews";
import { useProject } from "@/app/_hooks/use-projects";

const ProjectSummary = ({
  project,
  onStatusChange,
  statusLoading,
  onSaveReview,
  reviewLoading,
}: any) => {
  const [activeTab, setActiveTab] = useState<"action" | "history">("action");
  const [reviewText, setReviewText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>();
  const { getProjectReviews } = useProject();

  const { data: history = [], isLoading: historyLoading } = getProjectReviews(
    project?.id,
  );
  const isActive = (status: ProjectStatus) =>
    selectedStatus === status ||
    (!selectedStatus && project?.status === status);

  const isCurrent = (status: ProjectStatus) => project?.status === status;

  useEffect(() => {
    if (project) {
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
  }, [project]);

  return (
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
            <span>Tasks ({history?.length || 0})</span>
          </div>
        </button>
      </div>

      {/* Scrollable Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "action" ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Project Abstract */}
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
                  active={isActive("APPROVED")}
                  isCurrent={isCurrent("APPROVED")}
                  onClick={() => setSelectedStatus("APPROVED")}
                  icon={<CheckCircle size={18} />}
                  label="Approve Submission"
                  activeClass="border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/10"
                />

                <StatusButton
                  active={isActive("REVISION_REQUESTED")}
                  isCurrent={isCurrent("REVISION_REQUESTED")}
                  onClick={() => setSelectedStatus("REVISION_REQUESTED")}
                  icon={<RotateCcw size={18} />}
                  label="Request Revision"
                  activeClass="border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-500/10"
                />

                <StatusButton
                  active={isActive("REJECTED")}
                  isCurrent={isCurrent("REJECTED")}
                  onClick={() => setSelectedStatus("REJECTED")}
                  icon={<AlertCircle size={18} />}
                  label="Reject Project"
                  activeClass="border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/10"
                />
              </div>
            </div>
          </div>
        ) : (
          <ProjectReviews reviews={history} historyLoading={historyLoading} />
        )}
      </div>

      {/* Sticky Footer Actions */}
      <footer className="border-t border-slate-100 bg-white p-6 space-y-2 shrink-0">
        <button
          onClick={() => selectedStatus && onStatusChange(selectedStatus)}
          disabled={statusLoading || !selectedStatus}
          className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {statusLoading && <Loader2 size={18} className="animate-spin" />}
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
  );
};

export default ProjectSummary;
