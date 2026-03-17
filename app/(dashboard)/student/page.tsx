"use client";

import { useProject } from "@/app/_hooks/use-projects";
import { BookOpen, Upload, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const { getProjects } = useProject();
  const { data: projects } = getProjects();
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-500">
          Manage your research submissions and track review progress.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <BookOpen className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <h3 className="text-xl font-bold">{projects?.length || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <Clock className="text-yellow-600" />
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <h3 className="text-xl font-bold">
                {projects?.filter(
                  (p: { status: string }) => p.status === "PENDING",
                ).length || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <CheckCircle className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <h3 className="text-xl font-bold">
                {projects?.filter(
                  (p: { status: string }) => p.status === "APPROVED",
                ).length || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <Upload className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Downloads</p>
              <h3 className="text-xl font-bold">56</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="flex gap-4">
          <Link
            href="/student/upload"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload Project
          </Link>

          <Link
            href="/student/research"
            className="border px-5 py-2 rounded-lg hover:bg-gray-50"
          >
            Browse Research
          </Link>
        </div>
      </div>

      {/* My Projects Table */}
      <div className="bg-white border rounded-xl p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">My Projects</h2>

        <table className="w-full min-w-[800px] text-left">
          <thead className="border-b">
            <tr className="text-gray-500 text-sm">
              <th className="py-3">Title</th>
              <th>Status</th>
              <th>Submission Year</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {projects?.map(
              (project: {
                id: string;
                title: string;
                status: string;
                submissionYear: string;
              }) => (
                <tr key={project.id} className="border-b">
                  <td className="py-3">{project.title}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        project.status === "pending"
                          ? "text-yellow-600 bg-yellow-100"
                          : project.status === "approved"
                            ? "text-green-600 bg-green-100"
                            : "text-red-600 bg-red-100"
                      }`}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </span>
                  </td>
                  <td>{project.submissionYear}</td>
                  <td>
                    <button className="text-blue-600 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
