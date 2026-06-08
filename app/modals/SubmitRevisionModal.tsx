"use client";

import { useState } from "react";
import { useProject } from "@/app/_hooks/use-projects";
import Portal from "../_components/Portal";

export default function SubmitRevisionModal({
  reviewId,
  projectId,
  onClose,
}: any) {
  const { submitRevisionForReview } = useProject();

  const [file, setFile] = useState<File | null>(null);
  const [changeNote, setChangeNote] = useState("");

  const handleSubmit = () => {
    if (!file) return;

    submitRevisionForReview.mutate(
      {
        reviewId,
        file,
        changeNote,
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-4 rounded w-100 space-y-3">
          <h2 className="text-sm font-bold">Submit Revision</h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <textarea
            placeholder="Change note"
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            className="w-full border p-2 text-xs"
          />

          <div className="flex justify-end gap-2">
            <button onClick={onClose}>Cancel</button>
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-3 py-1 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
