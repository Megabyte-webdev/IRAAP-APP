"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { BookOpen, Check, Tag, Milestone } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { useState } from "react";
import PublicationSubmissionForm from "../_components/PublicationSubmissionForm";
import NoSupervisor from "@/app/(dashboard)/_components/NoSupervisor";

// Upgraded steps with distinct icons reflecting the newly captured domain data
const publicationSubmissionSteps = [
  {
    key: "details",
    label: "Details",
    icon: BookOpen,
  },
  {
    key: "abstract",
    label: "Abstract",
    icon: BookOpen,
  },
  {
    key: "methodology",
    label: "Methodology",
    icon: BookOpen,
  },
  {
    key: "keywords",
    label: "Keywords",
    icon: Tag,
  },
  {
    key: "researchArea",
    label: "Research Area",
    icon: Milestone,
  },
  {
    key: "upload",
    label: "Upload",
    icon: BookOpen,
  },
];

// Explicit type layout mapping completion tracks explicitly matching form components
interface ExtendedSectionCompletion {
  details: boolean;
  abstract: boolean;
  methodology: boolean;
  keywords: boolean;
  researchArea: boolean;
  upload: boolean;
}

export default function PublicationSubmitPage() {
  const { authDetails } = useAuth();
  const hasSupervisor = authDetails?.user?.supervisorId;

  const [completion, setCompletion] = useState<ExtendedSectionCompletion>({
    details: false,
    abstract: false,
    methodology: false,
    keywords: false,
    researchArea: false,
    upload: false,
  });

  if (!hasSupervisor) return <NoSupervisor />;

  const completedCount = Object.values(completion).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-10 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-primary">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              IRAP Repository
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Submit research publication
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 max-w-lg">
            Complete all sections below to publish your research to the
            repository. Fields marked * are required.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Mobile progress */}
          <div className="lg:hidden sticky top-0 z-20 bg-[#F8FAFC] pb-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">
                  Progress
                </span>
                <span className="text-xs font-bold text-primary">
                  {completedCount}/{publicationSubmissionSteps.length}
                </span>
              </div>

              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${(completedCount / publicationSubmissionSteps.length) * 100}%`,
                  }}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {publicationSubmissionSteps.map(
                  ({ icon: Icon, label, key }) => {
                    const done =
                      completion[key as keyof ExtendedSectionCompletion];

                    return (
                      <div
                        key={key}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap text-xs",
                          done
                            ? "bg-indigo-100 text-primary"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {done ? <Check size={12} /> : <Icon size={12} />}
                        {label}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-52 shrink-0">
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center justify-between mb-4 px-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Sections
                </p>
                <span className="text-[10px] font-bold text-primary">
                  {completedCount}/{publicationSubmissionSteps.length}
                </span>
              </div>

              {/* Progress track */}
              <div className="h-1 w-full bg-slate-100 rounded-full mb-5 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedCount / publicationSubmissionSteps.length) * 100}%`,
                  }}
                />
              </div>

              <div className="space-y-1">
                {publicationSubmissionSteps.map(
                  ({ icon: Icon, label, key }) => {
                    const done =
                      completion[key as keyof ExtendedSectionCompletion];
                    return (
                      <div
                        key={key}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          done ? "bg-indigo-50" : "hover:bg-slate-50",
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all duration-200",
                            done ? "bg-primary" : "bg-slate-100",
                          )}
                        >
                          {done ? (
                            <Check
                              size={11}
                              className="text-white"
                              strokeWidth={3}
                            />
                          ) : (
                            <Icon size={12} className="text-slate-400" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium transition-colors duration-200",
                            done ? "text-primary" : "text-slate-500",
                          )}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* The child subform component handles updating these 6 completion tracks */}
            <PublicationSubmissionForm onCompletionChange={setCompletion} />
          </div>
        </div>
      </div>
    </div>
  );
}
