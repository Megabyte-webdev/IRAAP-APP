"use client";
import { useMeetingContext } from "@/app/_context/MeetingProvider";
import { onPrompt } from "@/app/_utils/Notification";
import { useEffect } from "react";
import MeetingRoomContent from "./MeetingRoomContent";

export default function MeetingRoom() {
  const { meetingId } = useMeetingContext();

  useEffect(() => {
    if (!meetingId) return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);

      setTimeout(() => {
        onPrompt({
          message: "You can't go back while in a meeting.",
          title: "Action Blocked",
        });
      }, 0);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [meetingId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!meetingId) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [meetingId]);

  return (
    <div className="h-screen w-full bg-[#525252] text-white overflow-hidden relative font-sans">
      <MeetingRoomContent meetingId={meetingId} />
    </div>
  );
}
