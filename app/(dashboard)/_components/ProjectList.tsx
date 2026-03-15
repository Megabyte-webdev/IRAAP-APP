"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/_lib/api-client";
import { ProjectCard } from "./ProjectCard";
import { AlertCircle, Inbox } from "lucide-react";

// Define a proper type for the project data
interface Project {
  id: number;
  title: string;
  abstract: string;
  fileUrl: string;
  submissionYear: string;
  supervisorName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface ProjectListProps {
  filter: "my-projects" | "all";
}

export function ProjectList({ filter }: ProjectListProps) {
  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useQuery<Project[]>({
    queryKey: ["projects", filter],
    queryFn: async () => {
      const endpoint =
        filter === "my-projects" ? "/projects/submissions" : "/projects/search";
      const { data } = await api.get(endpoint);
      return data;
    },
    retry: 2, // Retry failed requests twice
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Loading skeleton – shows 3 animated placeholder cards
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="h-6 w-20 rounded-full bg-gray-300" />
              <div className="h-6 w-6 rounded bg-gray-300" />
            </div>
            <div className="mb-2 h-5 w-3/4 rounded bg-gray-300" />
            <div className="mb-2 h-4 w-full rounded bg-gray-300" />
            <div className="mb-2 h-4 w-5/6 rounded bg-gray-300" />
            <div className="mt-3 flex items-center gap-4">
              <div className="h-4 w-16 rounded bg-gray-300" />
              <div className="h-4 w-20 rounded bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state – allows user to retry
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle
          className="mx-auto h-10 w-10 text-red-400"
          aria-hidden="true"
        />
        <h3 className="mt-2 text-sm font-semibold text-red-800">
          Failed to load projects
        </h3>
        <p className="mt-1 text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred."}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty state – no projects found
  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <Inbox className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No projects found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {filter === "my-projects"
            ? "You haven't submitted any projects yet."
            : "There are no projects to display."}
        </p>
      </div>
    );
  }

  // Success state – render projects
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          abstract={project.abstract}
          fileUrl={project.fileUrl}
          year={project.submissionYear}
          supervisor={project.supervisorName || "Assigned Faculty"}
          status={project.status}
        />
      ))}
    </div>
  );
}
