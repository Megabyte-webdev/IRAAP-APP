"use client";

import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import TaskItem from "./TaskItem";

const TaskList = ({
  currentProject,
  mostUrgent,
  firstUnfinishedTask,
  chapters,
}: any) => {
  const [collapsed, setCollapsed] = useState(false);

  // per-chapter collapse state
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  const toggleChapter = (chapter: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapter]: !(prev[chapter] ?? true),
    }));
  };

  return (
    <div className="col-span-12 lg:col-span-4">
      <div className="lg:sticky lg:top-8 flex flex-col h-[calc(100dvh-100px)] bg-white border rounded-2xl shadow-sm py-4">
        {/* HEADER */}
        <div className="relative flex flex-wrap gap-2 items-center justify-between mb-4 pr-7 mx-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            <h3 className="font-bold">Priority Tasks</h3>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/student/projects/${currentProject.id}`}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Open Project →
            </Link>

            <button
              onClick={() => setCollapsed((v) => !v)}
              className="absolute right-0 top-0 p-1 rounded hover:bg-slate-100 transition"
            >
              {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl space-y-3 mx-4">
          <p className="text-xs text-red-700 font-bold uppercase">
            Highest Priority
          </p>

          <p className="text-sm font-semibold mt-1">
            {mostUrgent?.[0] || "No urgent tasks"}
          </p>

          <Link
            href={`/student/projects/${currentProject.id}${
              firstUnfinishedTask ? `?task=${firstUnfinishedTask.id}` : ""
            }`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
          >
            Take Action <ArrowRight size={14} />
          </Link>
        </div>

        {!collapsed && (
          <div className="space-y-6 overflow-y-auto p-4">
            {chapters.map(([chapter, chapterTasks]: any) => {
              const isOpen = openChapters[chapter] ?? false;

              return (
                <div key={chapter} className="space-y-2">
                  {/* CHAPTER HEADER (clickable) */}
                  <button
                    onClick={() => toggleChapter(chapter)}
                    className="cursor-pointer w-full flex items-center justify-between"
                  >
                    <p
                      className={`text-xs font-bold uppercase ${isOpen ? "text-slate-500" : "text-slate-400"}`}
                    >
                      {chapter}
                    </p>

                    {isOpen ? (
                      <ChevronUp size={14} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={14} className="text-slate-400" />
                    )}
                  </button>

                  {/* TASKS */}
                  {isOpen && (
                    <div className="space-y-2">
                      {chapterTasks.map((task: any) => (
                        <TaskItem
                          key={task.id}
                          text={task.title}
                          completed={task.status === "VERIFIED"}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
