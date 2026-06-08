"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type ChatNotificationProps = {
  senderId: number;
  senderName: string;
  message: string;
  avatar?: string;
  conversationId?: number;
  authRole: string;
};

// store router outside component safely
let router: ReturnType<typeof useRouter> | null = null;

export const setChatRouter = (nextRouter: ReturnType<typeof useRouter>) => {
  router = nextRouter;
};

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
  const url = `/${authRole}/chat/${senderId}`;

  // Toast
  toast.info(
    <div className="flex items-center gap-3 cursor-pointer">
      {avatar ? (
        <img src={avatar} className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <div className="h-10 w-10 rounded-full bg-gray-200" />
      )}

      <div className="min-w-0">
        <p className="font-semibold">{senderName}</p>
        <p className="truncate text-sm text-gray-600">{message}</p>
      </div>
    </div>,
    {
      toastId: `chat-${senderId}`,
      onClick: () => {
        router?.push(url);
      },
    },
  );

  const shouldShowSystemNotification =
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted" &&
    document.hidden;

  if (shouldShowSystemNotification) {
    const notification = new Notification(senderName, {
      body: message,
      icon: avatar || "/irap-logo.png",
      tag: `chat-${senderId}`,
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = url;
      notification.close();
    };
  }
};
