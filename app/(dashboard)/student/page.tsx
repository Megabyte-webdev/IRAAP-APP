"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { useProject } from "@/app/_hooks/use-projects";
import {
  BookOpen,
  Upload,
  Clock,
  CheckCircle,
  Edit3,
  Eye,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { StatCard, StatusBadge } from "../_components/StatusHelper";

export default function StudentDashboard() {
  const { getProjects } = useProject();
  const { user } = useAuth();
  const { data: projects, isLoading } = getProjects();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your research submissions and track review progress.
          </p>
        </div>
        {!user?.user?.supervisorId ? (
          <div className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold opacity-50 cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-200">
            <Upload size={18} />
            New Submission
          </div>
        ) : (
          <Link
            href="/student/upload"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <Upload size={18} />
            New Submission
          </Link>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-responsive gap-6">
        <StatCard
          title="Total Projects"
          value={projects?.length || 0}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={
            projects?.filter((p: any) => p.status === "PENDING").length || 0
          }
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Approved"
          value={
            projects?.filter((p: any) => p.status === "APPROVED").length || 0
          }
          icon={CheckCircle}
          color="green"
        />
        <StatCard title="Downloads" value="0" icon={Upload} color="purple" />
      </div>

      {/* My Projects Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">My Submissions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Project Title</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Year</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">
                    Loading projects...
                  </td>
                </tr>
              ) : (
                projects?.map((project: any) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {project.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-500">
                      {project.submissionYear}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/student/projects/${project.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Project"
                        >
                          <Eye size={18} />
                        </Link>

                        {/* Only allow editing if NOT approved (optional business logic) */}
                        {project.status !== "APPROVED" && (
                          <Link
                            href={`/student/edit/${project.id}`}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit Project"
                          >
                            <Edit3 size={18} />
                          </Link>
                        )}

                        <button
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
