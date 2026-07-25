import { Suspense } from "react";
import MeetingLayoutClient from "./MeetingLayoutClient";

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0F1110] px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#273018] bg-[#151814] shadow-xl p-6 space-y-4 animate-pulse">
            {/* Header skeleton */}
            <div className="h-4 w-32 bg-[#273018] rounded-full" />
            <div className="h-6 w-2/3 bg-[#273018] rounded-full" />

            {/* Avatar + text */}
            <div className="flex items-center gap-3 mt-3">
              <div className="w-12 h-12 rounded-full bg-[#273018]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/2 bg-[#273018] rounded-full" />
                <div className="h-3 w-2/3 bg-[#273018] rounded-full" />
              </div>
            </div>

            {/* Video frame skeleton */}
            <div className="mt-4 h-40 w-full rounded-xl bg-linear-to-br from-[#273018] to-[#1b2311]" />

            {/* Buttons skeleton */}
            <div className="mt-4 flex gap-3">
              <div className="h-10 flex-1 rounded-xl bg-[#273018]" />
              <div className="h-10 flex-1 rounded-xl bg-[#273018]" />
            </div>

            {/* Subtext */}
            <p className="text-xs text-[#b3c29b]/70 text-center mt-2">
              Preparing your meeting environment…
            </p>
          </div>
        </div>
      }
    >
      <MeetingLayoutClient>{children}</MeetingLayoutClient>
    </Suspense>
  );
}
