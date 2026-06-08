"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { useProject } from "@/app/_hooks/use-projects";
import {
  Upload,
  User,
  MessageSquare,
  Video,
  FileUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderOpen,
} from "lucide-react";
import ActivityFeed from "../_components/ActivityFeed";
import Link from "next/link";

export default function StudentDashboard() {
  const { getProjects, getProjectReviews } = useProject();
  const { authDetails } = useAuth();
  const user = authDetails?.user;

  const { data: projects, isLoading: isProjectsLoading } = getProjects();

  const projectId = projects?.[0]?.id;

  const { data: reviews = [], isLoading: isReviewLoading } = getProjectReviews(
    Number(projectId),
  );

  if (isProjectsLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  const allReviews = reviews || [];
  const allTasks = allReviews.flatMap((r: any) => r.tasks || []);

  const completedTasks = allTasks.filter(
    (t: any) => t.status === "COMPLETED" || t.status === "VERIFIED",
  );

  const pendingTasks = allTasks.filter((t: any) => t.status === "PENDING");

  const progress =
    allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0;

  const isAllDone =
    allTasks.length > 0 && completedTasks.length === allTasks.length;

  const statusLabel = isAllDone
    ? "Project Approved"
    : pendingTasks.length > 0
      ? "In Progress"
      : "No Tasks";

  const statusColor = isAllDone
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  const totalMilestones = allReviews.length;

  // Find if there's a round ready to submit
  const pendingSubmissionRound = allReviews.find(
    (r: any) =>
      !r.revisionSubmitted &&
      r.tasks?.length > 0 &&
      r.tasks.every((t: any) => t.status === "COMPLETED"),
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* PROJECT OVERVIEW */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Project Progress Overview
          </h2>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="text-slate-500 text-sm mb-4">
          {totalMilestones} milestones • {allTasks.length} tasks •{" "}
          {completedTasks.length} completed • {pendingTasks.length} pending
        </p>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isAllDone ? "bg-green-500" : "bg-blue-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 mt-2">
          {progress.toFixed(0)}% complete
        </p>
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — WORKSPACE ACTIONS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Workspace</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Your active tools and shortcuts
            </p>
          </div>

          <div className="p-4 space-y-3">
            {/* SUBMIT REVISION — primary action, only shown when a round is ready */}
            {pendingSubmissionRound ? (
              <Link
                href={`/student/projects/${projectId}?task=submit`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <FileUp size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">
                    Submit Revision
                  </p>
                  <p className="text-[11px] text-indigo-200 truncate">
                    {pendingSubmissionRound?.description} is ready to submit
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-indigo-300 group-hover:translate-x-0.5 transition-transform shrink-0"
                />
              </Link>
            ) : (
              /* Placeholder when nothing is ready to submit */
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    No submission due
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Complete all tasks in a round to unlock submission
                  </p>
                </div>
              </div>
            )}

            {/* VIEW PROJECT BOARD */}
            <Link
              href={`/student/projects/${projectId}`}
              className="group flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                <FolderOpen size={16} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700">
                  Open Project Board
                </p>
                <p className="text-[11px] text-slate-400">
                  View tasks, reviews and revision history
                </p>
              </div>
              <ArrowRight
                size={14}
                className="text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0"
              />
            </Link>

            {/* JOIN MEETING — separated clearly as a communication tool */}
            <Link
              href="/student/meet"
              className="group flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                <Video size={16} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700">
                  Join Meet Room
                </p>
                <p className="text-[11px] text-slate-400">
                  Connect with your supervisor via video
                </p>
              </div>
              <ArrowRight
                size={14}
                className="text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0"
              />
            </Link>
          </div>

          {/* Pending tasks nudge at the bottom */}
          {pendingTasks.length > 0 && (
            <div className="mx-4 mb-4 flex items-center gap-2.5 px-3.5 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
              <Clock size={13} className="text-amber-500 shrink-0" />
              <p className="text-[11px] text-amber-700 font-medium">
                <span className="font-bold">{pendingTasks.length}</span> task
                {pendingTasks.length !== 1 ? "s" : ""} still pending across all
                rounds
              </p>
            </div>
          )}
        </div>

        {/* RIGHT — LATEST UPDATES */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Card header */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
            <h3 className="font-bold text-slate-800 text-sm">Latest Updates</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Submission history and review rounds
            </p>
          </div>

          {/* Scroll area */}
          <div className="flex-1 overflow-y-auto p-5 min-h-0 max-h-72">
            <ActivityFeed reviews={reviews} loading={isReviewLoading} />
          </div>

          {/* CTA */}
          <div className="px-4 pb-4 pt-2 border-t border-slate-100 shrink-0">
            <Link
              href="/student/projects"
              className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center justify-center gap-2 transition"
            >
              Go to Project Management
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
          <h4 className="font-bold text-rose-900 mb-1">Deadlines</h4>
          <p className="font-semibold text-rose-700">Draft 3 Submission</p>
          <p className="text-sm text-rose-600">April 22</p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <h4 className="font-bold text-emerald-900 mb-2">
            Assigned Supervisor
          </h4>
          <div className="flex items-center gap-2 text-emerald-700 font-medium">
            <User size={18} />
            {user?.supervisorName || "Not assigned"}
          </div>
          <button className="text-sm text-emerald-600 mt-2 flex items-center gap-1 hover:underline font-medium">
            <MessageSquare size={14} />
            Send Message →
          </button>
        </div>

        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
          <h4 className="font-bold text-amber-900 mb-2">University Guides</h4>
          <div className="space-y-1 text-sm text-amber-700 underline">
            <p className="cursor-pointer hover:text-amber-900">
              Format Guidelines.pdf
            </p>
            <p className="cursor-pointer hover:text-amber-900">
              CitationRules.pdf
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
