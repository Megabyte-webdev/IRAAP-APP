"use client";

import { useState } from "react";
import { Loader2, ChevronDown, ChevronRight, Hash } from "lucide-react";
import TaskCard from "./TaskCard";

const columns = ["PENDING", "IN_PROGRESS", "COMPLETED", "VERIFIED"];

const ProjectTaskBoard = ({ tasks, loading, projectId }: any) => {
  // Keep track of which sections are collapsed
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (col: string) => {
    setCollapsed((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center w-full">
        <Loader2 className="animate-spin text-indigo-400" size={24} />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 pb-20 max-w-5xl mx-auto">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t: any) => t.status === col);
        const isCollapsed = collapsed[col];

        return (
          <div
            key={col}
            className="flex flex-col bg-white/50 rounded-xl border border-slate-200/60 shadow-sm"
          >
            {/* Section Header - Clickable to toggle */}
            <button
              onClick={() => toggleSection(col)}
              className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors text-left"
            >
              {isCollapsed ? (
                <ChevronRight size={16} className="text-slate-400" />
              ) : (
                <ChevronDown size={16} className="text-slate-400" />
              )}

              <div
                className={`w-2 h-2 rounded-full ${
                  col === "VERIFIED"
                    ? "bg-emerald-500"
                    : col === "COMPLETED"
                      ? "bg-blue-500"
                      : "bg-slate-300"
                }`}
              />

              <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex-1">
                {col.replace("_", " ")}
              </h3>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                <Hash size={10} />
                {columnTasks.length}
              </div>
            </button>

            {/* Task List - Hidden if collapsed */}
            {!isCollapsed && (
              <div className="p-3 bg-[#F8FAFC]/50 border-t border-slate-100">
                {columnTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {columnTasks.map((task: any) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        projectId={projectId}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center opacity-40">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      No tasks in this stage
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectTaskBoard;
