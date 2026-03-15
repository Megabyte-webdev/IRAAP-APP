"use client";
import { useState, useEffect } from "react";
import ProjectUploadForm from "@/app/_components/ProjectUploadForm";
import { ProjectList } from "../_components/ProjectList";

export default function StudentDashboard() {
  const [isListLoading, setIsListLoading] = useState(true);

  // Simulate initial data fetch (replace with real data fetching logic)
  useEffect(() => {
    const timer = setTimeout(() => setIsListLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Department of Computer Engineering, Olabisi Onabanjo University
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upload Form Card (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <ProjectUploadForm />
          </div>

          {/* Submissions List Card (1/3 width on large screens) */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Your Submissions
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Track the status of your projects
              </p>

              {isListLoading ? (
                // Loading skeleton for the list
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-lg bg-gray-200"
                    />
                  ))}
                </div>
              ) : (
                <ProjectList filter="my-projects" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
