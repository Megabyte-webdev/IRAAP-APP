"use client";

import { useState } from "react";
import TaskModal from "./TaskModal";
import { useTaskVersions } from "@/app/_hooks/useTaskVersion";

export default function TaskCard({ task, version }: any) {
  const [open, setOpen] = useState(false);

  const { submitVersion, approveVersion, rejectVersion, recallVersion } =
    useTaskVersions();

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="border rounded-lg p-3 cursor-pointer hover:bg-slate-50"
      >
        <h4 className="text-sm font-semibold">{task.title}</h4>
        <p className="text-xs text-slate-500">{version?.status}</p>
      </div>

      {open && (
        <TaskModal
          task={task}
          version={version}
          onClose={() => setOpen(false)}
          actions={{
            submitVersion,
            approveVersion,
            rejectVersion,
            recallVersion,
          }}
        />
      )}
    </>
  );
}
