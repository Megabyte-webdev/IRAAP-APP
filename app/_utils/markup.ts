import { Task } from "./types";

export const statusConfig = {
  PENDING: {
    label: "Pending",
    class: "bg-amber-50 border-amber-100 text-amber-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    class: "bg-purple-50 border-purple-100 text-purple-700",
  },
  COMPLETED: {
    label: "Completed",
    class: "bg-emerald-50 border-emerald-100 text-emerald-700",
  },
  VERIFIED: {
    label: "Verified",
    class: "bg-blue-50 border-blue-100 text-blue-700",
  },
};

export const getNextStatus = (task: Task, role: string) => {
  if (role === "STUDENT") {
    if (task.status === "PENDING") return "IN_PROGRESS";
    if (task.status === "IN_PROGRESS") return "COMPLETED";
  }

  if (role === "SUPERVISOR") {
    if (task.status === "COMPLETED") return "VERIFIED";
  }

  return null;
};
