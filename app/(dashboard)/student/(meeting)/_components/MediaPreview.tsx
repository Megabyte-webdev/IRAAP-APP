import { RefObject } from "react";
import { VideoOff, MicOff, Mic, Video, AudioLines } from "lucide-react";

interface MediaPreviewProps {
  stream: MediaStream | null;
  isVideoOn: boolean;
  isMicOn: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  toggleMic: () => void;
  toggleVideo: () => void;
}

export default function MediaPreview({
  stream,
  isVideoOn,
  isMicOn,
  videoRef,
  toggleMic,
  toggleVideo,
}: MediaPreviewProps) {
  return (
    <div className="relative w-full aspect-video min-h-55 md:min-h-0 bg-[#4A4D4E] rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center shadow-md">
      {isVideoOn && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover -scale-x-100"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-300 gap-2 p-4">
          <VideoOff className="w-8 h-8 md:w-10 md:h-10 stroke-[1.5]" />
          <span className="text-xs md:text-sm font-medium text-gray-300">
            Camera is off
          </span>
        </div>
      )}

      {/* Video Overlay Layer */}
      <div className="absolute inset-x-3 md:inset-x-4 bottom-3 md:bottom-4 flex items-center justify-between">
        {/* Audio Status Pill (Pinned Left) */}
        <div className="bg-black/60 backdrop-blur-md px-2.5 py-1.5 md:px-3 md:py-2 rounded-full flex items-center gap-1.5 border border-white/10 shrink-0">
          <AudioLines
            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
              isMicOn ? "text-emerald-400 animate-pulse" : "text-zinc-400"
            }`}
          />
          <span className="text-[10px] md:text-xs text-white font-medium whitespace-nowrap">
            {isMicOn ? "Mic active" : "Mic muted"}
          </span>
        </div>

        {/* Action Toggle Buttons (Absolutely Centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={toggleMic}
            aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}
            className={`p-2.5 md:p-3 rounded-full transition-colors backdrop-blur-md border border-white/10 ${
              isMicOn
                ? "bg-black/60 hover:bg-black/80 text-white"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {isMicOn ? (
              <Mic className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <MicOff className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleVideo}
            aria-label={isVideoOn ? "Turn off camera" : "Turn on camera"}
            className={`p-2.5 md:p-3 rounded-full transition-colors backdrop-blur-md border border-white/10 ${
              isVideoOn
                ? "bg-black/60 hover:bg-black/80 text-white"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {isVideoOn ? (
              <Video className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <VideoOff className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
