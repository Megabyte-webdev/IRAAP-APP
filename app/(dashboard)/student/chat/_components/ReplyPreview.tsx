"use client";

import SafeImage from "@/app/_components/SafeImage";
import { useAuth } from "@/app/_context/AuthContext";
import { User } from "@/app/_utils/types";
import { Video, Image as ImageIcon, File } from "lucide-react";

// TYPES

interface ReplyPreviewProps {
  reply: any;
  isSender?: boolean;
  selectedUser?: User;
  onScrollToMessage?: (messageId: number) => void;
}

// HELPERS

const getMediaIcon = (mediaType?: string) => {
  if (mediaType === "image") return ImageIcon;
  if (mediaType === "video") return Video;
  if (mediaType === "file") return File;
  return null;
};

const getPreviewText = (reply: any) => {
  if (reply.content) return reply.content;
  if (reply.media_type === "image") return "Photo";
  if (reply.media_type === "video") return "Video";
  if (reply.media_type === "file") return reply.file_name || "File";
  return "Message";
};

// COMPONENT

export default function ReplyPreview({
  reply,
  isSender,
  onScrollToMessage,
  selectedUser,
}: ReplyPreviewProps) {
  const { authDetails } = useAuth();

  if (!reply) return null;

  const isReplySender =
    Number(reply.senderId) === Number(authDetails?.user?.id);
  const Icon = getMediaIcon(reply.media_type);
  const previewText = getPreviewText(reply);
  const isClickable = !!onScrollToMessage;

  const handleClick = () => {
    const id = Number(reply?.id);
    if (onScrollToMessage && !Number.isNaN(id)) {
      onScrollToMessage(id);
    }
  };

  const renderThumbnail = () => {
    if (reply.media_type === "image" && reply.media_urls?.[0]) {
      return (
        <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 bg-black/5">
          <SafeImage
            src={reply.media_urls[0]}
            alt="reply"
            width={36}
            height={36}
            className="w-full h-full object-cover opacity-75"
          />
        </div>
      );
    }

    if (Icon) {
      return (
        <div
          className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
            isSender ? "bg-black/10" : "bg-gray-300/50"
          }`}
        >
          <Icon size={16} className="text-black/40" />
        </div>
      );
    }

    return null;
  };

  return (
    <div
      onClick={handleClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable ? (e) => e.key === "Enter" && handleClick() : undefined
      }
      className={`
        mb-1 px-2.5 py-2 rounded-md
        flex items-start gap-2 w-full
        min-w-0 max-w-full
        backdrop-blur-sm
        transition-opacity
        ${isSender ? "bg-white/80" : "bg-black/80"}
        ${isClickable ? "cursor-pointer hover:opacity-80 active:opacity-60" : ""}
      `}
      style={{ borderLeft: "4px solid #bbb" }}
    >
      {/* Thumbnail */}
      {renderThumbnail()}

      {/* Text content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {/* Sender name */}
        <div
          className={`text-[10px] font-medium truncate ${
            isSender ? "text-green-700/80" : "text-orange"
          }`}
        >
          {isReplySender ? "You" : selectedUser?.fullName || "User"}
        </div>

        {/* Message preview */}
        <div className="flex items-center gap-1 text-[12px] text-black/55 min-w-0">
          {Icon && (
            <Icon
              size={14}
              className={`shrink-0 ${
                isSender ? "text-black/80" : "text-gray-300"
              }`}
            />
          )}
          <span
            className={`min-w-0 flex-1 line-clamp-2 wrap-break-word leading-tight ${
              isSender ? "text-black/80" : "text-gray-300"
            }`}
          >
            {previewText}
          </span>
        </div>
      </div>
    </div>
  );
}
