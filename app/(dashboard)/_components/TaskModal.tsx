"use client";

import Portal from "@/app/_components/Portal";
import { statusConfig } from "@/app/_utils/markup";
import { Task } from "@/app/_utils/types";
import { X, MessageSquare } from "lucide-react";

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

const TaskModal = ({ task, onClose }: TaskModalProps) => {
  const statusDetails = statusConfig[task?.status];

  return (
    <Portal>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-transparent dark:border-slate-800 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight uppercase">
                Task Details
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 max-h-[65vh] overflow-y-auto">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
              {task.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
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
              <h5 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Description
              </h5>
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {task.description || "No description provided."}
              </div>
            </div>
          </div>

          {/* Footer (Simplified Actionless layout) */}
          <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default TaskModal;
