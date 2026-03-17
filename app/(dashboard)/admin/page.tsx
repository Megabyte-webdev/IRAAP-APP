"use client";
import { Users, FileText, LayoutGrid } from "lucide-react";
import BulkAssignTable from "./_components/BulkAssignTable";
import StatsCard from "./_components/StatCard";
import useAdmin from "@/app/_hooks/use-admin";

export default function AdminDashboard() {
  const { adminDashboardData } = useAdmin();
  const { data: stats } = adminDashboardData();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Admin Command Center</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats?.totalProjects}
          icon={<FileText className="w-8 h-8 text-blue-500" />}
        />
        <StatsCard
          title="Registered Users"
          value={stats?.totalUsers}
          icon={<Users className="w-8 h-8 text-purple-500" />}
        />
        <StatsCard
          title="Categories"
          value={stats?.totalCategories}
          icon={<LayoutGrid className="w-8 h-8 text-orange-500" />}
        />
      </div>

      {/* The Matchmaker Tool */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold">Bulk Student Assignment</h2>
          <p className="text-slate-500 text-sm">
            Select students and assign them to a supervisor in one click.
          </p>
        </div>
        <BulkAssignTable />
      </div>
    </div>
  );
}
