import { RefObject } from "react";
import { VideoOff, MicOff, Mic, Video } from "lucide-react";

interface MediaPreviewProps {
  stream: MediaStream | null;
  isVideoOn: boolean;
  isMicOn: boolean;
  isWaitingForHost: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  onToggleMic: () => void;
  onToggleVideo: () => void;
}

export default function MediaPreview({
  stream,
  isVideoOn,
  isMicOn,
  isWaitingForHost,
  videoRef,
  onToggleMic,
  onToggleVideo,
}: MediaPreviewProps) {
  return (
    <div className="bg-[#36460A] rounded-2xl flex flex-col items-center justify-center">
      {isVideoOn && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-md h-48 sm:h-56 rounded-t-xl object-cover"
        />
      ) : (
        <div className="w-full max-w-md h-48 sm:h-56 rounded-xl flex items-center justify-center">
          <VideoOff className="w-16 h-16 text-[#E5F5CC]" />
        </div>
      )}

      {/* Controls (mic + camera) */}
      <div className="flex gap-4 my-3">
        <button
          onClick={onToggleMic}
          disabled={!stream || isWaitingForHost}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isMicOn ? "opacity-100" : "opacity-70"
          } ${isWaitingForHost ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ backgroundColor: "#1C1A1A" }}
        >
          {isMicOn ? (
            <Mic className="w-5 h-5 text-white" />
          ) : (
            <MicOff className="w-5 h-5 text-white" />
          )}
        </button>

        <button
          onClick={onToggleVideo}
          disabled={!stream || isWaitingForHost}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isVideoOn ? "opacity-100" : "opacity-70"
          } ${isWaitingForHost ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ backgroundColor: "#FF0404" }}
        >
          {isVideoOn ? (
            <Video className="w-5 h-5 text-white" />
          ) : (
            <VideoOff className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
