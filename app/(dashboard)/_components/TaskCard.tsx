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
  const { verifyTaskBySupervisor, deleteTask } = useSupervisor();
  const { updateTaskByStudent } = useStudent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const statusDetails = statusConfig[task.status];

  const isAnyMutationPending =
    verifyTaskBySupervisor.isPending ||
    deleteTask.isPending ||
    updateTaskByStudent.isPending;

  const handleUpdateStatus = (taskId: number, newStatus: TaskStatus) => {
    const options = {
      onSuccess: () => {
        let title = "Status Updated";
        let message = `Task is now ${newStatus.toLowerCase().replace("_", " ")}.`;

        if (newStatus === "PENDING" && !isSupervisor) {
          title = "Task Reset";
          message = "The task has been moved back to the pending queue.";
        } else if (newStatus === "IN_PROGRESS") {
          if (task.status === "COMPLETED") {
            title = "Submission Recalled";
            message = "Task moved back to 'In Progress' for further editing.";
          } else {
            title = "Task Started";
            message = "Time to get to work! Status set to 'In Progress'.";
          }
        } else if (newStatus === "COMPLETED") {
          title = "Great Work!";
          message = "Task submitted. Your supervisor has been notified.";
        }

        onSuccess({ title, message });
        setIsModalOpen(false);
      },
    };

    if (
      newStatus === "VERIFIED" ||
      (task.status === "COMPLETED" && newStatus === "PENDING")
    ) {
      verifyTaskBySupervisor.mutate({ taskId, projectId }, options);
    } else {
      updateTaskByStudent.mutate(
        { taskId, status: newStatus as any, projectId },
        options,
      );
    }
  };

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
        onClick={() => !isAnyMutationPending && setIsModalOpen(true)}
        className={`group relative flex flex-col h-full cursor-pointer rounded-xl border transition-all duration-200 active:scale-[0.98]
    ${
      active
        ? "bg-indigo-50 border-indigo-400 shadow-lg shadow-indigo-100 pl-4.5 animate-pulse hover:animate-none"
        : "bg-white border-slate-200 pl-5 hover:shadow-md hover:border-indigo-200 hover:bg-gray-50/50"
    }
    p-5 pr-5 pt-5 pb-5
  `}
      >
        {isAnyMutationPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 z-10 rounded-xl">
            <Loader2 className="animate-spin text-indigo-600" size={20} />
          </div>
        )}

        {/* Replaced Priority with Status Badge */}
        <div className="mb-4">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-md border shadow-sm ${statusDetails?.class}`}
          >
            {statusDetails?.label || task.status}
          </span>
        </div>

        <h4 className="text-sm font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex-1" />

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-slate-400">
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
              <div className="flex items-center gap-1.5 text-emerald-600">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Verified
                </span>
                <CheckCircle2 size={16} />
              </div>
            ) : (
              <ArrowRightCircle
                size={18}
                className="text-slate-300 group-hover:text-indigo-500 transition-colors"
              />
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          task={task}
          onClose={() => setIsModalOpen(false)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={() => setIsConfirmOpen(true)}
          isLoading={isAnyMutationPending}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={deleteTask.isPending}
      />
    </>
  );
};

export default TaskCard;
