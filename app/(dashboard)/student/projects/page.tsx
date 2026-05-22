"use client";

import { useProject } from "@/app/_hooks/use-projects";
import {
  FileText,
  CheckCircle,
  Clock,
  MoreVertical,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const { getProjects, getProjectReviews } = useProject();
  const { data: projects = [], isLoading } = getProjects();

  const currentProject = projects?.[0];
  const { data: reviews = [] } = getProjectReviews(Number(currentProject?.id));

  if (isLoading)
    return (
      <div className="p-8 text-slate-500">
        Loading your project workspace...
      </div>
    );
  if (!currentProject)
    return <div className="p-8">No active project found.</div>;

  // Group reviews by summary (Chapter)
  const groupedReviews = reviews.reduce((acc: any, review: any) => {
    (acc[review.summary] = acc[review.summary] || []).push(review);
    return acc;
  }, {});

  const latestReview: any = reviews[0];

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-12 gap-8">
      {/* Left Column: Chapters Area */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        {Object.entries(groupedReviews).map(
          ([chapterName, chapterReviews]: [string, any]) => (
            <div
              key={chapterName}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h2 className="text-xl font-bold text-slate-900">
                  {chapterName}
                </h2>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                  {currentProject.status === "APPROVED"
                    ? "Approved"
                    : "Ongoing"}
                </span>
              </div>

              <div className="p-6 space-y-3">
                {chapterReviews.map((rev: any) => (
                  <ProjectFile
                    key={rev.id}
                    title={`Submission_${new Date(rev.createdAt).toLocaleDateString()}.pdf`}
                    date={new Date(rev.createdAt).toLocaleString()}
                  />
                ))}

                {/* Navigation to the Management Workspace */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                  <Link
                    href={`/student/projects/${currentProject.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    Manage Chapter <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Right Column: Tasks Sidebar */}
      <div className="col-span-12 lg:col-span-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sticky top-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-blue-600" />
            <h3 className="font-bold text-slate-900">Required Tasks</h3>
          </div>

          <div className="space-y-3">
            {latestReview?.tasks?.map((task: any) => (
              <TaskItem
                key={task.id}
                text={task.title}
                completed={task.status === "VERIFIED"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectFile({ title, date }: { title: string; date: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all">
      <div className="flex items-center gap-3">
        <FileText className="text-slate-400" size={20} />
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-[10px] text-slate-500">Submitted {date}</p>
        </div>
      </div>
      <MoreVertical size={16} className="text-slate-400" />
    </div>
  );
}

function TaskItem({ text, completed }: { text: string; completed: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${completed ? "bg-slate-50" : "bg-white border-slate-200"}`}
    >
      {completed ? (
        <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
      ) : (
        <Clock size={16} className="text-slate-400 mt-0.5" />
      )}
      <p
        className={`text-xs ${completed ? "text-slate-500 line-through" : "text-slate-700"}`}
      >
        {text}
      </p>
    </div>
  );
}
