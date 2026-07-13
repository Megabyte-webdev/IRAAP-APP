"use client";
import { Calendar, Video } from "lucide-react";
import { Meeting } from "@/app/_utils/types";
import useChat from "@/app/_hooks/use-chat";
import MeetingCard from "./_components/MeetingCard";

export default function MeetingsPage() {
  const { getUserSchedules } = useChat();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    getUserSchedules();
  console.log("Infinite data:", data);

  const meetings = data?.pages.flatMap((page) => page.data) ?? [];

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
        <div>No sessions scheduled</div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4 md:col-span-2">
              {meetings.map((meeting: Meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}

              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full rounded-lg border px-4 py-2"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more meetings"}
                </button>
              )}
            </div>

            <div className="rounded-xl border p-5 h-fit">
              <h4>Schedule Overview</h4>

              <div className="text-3xl font-bold">{meetings.length}</div>

              <p>Total sessions loaded</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
