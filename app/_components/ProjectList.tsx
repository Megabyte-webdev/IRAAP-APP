"use client";
import Link from "next/link";
import { useProject } from "../_hooks/use-projects";
import ProjectCard from "./ProjectCard";

const ProjectList = () => {
  const { getAllProjects } = useProject();
  const { data, isLoading, isError } = getAllProjects({
    limit: 6,
  });

  const projects = data?.pages.flatMap((page) => page.data) ?? [];
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-16 py-23.5">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-bold text-black tracking-tight">
          Recent Computer Engineering Projects
        </h2>
        <Link
          href="#"
          className="text-sm font-semibold text-primary flex items-center space-x-1"
        >
          <span>View all archives</span>
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectList;
