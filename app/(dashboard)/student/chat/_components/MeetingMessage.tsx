"use client";

import { useEffect, useState } from "react";
import { getMessageLayout, renderCheck } from "@/app/_utils/formatters";
import { Video, Users, Calendar } from "lucide-react";
import SwipeableMessage from "./SwipeableMessage";
import { useAuth } from "@/app/_context/AuthContext";
import { Message } from "@/app/_utils/types";
import { LuClock } from "react-icons/lu";

interface MeetingMessageProps {
  msg: Message;
  onReply?: () => void;
}

const MeetingMessage = ({ msg, onReply }: MeetingMessageProps) => {
  const { authDetails } = useAuth();
  const isSender = Number(msg.senderId) === Number(authDetails?.user?.id);
  const styles = getMessageLayout(isSender);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Parse meeting metadata
  const meetingData = msg.metadata as {
    scheduledAt?: string;
    duration?: number;
    meetingTitle?: string;
    meetingUrl?: string;
    participants?: number;
  } | null;

  const scheduledDate = meetingData?.scheduledAt
    ? new Date(meetingData.scheduledAt)
    : null;

  const formattedDate = scheduledDate
    ? scheduledDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "—";

  const formattedTime = scheduledDate
    ? scheduledDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const duration = meetingData?.duration || 0;
  const title = meetingData?.meetingTitle || "Meeting Scheduled";
  const meetingUrl = meetingData?.meetingUrl || "#";
  const participants = meetingData?.participants || 0;

  // Render status indicator
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

  // Highlight on scroll-to
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
      onReply={onReply}
      className={styles.container}
    >
      <div
        data-message-id={msg.id}
        className={`
          ${styles.bubble}
          relative rounded-xl overflow-hidden text-sm
          transition-colors duration-300
          ${isHighlighted ? "ring-2 ring-orange/60 bg-orange/10" : ""}
        `}
        style={{
          boxShadow: "0px 0px 1.5px 0px #00000040",
          minWidth: "280px",
          maxWidth: "360px",
        }}
      >
        {/* Meeting Card Header */}
        <div
          className={`
            px-4 py-3 border-b
            ${isSender ? "bg-opacity-80" : "bg-linear-to-r from-blue-50 to-indigo-50"}
            ${isSender ? "border-blue-400" : "border-blue-200"}
          `}
        >
          <div className="flex items-center gap-2 mb-1">
            <Video
              size={16}
              className={isSender ? "text-white" : "text-blue-600"}
            />
            <p
              className={`font-semibold text-sm ${
                isSender ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </p>
          </div>
        </div>

        {/* Meeting Details */}
        <div className="px-4 py-3 space-y-2.5">
          {/* Date & Time */}
          <div className="flex items-start gap-2.5">
            <Calendar
              size={14}
              className={`mt-0.5 shrink-0 ${
                isSender ? "text-blue-200" : "text-blue-500"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs font-medium ${
                  isSender ? "text-blue-100" : "text-gray-600"
                }`}
              >
                {formattedDate} at {formattedTime}
              </p>
              {duration > 0 && (
                <p
                  className={`text-xs mt-0.5 ${
                    isSender ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  Duration: {duration} minutes
                </p>
              )}
            </div>
          </div>

          {/* Participants */}
          {participants > 0 && (
            <div className="flex items-center gap-2.5">
              <Users
                size={14}
                className={`shrink-0 ${
                  isSender ? "text-blue-200" : "text-blue-500"
                }`}
              />
              <p
                className={`text-xs ${
                  isSender ? "text-blue-100" : "text-gray-600"
                }`}
              >
                {participants}{" "}
                {participants === 1 ? "participant" : "participants"}
              </p>
            </div>
          )}

          {/* Join Button */}
          <button
            onClick={() => {
              window.open(meetingUrl, "_blank");
            }}
            className={`
              w-full mt-3 px-3 py-2 rounded-lg text-xs font-semibold
              transition-all active:scale-95
              ${
                isSender
                  ? "bg-white/20 hover:bg-white/30 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              }
            `}
          >
            Join Meeting →
          </button>
        </div>

        {/* Timestamp & Status */}
        <div
          className={`
            px-4 py-2 flex justify-end items-center gap-1
            text-[10px]
            ${isSender ? "text-blue-100" : "text-gray-500"}
          `}
        >
          {msg.createdAt &&
            new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          {isSender && <span className="text-[10px]">{renderStatus()}</span>}
        </div>
      </div>
    </SwipeableMessage>
  );
};

export default MeetingMessage;
