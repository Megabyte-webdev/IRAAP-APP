"use client";

import { MeetingProvider } from "@/app/_context/MeetingProvider";
import { VideoSdkProvider } from "@/app/_context/VideoSdkProvider";

export default function MeetingLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MeetingProvider>
      {/* VideoSdkProvider handles its own readiness internally */}
      <VideoSdkProvider>{children}</VideoSdkProvider>
    </MeetingProvider>
  );
}
