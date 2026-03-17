"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, CheckCircle, RefreshCcw, BookOpen } from "lucide-react";

interface Project {
  id: number;
  title: string;
  student: string;
  status: string;
  submissionYear: string;
}

export default function SupervisorDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    revisions: 0,
  });

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    axios.get("/api/supervisor/stats").then((res) => setStats(res.data));
    axios.get("/api/supervisor/projects").then((res) => setProjects(res.data));
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Supervisor Dashboard
        </h1>
        <p className="text-gray-500">
          Review and manage student research submissions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
          <BookOpen className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Projects</p>
            <h3 className="text-xl font-bold">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
          <Clock className="text-yellow-600" />
          <div>
            <p className="text-sm text-gray-500">Pending Reviews</p>
            <h3 className="text-xl font-bold">{stats.pending}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
          <CheckCircle className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <h3 className="text-xl font-bold">{stats.approved}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
          <RefreshCcw className="text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Revisions Requested</p>
            <h3 className="text-xl font-bold">{stats.revisions}</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-xl p-6 flex gap-4">
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          Review Latest Projects
        </button>
        <button className="border px-5 py-2 rounded-lg hover:bg-gray-50">
          Search Projects
        </button>
      </div>

      {/* Assigned Projects Table */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Assigned Projects</h2>

        <table className="w-full text-left">
          <thead className="border-b">
            <tr className="text-gray-500 text-sm">
              <th className="py-3">Title</th>
              <th>Student</th>
              <th>Status</th>
              <th>Submission Year</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {projects.map((project) => (
              <tr key={project.id} className="border-b">
                <td className="py-3">{project.title}</td>
                <td>{project.student}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      project.status === "APPROVED"
                        ? "bg-green-100 text-green-600"
                        : project.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td>{project.submissionYear}</td>
                <td>
                  <button className="text-blue-600 hover:underline mr-2">
                    View
                  </button>
                  <button className="text-green-600 hover:underline">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
