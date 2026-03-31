"use client";

import Portal from "@/app/_components/Portal";
import { useAuth } from "@/app/_context/AuthContext";
import { statusConfig } from "@/app/_utils/markup";
import { Task, TaskStatus } from "@/app/_utils/types";
import {
  X,
  CheckCircle,
  MessageSquare,
  Trash2,
  Send,
  PlayCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdateStatus: (taskId: number, status: TaskStatus) => void;
  onDelete?: (taskId: number) => void;
  isLoading?: boolean;
}

const TaskModal = ({
  task,
  onClose,
  onUpdateStatus,
  onDelete,
  isLoading,
}: TaskModalProps) => {
  const { authDetails } = useAuth();
  const role = authDetails?.user?.role;
  const isSupervisor = role === "SUPERVISOR";
  const statusDetails = statusConfig[task?.status];

  // Logic: Supervisor can only act if student has finished ('COMPLETED')
  // We allow actions if NOT pending/in_progress, or simply check if status === 'COMPLETED'
  const canSupervisorAction = task.status === "COMPLETED";

  return (
    <Portal>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />

        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase">
                {isSupervisor ? "Supervisor Review" : "Task Details"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 max-h-[65vh] overflow-y-auto">
            <h1 className="text-xl font-extrabold text-slate-900 mb-4">
              {task.title}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Current Status
                </span>
                <span
                  className={`text-xs font-bold px-2 py-1 text-center rounded mt-1 ${statusDetails?.class}`}
                >
                  {statusDetails?.label}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Description
              </h5>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
                {task.description || "No description provided."}
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div>
              {isSupervisor && (
                <button
                  onClick={() => onDelete?.(Number(task.id))}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isSupervisor && (
                <>
                  {/* Disable Reject/Verify if task isn't completed by student */}
                  <button
                    onClick={() => onUpdateStatus(Number(task.id), "PENDING")}
                    disabled={isLoading || !canSupervisorAction}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    title={
                      !canSupervisorAction
                        ? "Task must be submitted before rejecting"
                        : ""
                    }
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                    Reject
                  </button>
                  <button
                    onClick={() => onUpdateStatus(Number(task.id), "VERIFIED")}
                    disabled={isLoading || !canSupervisorAction}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                    title={
                      !canSupervisorAction
                        ? "Task must be submitted before verifying"
                        : ""
                    }
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Verify & Close
                  </button>
                </>
              )}

              {!isSupervisor && (
                <div className="flex flex-col items-end gap-3 w-full">
                  {/* CASE: Task is IN_PROGRESS (Allow moving back to PENDING) */}
                  {task.status === "IN_PROGRESS" && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          onUpdateStatus(Number(task.id), "PENDING")
                        }
                        disabled={isLoading}
                        className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition underline underline-offset-4"
                      >
                        Reset to Pending
                      </button>
                      <button
                        onClick={() =>
                          onUpdateStatus(Number(task.id), "COMPLETED")
                        }
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition disabled:opacity-50"
                      >
                        <Send size={16} /> Submit for Review
                      </button>
                    </div>
                  )}

                  {/* CASE: Task is COMPLETED (Allow recalling to IN_PROGRESS) */}
                  {task.status === "COMPLETED" && (
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-bold text-slate-400 italic">
                        Submitted! Waiting for Approval
                      </span>
                      <button
                        onClick={() =>
                          onUpdateStatus(Number(task.id), "IN_PROGRESS")
                        }
                        disabled={isLoading}
                        className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-100"
                      >
                        {isLoading ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <RotateCcw size={12} />
                        )}
                        Recall to Edit
                      </button>
                    </div>
                  )}

                  {/* CASE: Task is PENDING (The Start Button) */}
                  {task.status === "PENDING" && (
                    <button
                      onClick={() =>
                        onUpdateStatus(Number(task.id), "IN_PROGRESS")
                      }
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition"
                    >
                      <PlayCircle size={16} /> Start Task
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default TaskModal;
