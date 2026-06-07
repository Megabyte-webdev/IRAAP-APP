"use client";

import { Image as ImageIcon, Video, FileText } from "lucide-react";

interface Props {
  reply: any;
  isSender?: boolean;
}

export default function SmartReplyPreview({ reply }: Props) {
  if (!reply) return null;

  const isImage = reply.media_type === "image";
  const isVideo = reply.media_type === "video";
  const isFile = reply.media_type === "file";

  const text = isImage
    ? "Photo"
    : isVideo
      ? "Video"
      : isFile
        ? reply.file_name || "Document"
        : reply.content || "";

  return (
    <div className="relative text-xs w-full min-w-0">
      <div className="flex items-center gap-2.5 w-full min-w-0">
        {/* ICON */}
        {(isImage || isVideo || isFile) && (
          <div className="w-8 h-8 shrink-0 rounded bg-black/10 flex items-center justify-center">
            {isImage && <ImageIcon size={14} className="text-gray-500" />}
            {isVideo && <Video size={14} className="text-gray-500" />}
            {isFile && <FileText size={14} className="text-gray-500" />}
          </div>
        )}

        {/* TEXT */}
        <div className="flex-1">
          <p className="line-clamp-1 text-gray-400 font-medium wrap-break-word break-all">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
