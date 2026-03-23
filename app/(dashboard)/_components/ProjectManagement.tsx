"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Loader2,
  ShieldCheck,
  MoreVertical,
  Menu,
  X,
  Activity,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";
import { useProject } from "@/app/_hooks/use-projects";
import ProjectInfo from "@/app/(dashboard)/_components/ProjectInfo";
import ProjectTaskBoard from "@/app/(dashboard)/_components/ProjectTaskBoard";
import ActivityFeed from "@/app/(dashboard)/_components/ActivityFeed";
import { useAuth } from "@/app/_context/AuthContext";

const ProjectManagement = () => {
  const { projectId } = useParams();
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
    // 1. Ensure reviews is an array before processing
    if (!Array.isArray(reviews)) return [];

    return reviews.flatMap((r: any) => {
      // 2. Ensure r.tasks exists and is an array
      const tasks = Array.isArray(r.tasks) ? r.tasks : [];

      return tasks.map((task: any) => ({
        ...task,
        // Pass the parent review info down so the Board can group it correctly
        review: {
          id: r.id,
          summary: r.summary,
        },
      }));
    });
  }, [reviews]);

  if (isProjectLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );

  if (!project)
    return (
      <div className="p-20 text-center text-slate-500">Project Not Found</div>
    );

  return (
    <div className="flex h-full w-full bg-[#F8FAFC]  text-slate-900 selection:bg-indigo-100">
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
        fixed inset-y-0 left-0 z-70 lg:z-0 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="lg:hidden absolute right-4 top-4 z-80">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 bg-slate-100 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
        <ProjectInfo project={project} />
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="sticky top-0 flex flex-1 flex-col min-w-0 bg-[#F1F5F9]/50">
        {/* Header */}
        <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <ClipboardList size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden md:block p-1.5 bg-indigo-600 rounded-lg text-white">
                <LayoutDashboard size={16} />
              </div>
              <h1 className="text-sm font-bold text-slate-800 truncate max-w-35 md:max-w-100">
                {project.title}
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">
              <ShieldCheck size={12} /> {role}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsActivityOpen(!isActivityOpen)}
            >
              <Activity size={18} />
            </button>
          </div>
        </header>

        {/* Board Area */}
        <div className="flex-1 p-4 lg:p-8 ">
          <ProjectTaskBoard
            tasks={allTasks}
            loading={isReviewLoading}
            projectId={project.id}
            reviews={reviews}
          />
        </div>
      </main>

      {/* RIGHT ACTIVITY FEED (DRAWER ON MOBILE) */}
      <aside
        className={`
        fixed inset-y-0 right-0 z-70 w-80 bg-white border-l border-slate-200 transform transition-transform duration-300
        
        ${isActivityOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="h-14 flex items-center justify-between px-6 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Updates
          </h3>
          <button
            className="p-1 hover:bg-slate-100 rounded"
            onClick={() => setIsActivityOpen(false)}
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <ActivityFeed reviews={reviews} loading={isReviewLoading} />
        </div>
      </aside>
    </div>
  );
};

export default ProjectManagement;
