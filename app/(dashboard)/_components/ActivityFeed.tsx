"use client";

import { FileText, MessageSquare, Star } from "lucide-react";
import { useProject } from "@/app/_hooks/use-projects";
import { useParams } from "next/navigation";
import { getTriggerMeta } from "@/app/_utils/formatters";

const ActivityFeed = ({ reviews, loading }: any) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectVersionHistory } = useProject();
  const { data: historyData, isLoading: versionsLoading } =
    getProjectVersionHistory(Number(projectId));

  const versions = historyData?.versions ?? [];
  const hasVersions = versions.length > 0;
  const hasReviews = reviews?.length > 0;

  if (loading || versionsLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 mt-1" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-2.5 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!hasVersions && !hasReviews) {
    return (
      <div className="flex flex-col items-center justify-center py-10 opacity-40 text-slate-600 dark:text-slate-400">
        <MessageSquare size={32} className="mb-2" />
        <p className="text-xs font-medium">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* VERSION HISTORY SECTION */}
      {hasVersions && (
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Submission History
          </p>

          <div className="relative space-y-4 before:absolute before:inset-0 before:ml-2.25 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-slate-200 before:via-slate-200 before:to-transparent dark:before:from-slate-800 dark:before:via-slate-800">
            {versions.map((v: any) => {
              const meta = getTriggerMeta(v.trigger, v.isCurrent);

              return (
                <div key={v.id} className="relative flex items-start gap-3">
                  {/* Timeline dot */}
                  <div
                    className={`
                      shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 mt-0.5
                      ${meta.color}
                    `}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  </div>

                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {/* Version + label */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">
                            v{v.versionNumber}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {meta.label}
                          </span>
                          {v.isCurrent && (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full">
                              <Star size={8} />
                              Current
                            </span>
                          )}
                        </div>

                        {/* Change note */}
                        {v.changeNote && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {v.changeNote}
                          </p>
                        )}

                        {/* Uploader + file size */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {v.uploadedBy && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              by{" "}
                              <span className="font-medium text-slate-500 dark:text-slate-400">
                                {v.uploadedBy}
                              </span>
                            </span>
                          )}
                          {v.fileSizeBytes && (
                            <span className="text-[10px] text-slate-300 dark:text-slate-600">
                              {(v.fileSizeBytes / 1024).toFixed(0)} KB
                            </span>
                          )}
                        </div>
                      </div>

                      {/* File download link */}
                      <a
                        href={v.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors border border-slate-100 dark:border-slate-700/80"
                        title="Download file"
                      >
                        <FileText size={11} />
                      </a>
                    </div>

                    <time className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                      {new Date(v.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REVIEW ROUNDS SECTION */}
      {hasReviews && (
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Review Rounds
          </p>

          <div className="relative space-y-4 before:absolute before:inset-0 before:ml-2.25 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-slate-200 before:via-slate-200 before:to-transparent dark:before:from-slate-800 dark:before:via-slate-800">
            {reviews.map((rev: any) => (
              <div key={rev.id} className="relative flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 flex items-center justify-center z-10 mt-0.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      rev.revisionSubmitted ? "bg-amber-400" : "bg-blue-400"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {rev.summary}
                    </p>
                    {rev.revisionSubmitted && (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-full">
                        Submitted
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {rev.tasks?.length ?? 0} task
                    {rev.tasks?.length !== 1 ? "s" : ""}
                  </p>

                  <time className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
