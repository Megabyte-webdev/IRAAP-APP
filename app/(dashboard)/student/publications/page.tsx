"use client";

import { useAuth } from "@/app/_context/AuthContext";
import NoSupervisor from "../../_components/NoSupervisor";
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { cn, extractErrorMessage } from "@/app/_lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePublication } from "@/app/_hooks/use-publications";
import { FilterStatus, Publication } from "@/app/_utils/types";

export default function PublicationsPage() {
  const { authDetails } = useAuth();
  const { getMyPublications } = usePublication();
  const hasSupervisor = authDetails?.user?.supervisorId;
  const { data: publications = [], isLoading, error } = getMyPublications();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");

  if (!hasSupervisor) return <NoSupervisor />;

  const filteredPublications = publications?.filter((pub: Publication) => {
    if (filterStatus === "ALL") return true;
    return pub.status === filterStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock size={16} className="text-yellow-600" />;
      case "APPROVED":
        return <CheckCircle size={16} className="text-green-600" />;
      case "REJECTED":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 border-yellow-200";
      case "APPROVED":
        return "bg-green-50 border-green-200";
      case "REJECTED":
        return "bg-red-50 border-red-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-primary">
                  <BookOpen size={14} className="text-white" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  IRAP Repository
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                My Publications
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                View and manage your research publications
              </p>
            </div>

            <Link
              href="/student/publications/submit"
              className={cn(
                "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium",
                "bg-primary text-white hover:bg-primary/90 transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "whitespace-nowrap",
              )}
            >
              <Plus size={18} />
              Create Publication
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Total
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {publications.length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Pending
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {
                  publications.filter(
                    (p: { status: string }) => p.status === "PENDING",
                  ).length
                }
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Approved
              </p>
              <p className="text-2xl font-bold text-green-600">
                {
                  publications.filter(
                    (p: { status: string }) => p.status === "APPROVED",
                  ).length
                }
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Rejected
              </p>
              <p className="text-2xl font-bold text-red-600">
                {
                  publications.filter(
                    (p: { status: string }) => p.status === "REJECTED",
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        {publications.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {(["ALL", "PENDING", "APPROVED", "REJECTED"] as FilterStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    filterStatus === status
                      ? "bg-primary text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {status}
                </button>
              ),
            )}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full" />
            </div>
            <p className="mt-4 text-slate-600">Loading publications...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-900 font-medium">
              Error loading publications
            </p>
            <p className="text-red-800 text-sm mt-1">
              {extractErrorMessage(error)}
            </p>
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-slate-100 rounded-lg">
                <BookOpen size={24} className="text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {publications.length === 0
                ? "No publications yet"
                : "No publications match the selected filter"}
            </h3>
            <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">
              {publications.length === 0
                ? "Start by creating your first publication submission"
                : "Try adjusting your filters to see more results"}
            </p>
            {publications.length === 0 && (
              <Link
                href="/student/publications/submit"
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium",
                  "bg-primary text-white hover:bg-primary/90 transition-all",
                )}
              >
                <Plus size={18} />
                Create Your First Publication
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPublications.map((publication: Publication) => (
              <div
                key={publication.id}
                className={cn(
                  "bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all group",
                  getStatusColor(publication.status),
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="mt-1">
                        {getStatusIcon(publication.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                          {publication.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {publication.abstract}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <span
                        className={cn(
                          "inline-block px-3 py-1 rounded-full text-xs font-semibold",
                          getStatusBadgeColor(publication.status),
                        )}
                      >
                        {publication.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        Submitted{" "}
                        {new Date(publication.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <a
                      href={publication.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
                        "bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all text-sm font-medium",
                        "whitespace-nowrap",
                      )}
                    >
                      View PDF
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>

                {/* Status message */}
                {publication.status === "REJECTED" && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                    <p className="text-xs font-medium text-red-900">
                      This publication was rejected. You can submit a new
                      version.
                    </p>
                  </div>
                )}

                {publication.status === "APPROVED" && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                    <p className="text-xs font-medium text-green-900">
                      ✓ This publication has been approved and is visible in the
                      repository.
                    </p>
                  </div>
                )}

                {publication.status === "PENDING" && (
                  <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
                    <p className="text-xs font-medium text-yellow-900">
                      ⏳ Waiting for supervisor review. This typically takes 2-5
                      business days.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
