"use client";

import { toast } from "react-toastify";

type ChatNotificationProps = {
  senderId: number;
  senderName: string;
  message: string;
  avatar?: string;
  conversationId?: number;
  authRole: string;
};

// store router outside component safely
export const requestNotificationPermission = async () => {
  if (typeof window === "undefined") return "denied";

  if (!("Notification" in window)) return "denied";

  const permission = await Notification.requestPermission();
  return permission;
};

export const showChatNotification = ({
  senderId,
  senderName,
  message,
  avatar,
  authRole,
}: ChatNotificationProps) => {
  const url = `/${authRole || "student"}/chat/${senderId}`;

  toast.info(
    <div className="flex items-center gap-3 cursor-pointer">
      {avatar ? (
        <img src={avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
      ) : (
        <div className="h-10 w-10 rounded-full bg-gray-200" aria-hidden="true" />
      )}
      <div className="min-w-0">
        <p className="font-semibold">{senderName}</p>
        <p className="truncate text-sm text-gray-600">{message}</p>
      </div>
    </div>,
    {
      toastId: `chat-${senderId}`,
      onClick: () => { window.location.assign(url); },
    },
  );
};
