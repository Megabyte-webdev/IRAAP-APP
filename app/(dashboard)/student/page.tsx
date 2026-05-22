"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { useProject } from "@/app/_hooks/use-projects";
import { Upload, User, MessageSquare } from "lucide-react";
import ActivityFeed from "../_components/ActivityFeed";

export default function StudentDashboard() {
  const { getProjects, getProjectReviews } = useProject();
  const { authDetails } = useAuth();
  const user = authDetails?.user;
  const { data: projects, isLoading: isProjectsLoading } = getProjects();

  const projectId = projects?.[0]?.id;
  const { data: reviews = [], isLoading: isReviewLoading } = getProjectReviews(
    Number(projectId),
  );

  if (isProjectsLoading) return <div className="p-8">Loading dashboard...</div>;

  const currentProject = projects?.[0];
  const latestReview: any = reviews?.[0];

  // Dynamic Logic: Calculate progress and status
  const tasks = latestReview?.tasks || [];
  const completedTasks = tasks.filter((t: any) => t.status === "VERIFIED");
  const progress =
    tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const isAllDone = tasks.length > 0 && completedTasks.length === tasks.length;
  const statusLabel = isAllDone ? "Approved" : "Pending Action";
  const statusColor = isAllDone
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Milestone Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {latestReview
              ? `Milestone: ${latestReview.summary}`
              : "No Active Milestone"}
          </h2>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="text-slate-500 text-sm mb-4">
          {tasks.length > 0
            ? `${completedTasks.length} of ${tasks.length} tasks completed`
            : "No active tasks assigned yet."}
        </p>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${isAllDone ? "bg-green-500" : "bg-blue-600"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 2. Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50">
            <Upload className="text-slate-400 mb-2" size={32} />
            <p className="text-sm text-slate-600">
              Drag & drop your latest draft here
            </p>
            <button className="text-blue-600 text-sm font-medium mt-1 hover:underline">
              or browse files
            </button>
          </div>
          <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Join Meet Room
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Latest Updates</h3>
          <ActivityFeed reviews={reviews} loading={isReviewLoading} />
        </div>
      </div>

      {/* 3. Footer Info Section */}
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
            <MessageSquare size={14} /> Send Message →
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
