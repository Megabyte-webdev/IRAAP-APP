"use client";

import React, {
  useEffect,
  useRef,
  useState,
  MouseEvent,
  TouchEvent,
  KeyboardEvent,
} from "react";
import { Expand, Minimize, ZoomIn, ZoomOut } from "lucide-react";
import { Participant } from "@afosecure/meetingsdk";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

interface Props {
  participant: Participant;
  isUser?: boolean;
}

const ScreenShare: React.FC<Props> = ({ participant, isUser }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  //const audioRef = useRef<HTMLAudioElement>(null);

  // Sync fullscreen state
  useEffect(() => {
    const handleChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);
  const screenTrack = participant.media?.screenTrack;
  const screenStream = participant.media?.screenStream;
  const displayName = participant.name;

  console.log(participant);

  // Attach video stream to <video>
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (screenTrack) {
      const stream = new MediaStream([screenTrack]);

      const audioTrack = screenStream?.getAudioTracks()?.at(0);

      if (audioTrack) {
        stream.addTrack(audioTrack);
      }

      video.srcObject = stream;
      video.play().catch(console.error);
    } else {
      video.srcObject = null;
    }
  }, [screenTrack, screenStream]);

  // Build MediaStream for screen audio
  // const screenAudio = useMemo(() => {
  //   if (screenShareOn && screenShareAudioStream) {
  //     const stream = new MediaStream();
  //     stream.addTrack(screenShareAudioStream.track);
  //     return stream;
  //   }
  //   return null;
  // }, [screenShareOn, screenShareAudioStream]);

  // Attach audio stream
  // useEffect(() => {
  //   const audio = audioRef.current;
  //   if (!audio) return;

  //   if (screenAudio) {
  //     audio.srcObject = screenAudio;
  //     audio
  //       .play()
  //       .catch((err) => console.error("Screen audio play error:", err));
  //   } else {
  //     audio.pause();
  //     audio.srcObject = null;
  //   }
  // }, [screenAudio]);

  // Clamp position (for pan)
  const clampPosition = (pos: { x: number; y: number }) => {
    if (!containerRef.current || zoom <= 1) return { x: 0, y: 0 };
    const bounds = containerRef.current.getBoundingClientRect();
    const limitX = ((zoom - 1) * bounds.width) / 2;
    const limitY = ((zoom - 1) * bounds.height) / 2;
    return {
      x: clamp(pos.x, -limitX, limitX),
      y: clamp(pos.y, -limitY, limitY),
    };
  };

  // Mouse drag
  const handleMouseDown = (e: MouseEvent) => {
    if (zoom === 1) return;
    setDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || zoom === 1 || !dragStartRef.current) return;
    const newPos = {
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    };
    setPosition(clampPosition(newPos));
  };
  const handleMouseUp = () => setDragging(false);

  // Touch pan
  const handleTouchStart = (e: TouchEvent) => {
    if (zoom === 1 || e.touches.length !== 1) return;
    const t = e.touches[0];
    dragStartRef.current = {
      x: t.clientX - position.x,
      y: t.clientY - position.y,
    };
    setDragging(true);
  };
  const handleTouchMove = (e: TouchEvent) => {
    if (
      !dragging ||
      zoom === 1 ||
      !dragStartRef.current ||
      e.touches.length !== 1
    )
      return;
    const t = e.touches[0];
    const newPos = {
      x: t.clientX - dragStartRef.current.x,
      y: t.clientY - dragStartRef.current.y,
    };
    setPosition(clampPosition(newPos));
  };
  const handleTouchEnd = () => setDragging(false);

  // Zoom helpers
  const setZoomSafe = (updater: (z: number) => number) => {
    setZoom((prev) => {
      const next = Number(clamp(updater(prev), 1, 3).toFixed(2));
      setPosition(next === 1 ? { x: 0, y: 0 } : clampPosition(position));
      return next;
    });
  };
  const handleZoom = (delta: number) => setZoomSafe((z) => z + delta);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const direction = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(direction);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      handleZoom(0.1);
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      handleZoom(-0.1);
    } else if (e.key.toLowerCase() === "f") {
      e.preventDefault();
      handleFullscreenToggle();
    } else if (e.key === "0") {
      e.preventDefault();
      setZoomSafe(() => 1);
    } else if (zoom > 1) {
      const step = 30;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const delta = {
          ArrowUp: { x: 0, y: step },
          ArrowDown: { x: 0, y: -step },
          ArrowLeft: { x: step, y: 0 },
          ArrowRight: { x: -step, y: 0 },
        }[e.key] as { x: number; y: number };
        setPosition((p) =>
          clampPosition({ x: p.x + delta.x, y: p.y + delta.y }),
        );
      }
    }
  };

  const handleFullscreenToggle = () => {
    const node = containerRef.current;
    if (!node) return;
    if (!isFullscreen) node.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const handleDoubleClick = () => handleFullscreenToggle();

  // If no track at all, render nothing
  if (!screenStream)
    return (
      <>
        <div
          className="absolute top-0 left-0 right-0 z-20 px-3 sm:px-4 py-2 flex items-center justify-between
                    bg-linear-to-b from-[#1C1A1A]/80 to-transparent backdrop-blur-sm"
        >
          <span className="text-white text-xs sm:text-sm font-medium truncate">
            {isUser
              ? "You are presenting"
              : `${displayName || "Presenter"} is presenting`}
          </span>
          <button
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            onClick={handleFullscreenToggle}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors
                     bg-[#2A2C30]/60 hover:bg-[#2A2C30] rounded-md p-1.5 sm:p-2"
          >
            {isFullscreen ? <Minimize size={18} /> : <Expand size={18} />}
          </button>
        </div>
      </>
    );

  return (
    <div
      ref={containerRef}
      className="group relative w-full h-full bg-black rounded-lg overflow-hidden border border-[#3A3C40] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2C30]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Screen share"
      style={{ cursor: dragging ? "grabbing" : zoom > 1 ? "grab" : "default" }}
    >
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-20 px-3 sm:px-4 py-2 flex items-center justify-between
                    bg-linear-to-b from-[#1C1A1A]/80 to-transparent backdrop-blur-sm"
      >
        <span className="text-white text-xs sm:text-sm font-medium truncate">
          {isUser
            ? "You are presenting"
            : `${displayName || "Presenter"} is presenting`}
        </span>
        <button
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          onClick={handleFullscreenToggle}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors
                     bg-[#2A2C30]/60 hover:bg-[#2A2C30] rounded-md p-1.5 sm:p-2"
        >
          {isFullscreen ? <Minimize size={18} /> : <Expand size={18} />}
        </button>
      </div>

      {/* Video layer (zoom + pan) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
            position.y / zoom
          }px)`,
          transformOrigin: "center center",
          transition: dragging ? "none" : "transform 0.18s ease-out",
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain pointer-events-none"
          autoPlay
          playsInline
          muted={true} // screen audio is handled separately
        />
      </div>

      {/* Screen share audio (if provided) */}
      {/* {screenAudio && <audio ref={audioRef} autoPlay playsInline />} */}

      {/* Bottom controls */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100
                   group-focus-within:opacity-100 transition-opacity duration-200"
      >
        <div className="flex items-center gap-2 bg-[#1C1A1A]/80 backdrop-blur-sm border border-[#3A3C40] px-3 py-1.5 rounded-full">
          <button
            onClick={() => handleZoom(0.1)}
            title="Zoom in (+)"
            aria-label="Zoom in"
            className="text-white/80 hover:text-white transition-colors p-2 rounded-md hover:bg-[#2A2C30]"
          >
            <ZoomIn size={18} />
          </button>
          <div className="text-[11px] sm:text-xs text-gray-300 tabular-nums min-w-[3ch] text-center">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => handleZoom(-0.1)}
            title="Zoom out (-)"
            aria-label="Zoom out"
            className="text-white/80 hover:text-white transition-colors p-2 rounded-md hover:bg-[#2A2C30]"
          >
            <ZoomOut size={18} />
          </button>

          <div className="mx-1 h-4 w-px bg-[#3A3C40]" />

          <button
            onClick={() => setZoomSafe(() => 1)}
            title="Reset (0)"
            aria-label="Reset zoom"
            className="text-[11px] sm:text-xs text-gray-300 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-[#2A2C30]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenShare;
