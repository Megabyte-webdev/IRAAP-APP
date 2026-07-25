"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { MeetingProvider as VideoSdkMeetingProvider } from "@afosecure/meetingsdk";
import { useMeetingContext } from "./MeetingProvider";

type MeetingLayoutVariant = "grid" | "speaker";

interface VideoSdkContextValue {
  layout: MeetingLayoutVariant;
  setLayout: (layout: MeetingLayoutVariant) => void;
  meetingId: string;
  participantName: string;
  participantId: string;
}

const VideoSdkContext = createContext<VideoSdkContextValue | null>(null);

export const useVideoSdk = (): VideoSdkContextValue => {
  const ctx = useContext(VideoSdkContext);
  if (!ctx) {
    throw new Error("useVideoSdk must be used within <VideoSdkProvider>.");
  }
  return ctx;
};

interface VideoSdkProviderProps {
  children: ReactNode;
}

export function VideoSdkProvider({ children }: VideoSdkProviderProps) {
  const [layout, setLayout] = useState<MeetingLayoutVariant>("speaker");

  const {
    meetingId,
    token,
    isMicOn,
    isVideoOn,
    participantId,
    userName,
    status,
  } = useMeetingContext();

  const contextValue = useMemo(
    () => ({
      layout,
      setLayout,
      meetingId,
      participantName: userName,
      participantId,
    }),
    [layout, meetingId, participantId, userName],
  );

  return (
    <VideoSdkMeetingProvider
      config={{
        roomId: meetingId,
        audioMuted: !isMicOn,
        videoMuted: !isVideoOn,
        name: userName,
      }}
    >
      <VideoSdkContext.Provider value={contextValue}>
        {children}
      </VideoSdkContext.Provider>
    </VideoSdkMeetingProvider>
  );
}
