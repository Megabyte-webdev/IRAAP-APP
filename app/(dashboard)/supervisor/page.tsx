"use client";

import {
  Clock,
  CheckCircle,
  RefreshCcw,
  BookOpen,
  Eye,
  ArrowRight,
} from "lucide-react";
import useSupervisor from "@/app/_hooks/use-supervisor";
import { Project } from "@/app/_utils/types";
import Link from "next/link";
import { statusStyles } from "../_components/StatusHelper";
import StatsCard from "../admin/_components/StatCard";

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

  const isGlobalLoading = statsLoading || projectsLoading;

  if (isGlobalLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-96 bg-slate-200 rounded-md" />
        </div>
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 bg-slate-100 border border-slate-200 rounded-xl"
            />
          ))}
        </div>
        {/* Table Content Skeleton */}
        <div className="h-96 bg-slate-50 border border-slate-200 rounded-xl" />
      </div>
    );
  }

  if (statsError || projectsError) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="p-5 bg-rose-50 border border-rose-100 rounded-xl text-center text-rose-700 space-y-1">
          <p className="font-semibold text-sm">
            Failed to synchronize supervisor panel intelligence
          </p>
          <p className="text-xs opacity-80">
            Please check your network status or try refreshing the view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header Block Layout */}
      <div className="flex flex-col gap-1.5 pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Supervisor Dashboard
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Manage, audit, and provide structured revisions for assigned student
          research portfolios and institutional submissions.
        </p>
      </div>

      {/* Stats Cards Dashboard Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats?.projects}
          icon={<BookOpen className="w-5 h-5" />}
          iconColorClass="bg-blue-50 border-blue-100 text-blue-600"
          description="Assigned researchers"
        />
        <StatsCard
          title="Project Reviews"
          value={stats?.projectReviews}
          icon={<Clock className="w-5 h-5" />}
          iconColorClass="bg-amber-50 border-amber-100 text-amber-600"
          description="Pending feedback loops"
        />
        <StatsCard
          title="Approved"
          value={stats?.approved}
          icon={<CheckCircle className="w-5 h-5" />}
          iconColorClass="bg-emerald-50 border-emerald-100 text-emerald-600"
          description="Archived & locked records"
        />
        <StatsCard
          title="Revisions"
          value={stats?.revisions}
          icon={<RefreshCcw className="w-5 h-5" />}
          iconColorClass="bg-purple-50 border-purple-100 text-purple-600"
          description="Awaiting student updates"
        />
      </div>

      {/* Projects Table Shell Pane */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/90 overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Assigned Research Portfolios
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Review live abstracts, change history tracking tables, and set phase
            criteria logs.
          </p>
        </div>

        <div className="overflow-x-auto">
          {!projects || projects.length === 0 ? (
            <div className="text-center text-slate-400 py-16 text-sm font-normal">
              No assigned research profiles detected in your roster pool.
            </div>
          ) : (
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5 text-left font-semibold">
                    Project Title
                  </th>
                  <th className="px-6 py-3.5 text-left font-semibold">
                    Assigned Student
                  </th>
                  <th className="px-6 py-3.5 text-center font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-center font-semibold">
                    Year
                  </th>
                  <th className="px-6 py-3.5尊 text-right font-semibold pr-8">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project: Project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 max-w-sm truncate">
                      {project.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-normal">
                      {project.student || "Unassigned Record"}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border shadow-2xs ${
                          statusStyles[project.status] ||
                          "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 tabular-nums">
                      {project.submissionYear}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap pr-8">
                      <Link
                        href={`/supervisor/projects/${project.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/50 group-hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/60 transition-all"
                      >
                        <Eye size={14} className="opacity-90" />
                        <span>Audit Space</span>
                        <ArrowRight
                          size={12}
                          className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                        />
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
