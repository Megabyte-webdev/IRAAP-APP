"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSearchParams } from "next/navigation";
import { getOrCreateVsdkId } from "../_utils/formatters";
type MeetingStatus = "idle" | "loading" | "ready" | "error";

interface MeetingState {
  meetingId: string;
  meetingName: string;
  hostName: string;
  userName: string;
  token: string | null;
  status: MeetingStatus;
  error: string | null;
  participantId: string;
  isOpen: boolean;
}

interface MeetingContextValue extends MeetingState {
  setMeetingInfo: (partial: Partial<MeetingState>) => void;
  isMicOn: boolean;
  setIsMicOn: (mic: boolean) => void;
  isVideoOn: boolean;
  setIsVideoOn: (mic: boolean) => void;
  refreshParticipantId: () => void;
}

const MeetingContext = createContext<MeetingContextValue | null>(null);

const getStoredParticipantId = (): string => {
  if (typeof window === "undefined") {
    return getOrCreateVsdkId();
  }

  const stored = localStorage.getItem("vsdk_id");
  const storedExpiry = localStorage.getItem("vsdk_idExpiry");

  const now = Date.now();
  const expiryTime = storedExpiry ? parseInt(storedExpiry) : 0;

  // If stored ID exists and hasn't expired, use it
  if (stored && expiryTime > now) {
    return stored;
  }

  // Generate new ID and store with 24-hour expiry
  const newParticipantId = getOrCreateVsdkId();
  const newExpiry = now + 24 * 60 * 60 * 1000; // 24 hours from now

  localStorage.setItem("vsdk_id", newParticipantId);
  localStorage.setItem("vsdk_idExpiry", newExpiry.toString());

  return newParticipantId;
};

// Clean up expired IDs
const cleanupExpiredParticipantIds = (): void => {
  if (typeof window === "undefined") return;

  const storedExpiry = localStorage.getItem("vsdk_idExpiry");
  const now = Date.now();

  if (storedExpiry && parseInt(storedExpiry) <= now) {
    localStorage.removeItem("vsdk_id");
    localStorage.removeItem("vsdk_idExpiry");
  }
};

export const MeetingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();

  const [state, setState] = useState<MeetingState>({
    meetingId: "",
    meetingName: "",
    hostName: "",
    userName: "",
    token: null,
    status: "idle",
    error: null,
    isOpen: false,
    participantId: "",
  });
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  // Initialize participant ID on component mount
  useEffect(() => {
    const participantId = getStoredParticipantId();
    setState((prev) => ({ ...prev, participantId }));

    // Set up periodic cleanup
    const cleanupInterval = setInterval(
      cleanupExpiredParticipantIds,
      60 * 60 * 1000,
    );

    return () => clearInterval(cleanupInterval);
  }, []);

  useEffect(() => {
    const meetingIdFromUrl = searchParams.get("meetingId") ?? "";
    const meetingNameFromUrl =
      searchParams.get("meetingName") ?? "Meeting on Defcomm Meet";
    const hostNameFromUrl = searchParams.get("hostName") ?? "IRAAP";
    const userNameFromUrl = searchParams.get("userName") ?? "Guest";

    setState((prev) => ({
      ...prev,
      meetingId: meetingIdFromUrl,
      meetingName: meetingNameFromUrl,
      hostName: hostNameFromUrl,
      userName: userNameFromUrl,
    }));
  }, [searchParams]);

  // Function to refresh participant ID
  const refreshParticipantId = useCallback(() => {
    const newParticipantId = getOrCreateVsdkId();
    const newExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

    if (typeof window !== "undefined") {
      localStorage.setItem("vsdk_id", newParticipantId);
      localStorage.setItem("vsdk_idExpiry", newExpiry.toString());
    }

    setState((prev) => ({ ...prev, participantId: newParticipantId }));
  }, []);

  const setMeetingInfo = (partial: Partial<MeetingState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  const value: MeetingContextValue = {
    ...state,
    setMeetingInfo,
    isMicOn,
    setIsMicOn,
    isVideoOn,
    setIsVideoOn,
    refreshParticipantId,
  };

  return (
    <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>
  );
};

export const useMeetingContext = () => {
  const ctx = useContext(MeetingContext);
  if (!ctx) {
    throw new Error("useMeetingContext must be used within <MeetingProvider>");
  }
  return ctx;
};
