"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/app/_utils/types";
import { statusConfig } from "@/app/_utils/markup"; // Added this import
import useStudent from "@/app/_hooks/use-student";
import useSupervisor from "@/app/_hooks/use-supervisor";
import {
  Calendar,
  ArrowRightCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import TaskModal from "./TaskModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { onSuccess } from "@/app/_utils/Notification";
import { useAuth } from "@/app/_context/AuthContext";

interface TaskCardProps {
  task: Task;
  projectId: number;
  active?: boolean;
  setRef?: (el: HTMLDivElement | null) => void;
}

const TaskCard = ({ task, projectId, active, setRef }: TaskCardProps) => {
  const { authDetails } = useAuth();
  const role = authDetails?.user?.role;
  const isSupervisor = role === "SUPERVISOR";
  const { verifyReviewRound, deleteTask } = useSupervisor();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const statusDetails = statusConfig[task.status];

  const confirmDelete = () => {
    deleteTask.mutate(
      { taskId: Number(task.id), projectId },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          setIsModalOpen(false);
        },
      },
    );
  };

  return (
    <>
      <div
        ref={setRef}
        onClick={() => setIsModalOpen(true)}
        className={`group relative flex flex-col h-full cursor-pointer rounded-xl border transition-all duration-200 active:scale-[0.98]
    ${
      active
        ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-400 dark:border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 pl-4.5 animate-pulse hover:animate-none"
        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 pl-5 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700/50 hover:bg-gray-50/50 dark:hover:bg-slate-700/30"
    }
    p-5 pr-5 pt-5 pb-5
  `}
      >
        {/* Replaced Priority with Status Badge */}
        <div className="mb-4">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-md border shadow-sm ${statusDetails?.class}`}
          >
            {statusDetails?.label || task.status}
          </span>
        </div>

        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex-1" />

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <Calendar size={13} />
            <span className="text-[10px] font-semibold">
              {new Date(task.createdAt || Date.now()).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" },
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {task.status === "VERIFIED" ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Verified
                </span>
                <CheckCircle2 size={16} />
              </div>
            ) : (
              <ArrowRightCircle
                size={18}
                className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors"
              />
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal task={task} onClose={() => setIsModalOpen(false)} />
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"?`}
        onConfirm={confirmDelete}
        onClose={() => setIsConfirmOpen(false)}
        isLoading={deleteTask.isPending}
      />
    </>
  );
};

export default TaskCard;
