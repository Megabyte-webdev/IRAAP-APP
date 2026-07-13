"use client";

import {
  Calendar,
  Video,
  Loader2,
  ArrowRight,
  LayoutGrid,
  CheckCircle2,
} from "lucide-react";
import { Meeting } from "@/app/_utils/types";
import useChat from "@/app/_hooks/use-chat";
import MeetingCard from "./MeetingCard";

export default function MeetingComponent() {
  const { getUserSchedules } = useChat();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    getUserSchedules();

  const meetings = data?.pages.flatMap((page) => page.data) ?? [];

  // 1. Premium Loading Skeletons matching IRAAP visual layout
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 animate-pulse">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded bg-slate-200" />
            <div className="h-4 w-96 rounded bg-slate-200" />
          </div>
          <div className="h-10 w-40 rounded-lg bg-slate-200" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/60 bg-white p-5 space-y-4"
              >
                <div className="flex justify-between">
                  <div className="space-y-2 w-2/3">
                    <div className="h-4 w-1/4 rounded bg-slate-200" />
                    <div className="h-5 w-3/4 rounded bg-slate-200" />
                    <div className="h-4 w-5/6 rounded bg-slate-200" />
                  </div>
                  <div className="h-9 w-20 rounded bg-slate-200" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex gap-4">
                  <div className="h-3 w-24 rounded bg-slate-100" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-48 rounded-xl bg-slate-100 border border-slate-200/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header Row */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Research & Supervision Sessions
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Monitor schedules, launch virtual meeting portals, and coordinate
            live project reviews.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:bg-blue-800">
          <Calendar className="mr-2 h-4.5 w-4.5" />
          Schedule New Session
        </button>
      </div>

      {meetings.length === 0 ? (
        // 2. Elegant Empty State matching IRAAP Repository design pattern
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40 py-16 px-4 text-center">
          <div className="rounded-full bg-slate-100 p-3 ring-8 ring-slate-50">
            <Video className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            No scheduled sessions found
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-xs">
            There are no research alignments or sync panels pending on your
            academic calendar.
          </p>
          <button className="mt-5 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            Schedule a Meeting
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Meeting Cards Feed */}
          <div className="space-y-4 md:col-span-2">
            {meetings.map((meeting: Meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}

            {/* 3. High-Quality "Load More" Button */}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-800 disabled:bg-slate-50/50 disabled:text-slate-400"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    <span>Querying archive databases...</span>
                  </>
                ) : (
                  <>
                    <span>Load older meetings</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* 4. Styled Sidebar Panel */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100">
                <LayoutGrid className="h-3.5 w-3.5 text-slate-400" />
                <span>Supervision Ledger</span>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-slate-900">
                  {meetings.length}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  total logged
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Represents your currently loaded, archived, or scheduled sync
                checkpoints within this research block.
              </p>
            </div>

            {/* Platform notice badge */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <div className="flex gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-blue-900">
                    IRAAP Sync Rules
                  </h5>
                  <p className="text-[11px] leading-relaxed text-blue-700/90">
                    All completed meetings will log attendance and duration
                    thresholds automatically directly onto your respective
                    project defense trackers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
