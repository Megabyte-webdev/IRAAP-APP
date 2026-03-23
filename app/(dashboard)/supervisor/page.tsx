"use client";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import {
  Clock,
  CheckCircle,
  RefreshCcw,
  BookOpen,
  Eye,
  Loader2,
} from "lucide-react";
import useSupervisor from "@/app/_hooks/use-supervisor";
import { Project } from "@/app/_utils/types";
import Link from "next/link";
import { statusStyles } from "../_components/StatusHelper";

export default function SupervisorDashboard() {
  const { getSupervisorProjects, getSupervisorStats } = useSupervisor();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = getSupervisorStats();
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = getSupervisorProjects();

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
        {statsLoading ? (
          <div className="col-span-4 flex justify-center p-10">
            <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
          </div>
        ) : statsError ? (
          <div className="col-span-4 text-center text-red-600 p-10">
            Failed to load stats.
          </div>
        ) : (
          dashboardStats.map(
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
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
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
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
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
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
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
          )
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
          {projectsLoading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
            </div>
          ) : projectsError ? (
            <div className="text-center text-red-600 p-10">
              Failed to load projects.
            </div>
          ) : projects?.length === 0 ? (
            <div className="text-center text-gray-500 p-10">
              No assigned projects.
            </div>
          ) : (
            <table className="w-full min-w-200 text-sm">
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
                    <td className="px-6 text-center">
                      {project.submissionYear}
                    </td>
                    <td className="px-6 text-right space-x-2">
                      <Link
                        href={`/supervisor/projects/${project.id}`}
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Eye size={16} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
