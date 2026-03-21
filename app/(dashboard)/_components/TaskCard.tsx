"use client";

import { useState } from "react";
import { Task } from "@/app/_utils/types";
import {
  Calendar,
  ArrowRightCircle,
  CheckCircle2,
  AlignLeft,
} from "lucide-react";
import TaskModal from "./TaskModal";

interface TaskCardProps {
  task: Task;
  projectId: number;
}

const TaskCard = ({ task, projectId }: TaskCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const priority = (task as any).priority || "MEDIUM";

  const priorityStyles: Record<string, string> = {
    HIGH: "text-red-600 bg-red-50 border-red-100",
    MEDIUM: "text-amber-600 bg-amber-50 border-amber-100",
    LOW: "text-blue-600 bg-blue-50 border-blue-100",
  };

  // Internal Action Handler passed to Modal
  const handleUpdateStatus = (taskId: number, newStatus: string) => {
    console.log(
      `Updating Task ${taskId} to ${newStatus} for Project ${projectId}`,
    );
    // Replace with your actual API call / Context update
    setIsModalOpen(false);
  };

  const handleDelete = (taskId: number) => {
    console.log(`Deleting Task ${taskId}`);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer relative flex flex-col h-full active:scale-[0.98]"
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityStyles[priority]}`}
          >
            {priority}
          </span>
        </div>

        <h4 className="text-sm font-bold text-slate-800 leading-tight mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed italic">
            {task.description}
          </p>
        )}

        <div className="flex-1" />

        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar size={12} />
            <span className="text-[10px] font-semibold">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {task.description && (
              <AlignLeft size={12} className="text-slate-300" />
            )}
            {task.status === "VERIFIED" ? (
              <CheckCircle2 size={14} className="text-emerald-500" />
            ) : (
              <ArrowRightCircle size={14} className="text-slate-300" />
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          task={task}
          onClose={() => setIsModalOpen(false)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default TaskCard;
