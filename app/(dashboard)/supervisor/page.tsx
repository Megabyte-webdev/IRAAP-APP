"use client";

import { PendingReviews } from "../_components/PendingReviews";
import { Clock, CheckCircle, XCircle, Users } from "lucide-react";

// Stat card component
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function SupervisorDashboard() {
  // Dummy stats – replace with real data later
  const stats = {
    pending: 8,
    approved: 15,
    rejected: 3,
    totalStudents: 42,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track student reviews efficiently
          </p>
        </header>

        {/* Stats Grid with dummy data */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pending Reviews"
            value={stats.pending}
            icon={Clock}
            color="bg-amber-500"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            color="bg-red-500"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            color="bg-blue-500"
          />
        </div>

        {/* Pending Reviews Section */}
        <section className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Projects Awaiting Review
            </h2>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              {stats.pending} pending
            </span>
          </div>
          <PendingReviews />
        </section>
      </div>
    </div>
  );
}
