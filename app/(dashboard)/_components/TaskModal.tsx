"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { statusConfig } from "@/app/_utils/markup";
import { Task } from "@/app/_utils/types";
import {
  X,
  CheckCircle,
  Clock,
  MessageSquare,
  Trash2,
  Send,
  PlayCircle,
  RotateCcw,
} from "lucide-react";

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdateStatus: (taskId: number, status: string) => void;
  onDelete?: (taskId: number) => void;
}

const TaskModal = ({
  task,
  onClose,
  onUpdateStatus,
  onDelete,
}: TaskModalProps) => {
  const { user } = useAuth();
  const role = user?.user?.role; // Expected: "STUDENT" or "SUPERVISOR"
  const isSupervisor = role === "SUPERVISOR";

  const statusDetails = statusConfig[task?.status];

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
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
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 size={16} /> Delete
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* SUPERVISOR ONLY: Verify and Reject */}
            {isSupervisor && (
              <>
                <button
                  onClick={() => onUpdateStatus(Number(task.id), "PENDING")}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <RotateCcw size={16} /> Reject
                </button>
                <button
                  onClick={() => onUpdateStatus(Number(task.id), "VERIFIED")}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md"
                >
                  <CheckCircle size={16} /> Verify & Close
                </button>
              </>
            )}

            {/* STUDENT ONLY: Progress through PENDING -> IN_PROGRESS -> COMPLETED */}
            {!isSupervisor && (
              <>
                {task.status === "PENDING" && (
                  <button
                    onClick={() =>
                      onUpdateStatus(Number(task.id), "IN_PROGRESS")
                    }
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md"
                  >
                    <PlayCircle size={16} /> Start Task
                  </button>
                )}
                {task.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => onUpdateStatus(Number(task.id), "COMPLETED")}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md"
                  >
                    <Send size={16} /> Submit for Review
                  </button>
                )}
                {task.status === "COMPLETED" && (
                  <span className="text-xs font-bold text-slate-400 italic">
                    Pending Supervisor Approval
                  </span>
                )}
                {task.status === "VERIFIED" && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                    <CheckCircle size={16} /> Task Completed & Verified
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
