"use client";

import { useState } from "react";
import { useProject } from "@/app/_hooks/use-projects";
import { ArrowUpRight, Globe, Loader2, X } from "lucide-react";
import Portal from "@/app/_components/Portal";

type Props = {
  projectId: number;
  action: "AUTHORIZE" | "PUBLISH";
};

export default function PublicationButton({ projectId, action }: Props) {
  const { releaseProject, publishProject } = useProject();

  const [showConfirm, setShowConfirm] = useState(false);

  const isAuthorize = action === "AUTHORIZE";

  const mutation = isAuthorize ? releaseProject : publishProject;

  const handleConfirm = () => {
    if (isAuthorize) {
      releaseProject.mutate(projectId, {
        onSuccess: () => setShowConfirm(false),
      });
    } else {
      publishProject.mutate(projectId, {
        onSuccess: () => setShowConfirm(false),
      });
    }
  };

  return (
    <>
      <button
        disabled={mutation.isPending}
        onClick={() => setShowConfirm(true)}
        className="
          flex items-center gap-2
          bg-primary hover:opacity-90
          disabled:opacity-60
          text-white
          px-3 py-1.5
          rounded-lg
          text-xs font-bold
          transition
        "
      >
        {mutation.isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : isAuthorize ? (
          <Globe size={14} />
        ) : (
          <ArrowUpRight size={14} />
        )}

        {isAuthorize ? "Authorize Publication" : "Publish Research"}
      </button>

      {showConfirm && (
        <Portal>
          <div
            className="
          fixed inset-0 z-100
          flex items-center justify-center
          bg-black/40 backdrop-blur-sm
        "
          >
            <div
              className="
            w-[90%] max-w-sm
            bg-white dark:bg-slate-900
            rounded-xl
            shadow-xl
            border border-slate-200 dark:border-slate-800
            p-5
          "
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="
                text-sm font-bold
                text-slate-900 dark:text-white
              "
                >
                  {isAuthorize ? "Authorize Publication?" : "Publish Research?"}
                </h3>

                <button
                  onClick={() => setShowConfirm(false)}
                  className="
                  p-1 rounded-lg
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                "
                >
                  <X size={16} />
                </button>
              </div>

              <p
                className="
              text-xs leading-5
              text-slate-600 dark:text-slate-400
            "
              >
                {isAuthorize
                  ? "This confirms that the project has been fully reviewed and vetted. The student will be notified that the research is ready for publication."
                  : "This will publish the research and make the final approved project available publicly."}
              </p>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="
                  px-3 py-1.5
                  rounded-lg
                  text-xs font-semibold
                  text-slate-600
                  dark:text-slate-300
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                "
                >
                  Cancel
                </button>

                <button
                  disabled={mutation.isPending}
                  onClick={handleConfirm}
                  className="
                  flex items-center gap-2
                  px-3 py-1.5
                  rounded-lg
                  bg-primary
                  text-white
                  text-xs font-bold
                  disabled:opacity-60
                "
                >
                  {mutation.isPending && (
                    <Loader2 size={13} className="animate-spin" />
                  )}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
