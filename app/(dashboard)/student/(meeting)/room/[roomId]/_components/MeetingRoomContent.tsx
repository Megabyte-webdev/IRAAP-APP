"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMeeting } from "@afosecure/meetingsdk";
import { extractErrorMessage, getInitials } from "@/app/_utils/formatters";
import { onFailure } from "@/app/_utils/Notification";
import ControlPanel from "./ControlPanel";
import RightPanel from "./RightPanel";
import ScreenShare from "./ScreenShare";
import ParticipantTile from "./PartcipantTile";
import { useAuth } from "@/app/_context/AuthContext";

interface Props {
  meetingId: string;
}

interface JoinRequest {
  userId: string;
  name: string;
  requestId: string;
  timestamp?: number;
}

export default function MeetingRoomContent({ meetingId }: Props) {
  const { authDetails } = useAuth();
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(
    null,
  );
  const [hasJoined, setHasJoined] = useState(false);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  const router = useRouter();
  const hasJoinedRef = useRef(false);

  const {
    participants,
    localParticipant,
    room,
    presenterId,
    join,
    approveJoinRequest,
    rejectJoinRequest,
    leave,
  } = useMeeting({
    onEntryRequested: (data) => {
      if (data?.userId) {
        setJoinRequests((prev) => [
          ...prev,
          { ...data, timestamp: Date.now() },
        ]);
      }
    },
    onMeetingLeft: () => {
      router.push("/");
    },
    onError: (error) => {
      onFailure({
        message: extractErrorMessage(error),
        title: "Technical Error",
      });
    },
  });

  const handleApprove = (requestId: string) => {
    try {
      approveJoinRequest(requestId);
      setJoinRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId),
      );
    } catch (err) {
      onFailure({ message: "Failed to approve request", title: "Error" });
    }
  };

  const handleReject = (requestId: string) => {
    try {
      rejectJoinRequest(requestId);
      setJoinRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId),
      );
    } catch (err) {
      onFailure({ message: "Failed to reject request", title: "Error" });
    }
  };

  useEffect(() => {
    if (!meetingId || hasJoinedRef.current) return;

    let cancelled = false;

    const attemptJoin = async () => {
      try {
        hasJoinedRef.current = true;
        await new Promise((resolve) => setTimeout(resolve, 300));
        await join();
        setHasJoined(true);
      } catch (err: any) {
        hasJoinedRef.current = false;
        onFailure({
          message: extractErrorMessage(err) || "Failed to join meeting",
          title: "Connection Error",
        });

        setTimeout(() => {
          router.replace("/");
        }, 3000);
      }
    };

    const t = setTimeout(attemptJoin, 300);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [meetingId, join, router]);

  useEffect(() => {
    if (hasJoined && !meetingId) {
      router.replace("/");
    }
  }, [meetingId, hasJoined, router]);

  const participantList = useMemo(
    () => [
      ...(localParticipant ? [{ ...localParticipant, isLocal: true }] : []),
      ...Array.from(participants.values()),
    ],
    [participants, localParticipant],
  );

  const orderedParticipants = useMemo(() => {
    const rank = (id: string) => {
      if (id === presenterId) return 0;
      if (id === activeSpeakerId) return 1;
      return 2;
    };

    return [...participantList].sort((a, b) => rank(a.id) - rank(b.id));
  }, [participantList, presenterId, activeSpeakerId]);

  const presenter = participantList.find((p) => p.id === presenterId);
  const hasScreenShare = !!presenter?.media?.isScreenSharing;

  const mainStageParticipant =
    pinnedParticipantId &&
    orderedParticipants.find((p) => p.id === pinnedParticipantId);

  const toggleSidebar = () => setShowSidebar((v) => !v);

  // 1. Loading/Connecting State
  if (!hasJoined || !meetingId) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#EBF5FB] text-gray-800 p-4">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex items-center justify-center bg-gray-200">
            <span className="text-2xl font-bold text-gray-600">
              {getInitials(authDetails?.user?.fullName)}
            </span>
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-[#3DA9EC] animate-ping opacity-25"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Connecting to session...
        </h2>
        <p className="text-sm text-gray-500">
          Establishing a secure connection to the room.
        </p>
      </div>
    );
  }

  // 2. Waiting Room State
  if (participants.size === 0 && !localParticipant) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-between bg-[#EBF5FB] text-gray-800 p-8">
        <div />
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 bg-gray-300">
            <img
              src="/api/placeholder/100/100"
              alt="Supervisor"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Waiting for your supervisor...
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Your host has been notified and will admit you to the consultation
            shortly.
          </p>
        </div>

        <button
          onClick={() => leave?.()}
          className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition shadow-sm"
        >
          Leave Call
        </button>
      </div>
    );
  }

  // 3. Active Call Layout
  return (
    <div className="h-screen w-full flex flex-col bg-[#575758] text-white overflow-hidden relative">
      {/* Floating Header Pill */}
      <div className="absolute top-6 left-6 z-30">
        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-3 shadow-md">
          <span className="text-xs font-semibold text-white tracking-wide">
            {room?.name || "Chapter 3 Architecture Review"}
          </span>
          <span className="text-white/40 text-xs">|</span>
          <span className="text-xs font-medium text-white/90">04:14</span>
        </div>
      </div>

      {/* Main Body Layout (Video Stage + Right Panel) */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* Main Video Section */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-hidden">
          <div className="w-full h-full max-w-6xl flex items-center justify-center">
            {hasScreenShare && presenterId ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Full Screen Share */}
                <ScreenShare
                  participant={presenter}
                  isUser={presenterId === localParticipant?.id}
                />

                {/* Floating Participant Overlay Tiles (Bottom-Right) */}
                <div className="absolute bottom-6 right-6 z-20 flex gap-2 pointer-events-auto">
                  {orderedParticipants.map((p) => (
                    <div
                      key={p.id}
                      className="w-36 h-24 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl bg-black/60 backdrop-blur-md"
                    >
                      <ParticipantTile
                        participantId={p.id}
                        displayName={p.name || "Participant"}
                        isYou={p.id === localParticipant?.id}
                        isActiveSpeaker={p.id === activeSpeakerId}
                        isPinned={p.id === pinnedParticipantId}
                        disablePin={true}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center max-h-[80vh]">
                {orderedParticipants.slice(0, 2).map((p) => (
                  <ParticipantTile
                    key={p.id}
                    participantId={p.id}
                    displayName={p.name || "Participant"}
                    isYou={p.id === localParticipant?.id}
                    isActiveSpeaker={p.id === activeSpeakerId}
                    isPinned={p.id === pinnedParticipantId}
                    disablePin={hasScreenShare}
                    size="large"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Drawer Panel */}
        <RightPanel
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          toggleSidebar={toggleSidebar}
          showSidebar={showSidebar}
          onUnreadChange={setUnreadCount}
          isChatOpen={activeTab === "chat"}
          joinRequests={joinRequests}
          onApproveRequest={handleApprove}
          onRejectRequest={handleReject}
        />
      </div>

      {/* Floating Center Controls Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <ControlPanel
          toggleSidebar={toggleSidebar}
          setActiveTab={setActiveTab}
          unreadCount={unreadCount}
          onLeave={() => leave?.()}
        />
      </div>
    </div>
  );
}
