"use client";

import { useMemo, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import ViewerNav from "./ViewerNav";
import { User } from "@/app/_utils/types";

interface MediaUploadModalProps {
  files: File[];
  message: string;
  setMessage: (val: string) => void;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onSend: () => void;
  onAddMore: () => void;
  user?: User;
  isSendingMedia?: boolean;
}

const MediaUploadModal = ({
  files,
  message,
  setMessage,
  setFiles,
  onSend,
  onAddMore,
  user,
  isSendingMedia = false,
}: MediaUploadModalProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // CREATE PREVIEW URLS
  const previews = useMemo(() => {
    return files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));
  }, [files]);

  const removeFile = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);

    setFiles(updated);

    if (activeIndex >= updated.length) {
      setActiveIndex(Math.max(0, updated.length - 1));
    }
  };

  if (files.length === 0) return null;

  const activeFile = previews[activeIndex];

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-100 justify-between gap-2">
      {/* HEADER */}
      <ViewerNav user={user} display="" handleClose={() => setFiles([])} />

      {/* MAIN VIEWER */}
      <div className="flex-1 flex items-center justify-center overflow-hidden px-4">
        {activeFile.type.startsWith("image/") ? (
          <Image
            src={activeFile.url}
            alt="preview"
            width={1200}
            height={900}
            priority
            className="max-h-full w-auto object-contain"
          />
        ) : activeFile.type.startsWith("video/") ? (
          <video
            src={activeFile.url}
            controls
            className="max-h-full max-w-full rounded-xl"
          />
        ) : (
          <div className="bg-[#EFF3F4] rounded-2xl p-8 text-center max-w-md w-full">
            <div className="text-5xl mb-4">📄</div>

            <p className="font-semibold text-sm break-all">{activeFile.name}</p>

            <p className="text-xs text-gray-500 mt-2">
              {(files[activeIndex].size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      {/* MESSAGE INPUT */}
      <div className="flex items-center justify-center overflow-hidden my-3">
        <div className="w-full max-w-3xl relative px-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a Message"
            className="w-full py-4 px-6 pr-14 rounded-[10px] bg-[#EFF3F4] border-none focus:outline-none text-sm placeholder:text-[#9C9C9C]"
            onKeyDown={(e) => e.key === "Enter" && onSend()}
          />

          <button
            onClick={onSend}
            disabled={isSendingMedia}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-7.75 h-7.5 flex items-center justify-center bg-orange text-white rounded-full transition-all active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSendingMedia ? (
              <Loader2 size={18} strokeWidth={1} className="animate-spin" />
            ) : (
              <FiArrowUp size={18} strokeWidth={1} />
            )}
          </button>
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="bg-white flex items-center gap-2 p-2 border-t border-[#00000033] overflow-x-auto">
        {previews.map((file, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative shrink-0 w-17 h-15 overflow-hidden cursor-pointer border ${
              i === activeIndex
                ? "border-orange border-2"
                : "border-transparent"
            }`}
          >
            {file.type.startsWith("image/") ? (
              <img
                src={file.url}
                className="w-full h-full object-cover"
                alt="thumb"
              />
            ) : file.type.startsWith("video/") ? (
              <video src={file.url} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#EFF3F4] flex items-center justify-center text-xl">
                📄
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile(i);
              }}
              className="absolute top-0 right-0 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}

        {/* ADD MORE */}
        <button
          onClick={onAddMore}
          className="bg-white shrink-0 w-17 h-15 border border-[#00000033] flex items-center justify-center hover:bg-gray-50 transition-all"
        >
          <Plus size={18} className="text-black" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default MediaUploadModal;
