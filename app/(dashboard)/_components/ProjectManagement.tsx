"use client";

import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Loader2,
  ShieldCheck,
  X,
  Activity,
  LayoutDashboard,
  ClipboardList,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { useProject } from "@/app/_hooks/use-projects";
import ProjectInfo from "@/app/(dashboard)/_components/ProjectInfo";
import ProjectTaskBoard from "@/app/(dashboard)/_components/ProjectTaskBoard";
import ActivityFeed from "@/app/(dashboard)/_components/ActivityFeed";
import { useAuth } from "@/app/_context/AuthContext";
import PublicationButton from "../student/projects/_components/PublicationButton";

const ProjectManagement = () => {
  const { projectId }: any = useParams();
  const searchParams = useSearchParams();
  const activeTaskId = searchParams.get("task");
  const { authDetails } = useAuth();
  const role = authDetails?.user?.role;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const { getProjectById, getProjectReviews } = useProject();

  const { data: project, isLoading: isProjectLoading } = getProjectById(
    Number(projectId),
  );
  const { data: reviews = [], isLoading: isReviewLoading } = getProjectReviews(
    Number(projectId),
  );

  const allTasks = useMemo(() => {
    if (!Array.isArray(reviews)) return [];

    return reviews.flatMap((r: any) => {
      const tasks = Array.isArray(r.tasks) ? r.tasks : [];

      return tasks.map((task: any) => ({
        ...task,
        review: {
          id: r.id,
          summary: r.summary,
        },
      }));
    });
  }, [reviews]);

  if (isProjectLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950 transition-colors">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );

  if (!project)
    return (
      <div className="p-20 text-center text-slate-500 dark:text-slate-400">
        Project Not Found
      </div>
    );

  return (
    <div className="flex h-[calc(100dvh-80px)] w-full bg-[#F8FAFC] dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-primary/50 lg:pl-4 overflow-hidden transition-colors">
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (COLLAPSIBLE) */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-999 lg:z-auto w-72 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="lg:hidden absolute right-4 top-4 overflow-y-auto">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300"
          >
            <X size={16} />
          </button>
        </div>
        <ProjectInfo project={project} />
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="sticky top-0 flex flex-1 flex-col min-w-0 bg-[#F1F5F9]/50 dark:bg-slate-950/20 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <ClipboardList size={20} />
            </button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden md:block p-1.5 bg-primary rounded-lg text-white shrink-0">
                <LayoutDashboard size={16} />
              </div>
              <h1 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                {project.title}
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 border border-primary/50 rounded text-[10px] font-bold text-primary dark:text-indigo-400 uppercase tracking-tighter shrink-0">
              <ShieldCheck size={12} /> {role}
            </div>

            {/* Dynamic Status Badges for Release State */}
            {project.isSignaledForPublication && (
              <div className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter shrink-0">
                <Globe size={12} /> Released for Publication
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {/* ACTION TRIGGER: SUPERVISOR MANUALLY RELEASES THE PROJECT */}
            {role === "SUPERVISOR" &&
              project.status === "VERIFIED" &&
              !project.isSignaledForPublication && (
                <PublicationButton
                  projectId={Number(projectId)}
                  action="AUTHORIZE"
                />
              )}

            {/* ACTION TRIGGER: STUDENT PORTAL FINAL ARCHIVAL SUBMISSION SUBMIT BUTTON */}
            {role === "STUDENT" && project.isSignaledForPublication && (
              <PublicationButton
                projectId={Number(projectId)}
                action="PUBLISH"
              />
            )}

            <button
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsActivityOpen(!isActivityOpen)}
            >
              <Activity size={18} />
            </button>
          </div>
        </header>

        {/* Global Informational Notification Banner for Students */}
        {role === "STUDENT" && project.isSignaledForPublication && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>
              Your supervisor has explicitly cleared this version! You are now
              authorized to publish this research.
            </span>
          </div>
        )}

        {/* Board Area */}
        <div className="flex-1 p-4 lg:p-8">
          <ProjectTaskBoard
            tasks={allTasks}
            loading={isReviewLoading}
            projectId={projectId}
            reviews={reviews}
            activeTaskId={activeTaskId}
          />
        </div>
      </main>

      {/* RIGHT ACTIVITY FEED (DRAWER ON MOBILE) */}
      <aside
        className={`
        fixed inset-y-0 right-0 z-70 w-80 bg-white dark:bg-[#1E293B] border-l border-slate-200 dark:border-slate-800 
        transform transition-transform duration-300 flex flex-col                      
        ${isActivityOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* Fixed header */}
        <div className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Updates
          </h3>
          <button
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400"
            onClick={() => setIsActivityOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body — takes remaining height */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-white dark:bg-black">
          <ActivityFeed reviews={reviews} loading={isReviewLoading} />
        </div>
      </aside>
    </div>
  );
};

export default ProjectManagement;
