"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSchedule: (data: { scheduledAt: string; duration: number }) => void;
}

export default function ScheduleMeetingModal({
  open,
  onClose,
  onSchedule,
}: Props) {
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(60);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-5 w-[320px]">
        <h2 className="font-semibold text-lg">Schedule Meeting</h2>

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded-lg w-full mt-4"
        />

        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="border p-2 rounded-lg w-full mt-3"
        >
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={120}>2 hours</option>
        </select>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose}>Cancel</button>

          <button
            disabled={!date}
            onClick={() =>
              onSchedule({
                scheduledAt: date,
                duration,
              })
            }
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
