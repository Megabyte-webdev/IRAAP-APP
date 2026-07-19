"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, RefreshCcw } from "lucide-react";
import { useProject } from "../_hooks/use-projects";
import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "../(dashboard)/admin/archive/_components/ProjectCardSkeleton";

const ProjectList = () => {
  const { getAllProjects } = useProject();

  const { data, isLoading, isError, refetch } = getAllProjects({
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
          href="/archive"
          className="text-sm font-semibold text-primary flex items-center gap-1 transition hover:opacity-80"
        >
          <span>View all archives</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 py-12 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-3" />

          <h3 className="font-semibold text-gray-900">
            Unable to load projects
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Something went wrong while fetching the archive.
          </p>

          <button
            onClick={() => refetch()}
            className="mt-5 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && projects.length === 0 && (
        <div className="rounded-xl h-48 border border-gray-100 bg-gray-50 py-12 text-center">
          <h3 className="font-semibold text-gray-900">No projects available</h3>

          <p className="mt-1 text-sm text-gray-500">
            There are currently no archived projects to display.
          </p>
        </div>
      )}

      {/* Projects */}
      {!isLoading && !isError && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectList;
