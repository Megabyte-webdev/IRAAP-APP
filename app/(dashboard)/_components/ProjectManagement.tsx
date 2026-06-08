"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useProject } from "@/app/_hooks/use-projects";
import ProjectTaskBoard from "./ProjectTaskBoard";
import ProjectInfo from "./ProjectInfo";

export default function ProjectManagement() {
  const { projectId } = useParams();

  const { getProjectById } = useProject();
  const { data: project, isLoading } = getProjectById(Number(projectId));

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="w-80 border-r bg-white">
        <ProjectInfo project={project} />
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <ProjectTaskBoard project={project} />
      </main>
    </div>
  );
}
