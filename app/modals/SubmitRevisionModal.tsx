"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import Portal from "../_components/Portal";

interface SubmitRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, changeNote: string) => void;
  reviewSummary: string; // Aligned with the call-site prop name
  isLoading: boolean;
}

export default function SubmitRevisionModal({
  isOpen,
  onClose,
  onSubmit,
  reviewSummary,
  isLoading,
}: SubmitRevisionModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [changeNote, setChangeNote] = useState("");

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
        <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/50 overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
              Submit Revision for Review
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mt-0.5">
              {reviewSummary}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Revised File
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 dark:file:bg-indigo-900/40 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100/80 dark:hover:file:bg-indigo-900/60 file:transition-colors cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Change Note{" "}
              <span className="text-slate-400 dark:text-slate-500 font-medium">
                (optional)
              </span>
            </label>
            <textarea
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              rows={3}
              placeholder="Describe what you updated or addressed in this version..."
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400/50 dark:focus:ring-indigo-500/40 transition-all"
            />
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={!file || isLoading}
              onClick={() => file && onSubmit(file, changeNote)}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 dark:bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 dark:hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Submit Revision
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
