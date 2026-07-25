"use client";

import React, { useState } from "react";
import { Mic, MicOff, MoreVertical } from "lucide-react";
import { useRemoteMedia, useLocalParticipant } from "@afosecure/meetingsdk";
import ReactPlayer from "react-player";

interface Props {
  participantId: string;
  displayName: string;
  isYou?: boolean;
  size?: "small" | "large";
  isActiveSpeaker?: boolean;
  isPinned?: boolean;
  disablePin?: boolean;
}

export default function ParticipantTile({
  participantId,
  displayName,
  isYou,
  size = "large",
  isActiveSpeaker,
  isPinned,
  disablePin,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const remoteMedia = useRemoteMedia(participantId);
  const { participant, videoRef: localVideoRef } = useLocalParticipant();

  const localMedia = {
    videoRef: localVideoRef,
    audioRef: null,
    isCamActive: participant?.media?.camEnabled ?? false,
    isMicEnabled: participant?.media?.micEnabled ?? false,
  };

  const { videoRef, audioRef, isCamActive, isMicEnabled } = isYou
    ? localMedia
    : remoteMedia;

  const isSmall = size === "small";

  return (
    <div
      className={`relative w-full ${
        isSmall ? "h-full" : "aspect-4/3 max-h-[70vh]"
      } rounded-2xl overflow-hidden bg-zinc-800 shadow-xl border transition-all duration-200 group ${
        isActiveSpeaker
          ? "border-emerald-500 ring-2 ring-emerald-500/50"
          : "border-white/10"
      }`}
    >
      <audio ref={audioRef} autoPlay playsInline />

      {/* Video Stream */}
      <div className={`w-full h-full ${isCamActive ? "block" : "hidden"}`}>
        <ReactPlayer
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width="100%"
          height="100%"
          className="w-full h-full object-cover -scale-x-100"
          style={{ position: "absolute", inset: 0 }}
        />
      </div>

      {/* Fallback Avatar Placeholder */}
      {!isCamActive && (
        <div className="w-full h-full flex items-center justify-center bg-zinc-800">
          <div
            className={`rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold border-2 border-white/10 ${
              isSmall ? "w-10 h-10 text-sm" : "w-20 h-20 text-xl"
            }`}
          >
            {displayName.slice(0, 2).toUpperCase()}
          </div>
        </div>
      )}

      {/* Floating Name Badge */}
      <div
        className={`absolute z-20 ${
          isSmall ? "bottom-2 left-2" : "bottom-4 left-4"
        }`}
      >
        <div
          className={`bg-black/50 backdrop-blur-md rounded-full flex items-center gap-1.5 border border-white/10 ${
            isSmall ? "px-2 py-0.5" : "px-3 py-1.5"
          }`}
        >
          <span
            className={`font-medium text-white truncate max-w-25 ${
              isSmall ? "text-[10px]" : "text-xs"
            }`}
          >
            {displayName} {isYou && "(You)"}
          </span>
          {isMicEnabled ? (
            <Mic
              className={`text-emerald-400 ${
                isSmall ? "w-2.5 h-2.5" : "w-3.5 h-3.5"
              }`}
            />
          ) : (
            <MicOff
              className={`text-white/70 ${
                isSmall ? "w-2.5 h-2.5" : "w-3.5 h-3.5"
              }`}
            />
          )}
        </div>
      </div>

      {/* Top Menu Control */}
      {!disablePin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className={`absolute z-20 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity ${
            isSmall ? "top-2 right-2 p-1" : "top-4 right-4 p-2"
          }`}
        >
          <MoreVertical className={isSmall ? "w-3 h-3" : "w-4 h-4"} />
        </button>
      )}

      {menuOpen && (
        <div
          className={`absolute z-30 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl p-1 text-xs ${
            isSmall ? "top-8 right-2" : "top-12 right-4"
          }`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-gray-200 rounded-lg whitespace-nowrap"
          >
            {isPinned ? "Unpin Video" : "Pin Video"}
          </button>
        </div>
      )}
    </div>
  );
}
