"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, AlertCircle } from "lucide-react";
import { LuClock } from "react-icons/lu";

import { getMessageLayout, renderCheck } from "@/app/_utils/formatters";
import { getFileIcon, getRadius } from "@/app/_utils/utility";
import SafeImage from "@/app/_components/SafeImage";
import SwipeableMessage from "./SwipeableMessage";
import ReplyPreview from "./ReplyPreview";
import { useAuth } from "@/app/_context/AuthContext";

interface ChatMediaMessageProps {
  msg: any;
  onOpen?: (url: string) => void;
  onReply?: (msg: any) => void;
  onRetry?: (msg: any) => void;
  onScrollToMessage?: (messageId: number) => void;
}

const ChatMediaMessage = ({
  msg,
  onOpen,
  onReply,
  onRetry,
  onScrollToMessage,
}: ChatMediaMessageProps) => {
  const { authDetails } = useAuth();

  // ─── DERIVED ────────────────────────────────

  const isSender = msg.sender_id === authDetails?.user?.id;
  const styles = getMessageLayout(isSender);
  const caption = msg.body || msg.caption || "";

  // ─── STATE ────────────────────────────────
  const [isHighlighted, setIsHighlighted] = useState(false);

  // ─── EFFECTS ────────────────────────────────

  // Listen for highlight events from MessageList scroll-to-reply
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail?.messageId === msg.id) {
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 1500);
      }
    };
    window.addEventListener("highlight-message", handler as EventListener);
    return () =>
      window.removeEventListener("highlight-message", handler as EventListener);
  }, [msg.id]);

  // ─── DERIVED FLAGS ──────────────────────────

  const isUploading = msg.delivery_status === "uploading";
  const isSending = msg.delivery_status === "sending";
  const isFailed = msg.delivery_status === "failed";
  const isSent = msg.delivery_status === "sent";
  const isRead = !!msg.read_at;
  const mediaUrls = useMemo(() => msg.media_urls || [], [msg.media_urls]);

  // ─── STATUS ─────────────────────────────────

  const renderStatus = () => {
    if (!isSender) return null;

    if (isUploading) return <LuClock size={10} className="animate-pulse" />;

    if (isFailed) return <AlertCircle size={12} className="text-red-500" />;

    if (isSending) return <LuClock size={10} />;

    if (isRead) return renderCheck("read");

    if (isSent) return renderCheck("sent");
    return <LuClock size={10} className="animate-pulse" />;
  };

  // ─── UPLOAD OVERLAY ─────────────────────────

  const renderUploadOverlay = () => {
    const base =
      "absolute inset-0 flex items-center justify-center rounded-[10px] z-10 bg-black/40";

    if (isFailed) {
      return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-[10px] z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRetry?.(msg);
            }}
            className="flex flex-col items-center gap-1 text-white hover:scale-105 transition-transform"
          >
            <RefreshCw size={24} />
            <span className="text-[10px] font-bold uppercase">Retry</span>
          </button>
        </div>
      );
    }

    if (isUploading || isSending) {
      return (
        <div className={base}>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full animate-spin border-2 border-emerald-100 border-t-emerald-600" />
            <span className="text-white text-[10px]">
              {isUploading ? "Uploading..." : "Sending..."}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  // ─── MEDIA RENDERERS ────────────────────────

  const renderImageGrid = () => {
    if (mediaUrls.length === 1) {
      return (
        <div
          className="relative cursor-pointer"
          onClick={() => !isUploading && onOpen?.(mediaUrls[0])}
        >
          <SafeImage
            src={mediaUrls[0]}
            alt="chat"
            width={800}
            height={800}
            className="w-full h-80 object-cover rounded-[10px]"
            showLoader
          />
          {renderUploadOverlay()}
        </div>
      );
    }

    const gridClass =
      mediaUrls.length === 2
        ? "grid grid-cols-2 gap-0.5"
        : "grid grid-cols-2 gap-0.5 auto-rows-[110px]";

    return (
      <div className={`relative ${gridClass} rounded-[10px] overflow-hidden`}>
        {mediaUrls.slice(0, 4).map((url: string, i: number) => (
          <div
            key={i}
            className={`relative overflow-hidden cursor-pointer ${getRadius(i, mediaUrls.length)} ${
              mediaUrls.length === 3 && i === 2 ? "col-span-2" : ""
            }`}
            onClick={() => !isUploading && onOpen?.(url)}
          >
            <SafeImage
              src={url}
              alt="chat"
              width={500}
              height={500}
              className="w-full h-44 object-cover"
              showLoader
            />
            {i === 3 && mediaUrls.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-semibold">
                +{mediaUrls.length - 4}
              </div>
            )}
          </div>
        ))}
        {renderUploadOverlay()}
      </div>
    );
  };

  const renderVideo = () => (
    <div className="relative rounded-[10px] overflow-hidden">
      <video
        src={mediaUrls[0]}
        className="w-full h-88 object-cover"
        controls={!isUploading}
      />
      {renderUploadOverlay()}
    </div>
  );

  const getFileNameFromUrl = (url: string): string => {
    try {
      const path = new URL(url).pathname;
      const parts = path.split("/");
      const filename = parts[parts.length - 1];
      return filename || "File";
    } catch {
      return "File";
    }
  };

  const getFileExtension = (url: string): string => {
    const filename = getFileNameFromUrl(url);
    const ext = filename.split(".").pop()?.toUpperCase() || "";
    return ext;
  };

  const renderFile = () => {
    // Single file
    if (mediaUrls.length === 1) {
      const FileIconComponent = getFileIcon(mediaUrls[0]);
      const fileName = getFileNameFromUrl(mediaUrls[0]);
      const fileExt = getFileExtension(mediaUrls[0]);

      return (
        <div className="relative">
          <a
            href={!isUploading ? mediaUrls[0] : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => isUploading && e.preventDefault()}
            className={`flex items-center gap-3 p-3 bg-white/40 border border-black/5 rounded-[10px] ${
              isUploading
                ? "cursor-default"
                : "hover:bg-white/60 cursor-pointer"
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
              <FileIconComponent size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-gray-900 truncate">
                {fileName}
              </p>
              <p className="text-[11px] text-gray-500 uppercase">
                {isUploading ? "Sending..." : `${fileExt || "File"}`}
              </p>
            </div>
            <div className="text-gray-400">
              {isUploading ? (
                <div className="w-4 h-4 rounded-full animate-spin border-2 border-emerald-100 border-t-emerald-600" />
              ) : (
                <Download size={16} />
              )}
            </div>
          </a>
        </div>
      );
    }

    // Multiple files — render as list
    return (
      <div className="relative">
        <div className="space-y-1 p-1">
          {mediaUrls.map((url: string, index: number) => {
            const FileIconComponent = getFileIcon(url);
            const fileName = getFileNameFromUrl(url);
            const fileExt = getFileExtension(url);

            return (
              <a
                key={index}
                href={!isUploading ? url : "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => isUploading && e.preventDefault()}
                className={`flex items-center gap-2 p-2 bg-white/40 border border-black/5 rounded-lg ${
                  isUploading
                    ? "cursor-default"
                    : "hover:bg-white/60 cursor-pointer"
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                  <FileIconComponent size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-gray-900 truncate">
                    {fileName}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">
                    {isUploading ? "Sending..." : fileExt}
                  </p>
                </div>
                <div className="text-gray-400">
                  {isUploading ? (
                    <div className="w-3 h-3 rounded-full animate-spin border border-emerald-100 border-t-emerald-600" />
                  ) : (
                    <Download size={14} />
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── RENDER ─────────────────────────────────

  return (
    <SwipeableMessage
      isSender={isSender}
      onReply={() => onReply?.(msg)}
      className={styles.container}
    >
      <div
        data-message-id={msg.id}
        className={`
          ${styles.bubble}
          p-0.5 relative w-full rounded-[10px] overflow-hidden shadow-sm
          transition-colors duration-300
          ${isHighlighted ? "ring-2 ring-orange/60" : ""}
        `}
      >
        {/* Reply preview */}
        {msg.reply_to_message && (
          <div className="px-1.5 pt-1.5 pb-0">
            <ReplyPreview
              reply={msg.reply_to_message}
              isSender={isSender}
              onScrollToMessage={onScrollToMessage}
            />
          </div>
        )}

        {/* Media content */}
        {msg.media_type === "image"
          ? renderImageGrid()
          : msg.media_type === "video"
            ? renderVideo()
            : renderFile()}

        {/* Caption */}
        {caption && <div className="px-2.5 py-2 text-[13px]">{caption}</div>}

        {/* Time + status */}
        <span
          className={`absolute bottom-1 right-2 text-[10px] flex items-center gap-1 ${styles.time} drop-shadow-md`}
        >
          {msg?.created_at &&
            new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          {/* {isSender && (
            <span className="text-[10px] opacity-80">{renderStatus()}</span>
          )} */}
        </span>
      </div>
    </SwipeableMessage>
  );
};

export default ChatMediaMessage;
