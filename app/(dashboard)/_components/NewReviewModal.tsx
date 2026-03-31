"use client";

import { useState } from "react";
import { X, Send, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import useSupervisor from "@/app/_hooks/use-supervisor";
import { toast } from "react-toastify";
import Portal from "@/app/_components/Portal";
import { onPrompt } from "@/app/_utils/Notification";

const NewReviewModal = ({ isOpen, onClose, projectId }: any) => {
  const { createReviewWithTasks } = useSupervisor();
  const [summary, setSummary] = useState("");
  const [tasks, setTasks] = useState([{ title: "", description: "" }]);

  if (!isOpen) return null;

  const handleAddTaskInput = () => {
    setTasks([...tasks, { title: "", description: "" }]);
  };

  const handleRemoveTaskInput = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, field: string, value: string) => {
    const newTasks = [...tasks];
    (newTasks[index] as any)[field] = value;
    setTasks(newTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim())
      return onPrompt({
        title: "Review",
        message: "Please provide a review summary",
      });

    // Filter out empty tasks
    const validTasks = tasks.filter((t) => t.title.trim() !== "");

    createReviewWithTasks.mutate(
      {
        projectId,
        summary,
        tasks: validTasks,
      },
      {
        onSuccess: () => {
          setSummary("");
          setTasks([{ title: "", description: "" }]);
          onClose();
        },
      },
    );
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
              New Revision Round
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Summary Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Review Focus / Summary
                </label>
                <textarea
                  required
                  className="w-full min-h-20 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                  placeholder="Overall feedback for this round..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              {/* Tasks Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Actionable Tasks
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTaskInput}
                    className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus size={12} /> Add Task
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="group relative p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2"
                    >
                      <input
                        className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                        placeholder="Task Title (e.g., Fix citations)"
                        value={task.title}
                        onChange={(e) =>
                          updateTask(index, "title", e.target.value)
                        }
                      />
                      <textarea
                        className="w-full bg-transparent text-xs outline-none text-slate-600 resize-none"
                        placeholder="Optional description..."
                        value={task.description}
                        onChange={(e) =>
                          updateTask(index, "description", e.target.value)
                        }
                      />
                      {tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTaskInput(index)}
                          className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
              <div className="flex gap-2 items-start">
                <AlertCircle
                  size={14}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <p className="text-[10px] text-slate-500 leading-tight">
                  Submitting will notify the student and set project status to
                  REVISION REQUESTED.
                </p>
              </div>
              <button
                type="submit"
                disabled={createReviewWithTasks.isPending}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {createReviewWithTasks.isPending ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Send size={14} />
                )}
                Send Review to Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default NewReviewModal;
