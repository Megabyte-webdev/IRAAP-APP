"use client";

import { useAuth } from "@/app/_context/AuthContext";
import NoSupervisor from "../../_components/NoSupervisor";
import { FolderOpen, Check } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import ProjectForm from "@/app/_components/ProjectUploadForm";
import { SectionCompletion } from "@/app/_utils/types";
import { useState } from "react";
import { projectSubmissionSteps } from "@/app/_utils/utility";

export default function UploadPage() {
  const { authDetails } = useAuth();
  const hasSupervisor = authDetails?.user?.supervisorId;

  const [completion, setCompletion] = useState<SectionCompletion>({
    details: false,
    upload: false,
    keywords: false,
  });

  if (!hasSupervisor) return <NoSupervisor />;

  const completedCount = Object.values(completion).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 px-4 py-10 lg:px-12 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-primary">
              <FolderOpen size={14} className="text-white" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              IRAP Repository
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Submit research project
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-lg">
            Complete all sections below to publish your project to the
            repository. Fields marked * are required.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Mobile progress */}
          <div className="lg:hidden sticky top-0 z-20 bg-[#F8FAFC] dark:bg-slate-900 pb-4">
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Progress
                </span>
                <span className="text-xs font-bold text-primary">
                  {completedCount}/{projectSubmissionSteps.length}
                </span>
              </div>

              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${(completedCount / projectSubmissionSteps.length) * 100}%`,
                  }}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {projectSubmissionSteps.map(({ icon: Icon, label, key }) => {
                  const done = completion[key as keyof SectionCompletion];

                  return (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap text-xs transition-colors",
                        done
                          ? "bg-indigo-100 dark:bg-indigo-950/50 text-primary dark:text-indigo-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
                      )}
                    >
                      {done ? <Check size={12} /> : <Icon size={12} />}
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-52 shrink-0">
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center justify-between mb-4 px-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Sections
                </p>
                <span className="text-[10px] font-bold text-primary">
                  {completedCount}/{projectSubmissionSteps.length}
                </span>
              </div>

              {/* Progress track */}
              <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-5 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedCount / projectSubmissionSteps.length) * 100}%`,
                  }}
                />
              </div>

              <div className="space-y-1">
                {projectSubmissionSteps.map(({ icon: Icon, label, key }) => {
                  const done = completion[key as keyof SectionCompletion];
                  return (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        done
                          ? "bg-indigo-50 dark:bg-indigo-950/30"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all duration-200",
                          done
                            ? "bg-primary"
                            : "bg-slate-100 dark:bg-slate-800",
                        )}
                      >
                        {done ? (
                          <Check
                            size={11}
                            className="text-white"
                            strokeWidth={3}
                          />
                        ) : (
                          <Icon
                            size={12}
                            className="text-slate-400 dark:text-slate-500"
                          />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium transition-colors duration-200",
                          done
                            ? "text-primary dark:text-indigo-300"
                            : "text-slate-500 dark:text-slate-400",
                        )}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <ProjectForm onCompletionChange={setCompletion} />
          </div>
        </div>
      </div>
    </div>
  );
}
