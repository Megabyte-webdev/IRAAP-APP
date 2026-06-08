"use client";

import { useMemo } from "react";
import TaskCard from "./TaskCard";

const STATUS_ORDER = ["DRAFT", "SUBMITTED", "REJECTED", "APPROVED"];

export default function ProjectTaskBoard({ project }: any) {
  const tasks = project.tasks;

  const grouped = useMemo(() => {
    const map: any = {};

    STATUS_ORDER.forEach((s) => (map[s] = []));

    tasks?.forEach((task: any) => {
      const version = task.versions?.find(
        (v: any) => v.id === task.currentVersionId,
      );

      const status = version?.status || "DRAFT";
      map[status].push({ task, version });
    });

    return map;
  }, [tasks]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {STATUS_ORDER.map((status) => (
        <div key={status} className="bg-white rounded-lg p-3 border">
          <h3 className="text-xs font-bold mb-3">{status}</h3>

          <div className="space-y-3">
            {grouped[status].map((item: any) => (
              <TaskCard
                key={item.task.id}
                task={item.task}
                version={item.version}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
