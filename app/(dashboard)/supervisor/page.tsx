"use client";

import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { Clock, CheckCircle, RefreshCcw, BookOpen, Eye } from "lucide-react";
import useSupervisor from "@/app/_hooks/use-supervisor";
import { Project } from "@/app/_utils/types";
import ProjectReviewModal from "../_components/ProjectReviewModal";

const statusStyles: Record<string, string> = {
  APPROVED: "bg-green-100 text-green-600",
  PENDING: "bg-yellow-100 text-yellow-600",
  REJECTED: "bg-red-100 text-red-600",
  REVISION_REQUESTED: "bg-purple-100 text-purple-600",
};

export default function SupervisorDashboard() {
  const {
    getSupervisorProjects,
    getSupervisorStats,
    createReviewWithTasks,
    updateProjectStatus,
  } = useSupervisor();

  const { data: stats } = getSupervisorStats();
  const { data: projects } = getSupervisorProjects();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const dashboardStats: any = [
    {
      label: "Total Projects",
      value: stats?.projects || 0,
      icon: <BookOpen className="text-blue-600" />,
    },
    {
      label: "Project Reviews",
      value: stats?.projectReviews || 0,
      icon: <Clock className="text-yellow-600" />,
    },
    {
      label: "Approved",
      value: stats?.approved || 0,
      icon: <CheckCircle className="text-green-600" />,
    },
    {
      label: "Revisions",
      value: stats?.revisions || 0,
      icon: <RefreshCcw className="text-purple-600" />,
    },
  ];

  const handleSaveReview = (text: string) => {
    if (!selectedProject) return;
    createReviewWithTasks.mutate({
      projectId: selectedProject!.id,
      tasks: [
        { title: "Fix Chapter 1 references" },
        { title: "Add methodology diagram" },
      ],
    });
  };

  const handleStatusUpdate = (
    status: "APPROVED" | "REJECTED" | "REVISION_REQUESTED",
  ) => {
    if (!selectedProject) return;

    updateProjectStatus.mutate(
      { projectId: selectedProject.id, status },
      {
        onSuccess: (updatedProject) => {
          setSelectedProject((prev) => (prev ? { ...prev, status } : null));
        },
      },
    );
  };

  return (
    <div className="p-6 md:p-10 space-y-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Supervisor Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, review, and approve student research submissions.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dashboardStats?.map(
          (
            item: {
              icon:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined;
              label:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined;
              value:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined;
            },
            i: Key | null | undefined,
          ) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border p-5 flex items-center gap-4 hover:shadow-md transition"
            >
              {item.icon}
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <h3 className="text-xl font-semibold">{item.value}</h3>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Projects Table */}
      <div className="bg-white border rounded-2xl shadow-sm">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Assigned Projects
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Year</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((project: Project) => (
                <tr
                  key={project.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 max-w-xs truncate">
                    {project.title}
                  </td>
                  <td className="px-6">{project.student}</td>
                  <td className="px-6 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${statusStyles[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 text-center">{project.submissionYear}</td>
                  <td className="px-6 text-right space-x-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectReviewModal
          project={selectedProject!}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          reviewLoading={createReviewWithTasks.isPending}
          statusLoading={updateProjectStatus.isPending}
          onSaveReview={(text) => handleSaveReview(text)}
          onStatusChange={(status) => handleStatusUpdate(status)}
        />
      )}
    </div>
  );
}
