"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import Portal from "../_components/Portal";
function SubmitRevisionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, changeNote: string) => void;
  isLoading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [changeNote, setChangeNote] = useState("");

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            Submit Revision for Review
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600">
              Revised File
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600">
              Change Note (optional)
            </label>
            <textarea
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              rows={3}
              placeholder="Describe what you changed..."
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              disabled={!file || isLoading}
              onClick={() => file && onSubmit(file, changeNote)}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Upload size={12} />
              )}
              Submit Revision
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default SubmitRevisionModal;
