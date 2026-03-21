"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { getNextStatus, statusConfig } from "@/app/_utils/markup";
import { ProjectReviewsProps, Task } from "@/app/_utils/types";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const ProjectReviews = ({ reviews, historyLoading }: ProjectReviewsProps) => {
  const { user } = useAuth();
  const role: "STUDENT" | "SUPERVISOR" = user?.user?.role;
  const onUpdateTaskStatus = async (taskId: number, status: string) => {};
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  const handleUpdate = async (taskId: number, status: string) => {
    try {
      setUpdatingTaskId(taskId);
      await onUpdateTaskStatus(taskId, status);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
      {historyLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-2" size={24} />
          <p className="text-xs font-medium">Fetching tasks...</p>
        </div>
      ) : reviews?.length > 0 ? (
        reviews.map((rev: any) => (
          <div
            key={rev.id}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {new Date(rev.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </span>
            </div>

            {/* Summary */}
            {rev.summary && (
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{rev.summary}"
              </p>
            )}

            {/* Tasks */}
            {rev.tasks?.length > 0 && (
              <div className="mt-3 space-y-2">
                {rev.tasks.map((task: Task) => {
                  const nextStatus = getNextStatus(task, role);
                  const isUpdating = updatingTaskId === Number(task?.id);

                  const statusMeta =
                    statusConfig[task.status] || statusConfig["PENDING"];

                  return (
                    <div
                      key={task.id}
                      className="group p-3 border rounded-xl bg-white flex items-center justify-between gap-3 hover:shadow-sm transition-all"
                    >
                      {/* LEFT */}
                      <div className="flex items-start gap-3">
                        {/* Status Dot */}
                        <div
                          className={`w-2.5 h-2.5 mt-1 rounded-full ${
                            task.status === "VERIFIED"
                              ? "bg-blue-500"
                              : task.status === "COMPLETED"
                                ? "bg-emerald-500"
                                : task.status === "IN_PROGRESS"
                                  ? "bg-purple-500"
                                  : "bg-amber-400"
                          }`}
                        />

                        <div>
                          <p className="font-medium text-sm text-slate-800">
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${statusMeta.class}`}
                        >
                          {statusMeta.label}
                        </span>

                        {/* Action Button */}
                        {nextStatus && (
                          <button
                            onClick={() =>
                              handleUpdate(Number(task.id), nextStatus)
                            }
                            disabled={isUpdating}
                            className="text-xs px-3 py-1 rounded-lg bg-slate-900 text-white hover:bg-black transition disabled:opacity-50 flex items-center justify-center"
                          >
                            {isUpdating ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : nextStatus === "VERIFIED" ? (
                              "Verify"
                            ) : (
                              "Update"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-20">
          <p className="text-sm text-slate-400 font-medium">
            No tasks/reviews found.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectReviews;
