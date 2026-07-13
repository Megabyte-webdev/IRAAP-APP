"use client";
import { Calendar, Video } from "lucide-react";
import { Meeting } from "@/app/_utils/types";
import useChat from "@/app/_hooks/use-chat";
import MeetingCard from "./_components/MeetingCard";

export default function MeetingsPage() {
  const { getUserSchedules } = useChat();
  const { data: meetings = [], isLoading } = getUserSchedules();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header Row */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Research & Supervision Sessions
          </h1>
          <p className="text-sm text-slate-500">
            Manage, track, and join your upcoming academic review meetings.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule New Session
        </button>
      </div>

      {meetings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Video className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            No sessions scheduled
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            You don't have any upcoming video synchronization windows listed.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* List Layout */}
          <div className="space-y-4 md:col-span-2">
            {meetings.map((meeting: Meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>

          {/* Mini Insights Sidebar Widget */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 h-fit space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Schedule Overview
            </h4>
            <div className="rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
              <div className="text-3xl font-bold text-slate-900">
                {meetings.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Total sync sessions currently pending call verification blocks.
              </p>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed bg-blue-50/50 border border-blue-100 p-3 rounded-lg">
              <strong>Pro-tip:</strong> Room connection links become accessible
              directly through this interface roughly 10 minutes prior to the
              designated slot start time.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
