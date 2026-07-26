import { Suspense } from "react";
import MeetingLayoutClient from "./MeetingLayoutClient";

function MeetingSkeleton() {
  return (
    <div className="h-screen w-full flex flex-col bg-[#525252] text-white overflow-hidden relative animate-pulse">
      {/* Floating Header Pill Skeleton */}
      <div className="absolute top-6 left-6 z-30">
        <div className="bg-white/10 border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 w-64 h-9">
          <div className="h-3.5 bg-white/20 rounded-full w-32" />
          <div className="h-3.5 bg-white/10 rounded-full w-2" />
          <div className="h-3.5 bg-white/20 rounded-full w-12" />
        </div>
      </div>

      {/* Main Video Stage Skeleton (2 Large Participant Tiles) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-hidden">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center max-h-[80vh]">
          {/* Tile 1 */}
          <div className="w-full aspect-4/3 rounded-2xl bg-zinc-800/80 border border-white/10 relative overflow-hidden flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-zinc-700/80" />
            {/* Name Badge Skeleton */}
            <div className="absolute bottom-4 left-4 h-7 w-28 rounded-full bg-black/30 border border-white/5" />
          </div>

          {/* Tile 2 */}
          <div className="w-full aspect-4/3 rounded-2xl bg-zinc-800/80 border border-white/10 relative overflow-hidden flex items-center justify-center md:flex">
            <div className="w-20 h-20 rounded-full bg-zinc-700/80" />
            {/* Name Badge Skeleton */}
            <div className="absolute bottom-4 left-4 h-7 w-28 rounded-full bg-black/30 border border-white/5" />
          </div>
        </div>
      </div>

      {/* Floating Center Controls Bar Skeleton */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div className="w-10 h-10 rounded-full bg-red-500/40" />
        </div>
      </div>
    </div>
  );
}

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<MeetingSkeleton />}>
      <MeetingLayoutClient>{children}</MeetingLayoutClient>
    </Suspense>
  );
}
