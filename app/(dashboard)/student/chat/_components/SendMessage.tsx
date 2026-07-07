"use client";

import { ArrowUp, Plus, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MediaUploadModal from "./MediaUploadViewer";
import ScrollToBottomBtn from "./ScrollToBottomBtn";
import { User } from "@/app/_utils/types";
import { useAuth } from "@/app/_context/AuthContext";
import { useChatUtils } from "@/app/_context/ChatContext";
import { websocket } from "@/app/_services/websocket";
import { queryClient } from "@/app/_services/query-client";
import {
  appendMessage,
  updateConversationLastMessage,
} from "@/app/helpers/chat-cache";
import { FILE_ACCEPT_MAP, FileAcceptType } from "@/app/_utils/markup";
import { chatFeatures } from "@/app/_utils/formatters";
import ScheduleMeetingModal from "./ScheduleMeetingModal";

interface SendMessageProps {
  selectedChat?: User;
  showScrollButton: boolean;
  onScrollToBottom?: any;
  unreadCount?: number;
}

const SendMessage = ({
  selectedChat,
  showScrollButton,
  onScrollToBottom,
  unreadCount,
}: SendMessageProps) => {
  const { authDetails } = useAuth();
  const { replyTo, setReplyTo } = useChatUtils();
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isSendingMedia, setIsSendingMedia] = useState(false);
  const [fileAcceptType, setFileAcceptType] = useState<FileAcceptType>("all");

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-focus when reply is set
  useEffect(() => {
    if (replyTo) textareaRef.current?.focus();
  }, [replyTo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      stopTyping();
    };
  }, []);

  // Helpers

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 112) + "px";
  };

  const openFilePicker = (type: FileAcceptType) => {
    setFileAcceptType(type);
    setShowMenu(false);
    setTimeout(() => document.getElementById("chat-file-input")?.click(), 0);
  };

  const resetInput = () => {
    setPendingFiles([]);
    setMessage("");
    stopTyping();
    setReplyTo(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  // Typing

  const stopTyping = () => {
    if (!selectedChat || !isTypingRef.current) return;
    websocket.emit("chat:typing", {
      recipientId: Number(selectedChat.id),
      isTyping: false,
    });
    isTypingRef.current = false;
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    if (!selectedChat) return;

    if (!isTypingRef.current) {
      websocket.emit("chat:typing", {
        recipientId: Number(selectedChat.id),
        isTyping: true,
      });
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 1500);
  };

  // Send
  const sendChatMessage = ({
    content,
    metadata = {},
  }: {
    content: string;
    metadata?: any;
  }) => {
    if (!selectedChat) return;

    const clientId = crypto.randomUUID();
    const now = new Date().toISOString();

    const optimisticMessage = {
      id: clientId,
      clientId,
      conversationId: -1,
      senderId: Number(authDetails.user.id),
      receiverId: Number(selectedChat.id),
      content,
      metadata,
      status: "PENDING",
      createdAt: now,
      replyToMessageId: replyTo?.id ?? null,
      readAt: null,
      msgType: metadata.msgType,
      meetingId: null,
      meetingUrl: null,
      sender: {
        id: Number(authDetails.user.id),
        fullName: authDetails.user.fullName,
        role: authDetails.user.role,
      },
      replyTo: replyTo
        ? {
            id: replyTo.id,
            content: replyTo.content,
            senderId: replyTo.senderId,
            createdAt: replyTo.createdAt,
          }
        : null,
    };
    console.log("optimistic", optimisticMessage);
    console.log("Main msg", content);

    queryClient.setQueryData(
      ["messages", Number(selectedChat.id)],
      (old: any) => appendMessage(old, optimisticMessage),
    );

    updateConversationLastMessage(
      queryClient,
      optimisticMessage,
      Number(authDetails.user.id),
    );

    websocket.emit("chat:send", {
      recipientId: Number(selectedChat.id),
      clientId,
      msgType: metadata.msgType,
      content,
      metadata,
      replyToMessageId: replyTo?.id ?? null,
    });

    resetInput();
  };

  const handleSend = () => {
    const trimmed = message.trim();

    if (!trimmed) return;

    sendChatMessage({
      content: trimmed,
      metadata: {
        msgType: "TEXT",
      },
    });
  };

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const filtered = files.filter((file) => {
      switch (fileAcceptType) {
        case "image":
        case "camera":
          return file.type.startsWith("image/");
        case "video":
          return file.type.startsWith("video/");
        case "file":
          return (
            !file.type.startsWith("image/") && !file.type.startsWith("video/")
          );
        default:
          return true;
      }
    });

    setPendingFiles((prev) => [...prev, ...filtered]);
    e.target.value = "";
  };

  const handleScheduleMeeting = ({
    scheduledAt,
    duration,
  }: {
    scheduledAt: string;
    duration: number;
  }) => {
    sendChatMessage({
      content: "Scheduled a meeting",
      metadata: {
        msgType: "CALL_INVITE",
        scheduledAt,
        duration,
        meetingTitle: `Meeting with ${selectedChat?.fullName}`,
      },
    });

    setShowMeetingModal(false);
  };

  const canSend = message.trim().length > 0 || pendingFiles.length > 0;

  return (
    <div className="w-full fixed bottom-0 z-10 md:relative py-2 px-3 md:px-6 border-t border-b border-[#00000033] text-black bg-white">
      {pendingFiles.length > 0 && (
        <MediaUploadModal
          files={pendingFiles}
          message={message}
          setMessage={setMessage}
          setFiles={setPendingFiles}
          onSend={handleSend}
          onAddMore={() => openFilePicker(fileAcceptType)}
          user={selectedChat}
          isSendingMedia={isSendingMedia}
        />
      )}

      {/* Reply bar */}
      {replyTo && (
        <div className="relative px-3 pb-1 pt-1 mb-1 w-full">
          <div
            className="flex items-center gap-3 px-3 py-2 bg-[#F4F4F4] rounded-[10px]"
            style={{ borderLeft: "4px solid #b07b1b" }}
          >
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide line-clamp-1">
                {Number(replyTo.senderId) === Number(authDetails?.user?.id)
                  ? "Replying to yourself"
                  : `Replying to ${selectedChat?.fullName ?? "them"}`}
              </p>
              <p className="text-xs text-gray-600 line-clamp-1">
                {replyTo.content}
              </p>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="cursor-pointer p-2 hover:bg-black/10 rounded-full text-gray-500"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Attachment menu */}
      {showMenu && (
        <div className="absolute bottom-16 left-3 md:left-6 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-1 flex flex-col gap-1 z-50">
          {chatFeatures.map(({ type, icon, label }: any) => (
            <button
              key={type}
              onClick={() => {
                if (type === "meeting") {
                  setShowMenu(false);
                  setShowMeetingModal(true);
                  return;
                }

                openFilePicker(type);
              }}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#f5f0f0] rounded-lg text-[13px]"
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-3 bg-[#EFF3F4] border-[0.5px] border-primary rounded-[30px] px-2.5 py-2 shadow-sm">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`cursor-pointer w-7.5 h-7.5 flex items-center justify-center border rounded-full transition-all ${
            showMenu ? "bg-black text-white" : "text-black border-black"
          }`}
        >
          <Plus
            size={18}
            strokeWidth={1}
            className={`${showMenu ? "rotate-45" : "rotate-0"} transition-transform`}
          />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          onChange={(e) => {
            handleTyping(e.target.value);
            autoResize(e.target);
          }}
          placeholder="Message"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            stopTyping();
          }}
          onKeyDown={(e) => {
            if (e.shiftKey) return;
            if (e.key === "Enter") {
              const isMobile = /iPhone|iPad|iPod|Android/i.test(
                navigator.userAgent,
              );
              if (!isMobile) {
                e.preventDefault();
                if (e.nativeEvent.isComposing) return;
                handleSend();
              }
            }
          }}
          className="flex-1 bg-transparent text-sm focus:outline-none max-h-28 resize-none overflow-hidden overflow-y-auto leading-5 py-1"
        />

        {(isFocused || message) && (
          <button
            onClick={handleSend}
            disabled={!canSend || isSendingMedia}
            className="w-7.5 h-7.5 flex items-center justify-center bg-primary text-white rounded-full transition-all active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSendingMedia ? (
              <Loader2 size={18} strokeWidth={1} className="animate-spin" />
            ) : (
              <ArrowUp size={18} strokeWidth={1} />
            )}
          </button>
        )}
      </div>

      <input
        key={fileAcceptType}
        id="chat-file-input"
        type="file"
        accept={FILE_ACCEPT_MAP[fileAcceptType]}
        multiple={fileAcceptType !== "camera"}
        capture={fileAcceptType === "camera" ? "environment" : undefined}
        className="hidden"
        onChange={handleFileChange}
      />

      <ScrollToBottomBtn
        onScrollToBottom={onScrollToBottom}
        isVisible={showScrollButton}
        unreadCount={unreadCount}
      />

      <ScheduleMeetingModal
        open={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSchedule={handleScheduleMeeting}
      />
    </div>
  );
};

export default SendMessage;
