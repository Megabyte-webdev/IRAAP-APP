"use client";

import { useEffect, useRef, useState } from "react";
import { getMessageLayout, renderCheck } from "@/app/_utils/formatters";
import { LuClock } from "react-icons/lu";
import SwipeableMessage from "./SwipeableMessage";
import ReplyPreview from "./ReplyPreview";
import { useAuth } from "@/app/_context/AuthContext";
import { User } from "@/app/_utils/types";

interface ChatMessageProps {
  msg: any;
  onReply?: (msg: any) => void;
  onScrollToMessage?: (messageId: number) => void;
  selectedUser?: User;
}

const ChatMessage = ({
  msg,
  onReply,
  onScrollToMessage,
  selectedUser,
}: ChatMessageProps) => {
  const { authDetails } = useAuth();

  // senderId is a number, authDetails.user.id may be number or string — coerce both
  const isSender = Number(msg.senderId) === Number(authDetails?.user?.id);
  const styles = getMessageLayout(isSender);

  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) setShowReadMore(el.scrollHeight > el.clientHeight + 5);
  }, [msg.content]);

  // ── Status
  // Map server status enum to display
  const renderStatus = () => {
    if (!isSender) return null;
    switch (msg.status) {
      case "READ":
        return renderCheck("read");
      case "DELIVERED":
        return renderCheck("delivered");
      case "SENT":
        return renderCheck("sent");
      default:
        return <LuClock size={10} />;
    }
  };

  // ── Highlight on scroll-to ───────────────────────────────────────────────
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
          relative rounded-[10px] text-[13px]
          transition-colors duration-300
          ${isHighlighted ? "ring-2 ring-orange/60 bg-orange/10" : ""}
        `}
        style={{
          boxShadow: "0px 0px 1.5px 0px #00000040",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          whiteSpace: "pre-wrap",
          padding: msg.replyTo ? "6px" : "10px",
          borderTopLeftRadius: msg.replyTo && !isSender ? "0" : undefined,
          borderTopRightRadius: msg.replyTo && isSender ? "0" : undefined,
        }}
      >
        {msg.replyTo && (
          <ReplyPreview
            reply={msg.replyTo}
            isSender={isSender}
            selectedUser={selectedUser}
            // onScrollToMessage={onScrollToMessage}
          />
        )}

        {/* content is the real field name */}
        <div
          ref={textRef}
          className={`pr-10 ${!expanded ? "line-clamp-4" : ""}`}
        >
          {msg.content}
        </div>

        {showReadMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`block text-[11px] mt-1 font-semibold opacity-60 hover:opacity-100 transition-opacity active:scale-95 ${
              isSender ? "text-black" : "text-green-800"
            }`}
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}

        <div className="flex justify-end mt-0.5">
          <div
            className={`flex items-center gap-1 text-[10px] opacity-70 ${styles.time}`}
          >
            {msg.createdAt &&
              new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            {isSender && <span className="text-[10px]">{renderStatus()}</span>}
          </div>
        </div>
      </div>
    </SwipeableMessage>
  );
};

export default ChatMessage;
