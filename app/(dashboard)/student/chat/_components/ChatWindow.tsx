"use client";
import SendMessage from "./SendMessage";
import MessageList from "./MessageList";
import ChatHeader from "./ChatHeader";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { User } from "@/app/_utils/types";
import { useAuth } from "@/app/_context/AuthContext";

interface ChatWindowProps {
  selectedUser?: User;
  isConversationLoading: boolean;
  role?: "buyer" | "vendor";
}

const ChatWindow = ({
  selectedUser,
  isConversationLoading,
  role = "buyer",
}: ChatWindowProps) => {
  const { authDetails } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const scrollListRef = useRef<{
    scrollToBottom: () => void;
    markVisibleUnreadAsRead: () => void;
  }>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isRestrictedUser =
    selectedUser?.fullName === "Bouwnce" ||
    selectedUser?.email === "justclick610@gmail.com";

  //usePendingMessageRecovery(authDetails?.user?.id);

  // useEffect(() => {
  //   if (!userId) return;

  //   resetUnread(userId);
  // }, [userId]);

  if (userId && isConversationLoading && !selectedUser) {
    return (
      <div className="flex-1 flex flex-col">
        {/* HEADER SKELETON */}
        <div className="h-16 border-b flex items-center px-4 gap-3">
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-lg" />
          <div className="flex flex-col gap-2">
            <div className="w-32 h-3 bg-gray-200 animate-pulse rounded" />
            <div className="w-20 h-2 bg-gray-100 animate-pulse rounded" />
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 space-y-4">
          {[...Array(8)].map((_, i) => {
            const isMe = i % 2 === 0;

            return (
              <div
                key={i}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
            animate-pulse rounded-2xl px-4 py-3
            ${isMe ? "bg-gray-200" : "bg-gray-100"}
          `}
                  style={{
                    width: `${Math.random() * 40 + 30}%`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div
      className={`w-full flex-1 flex-col bg-white ${userId ? "flex" : "hidden md:flex"}`}
    >
      {/* Header */}
      <ChatHeader selectedChat={selectedUser} role={role} />

      {/* Messages */}
      {userId ? (
        <MessageList
          ref={scrollListRef}
          selectedUser={selectedUser}
          onScrollNearBottomChange={setShowScrollButton}
          onUnreadChange={setUnreadCount}
        />
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-[#fafafa]">
          <div className="max-w-sm text-center px-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-orange/10 flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.7}
                stroke="currentColor"
                className="size-10 text-orange"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01750 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01750 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01750 0zm0 0h-.375M21 12c0 4.97-4.03 9-9 9a8.96 8.96 0 01-4.255-1.067l-4.126 1.032a.75.75 0 01-.91-.91l1.032-4.126A8.96 8.96 0 013 12c0-4.97 4.03-9 9-9s9 4.03 9 9z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Your messages
            </h2>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Select a conversation from the sidebar to start chatting.
            </p>
          </div>
        </div>
      )}

      {/* Input Area */}
      {userId ? (
        isRestrictedUser ? (
          <div className="border-t border-t-[#0000004D] bg-gray-50 px-4 py-3 flex items-center justify-center gap-2">
            <ShieldAlert className="size-4 text-gray-400" />
            <p className="text-[13px] text-gray-500">
              <span className="font-semibold text-gray-700">
                System Policy:
              </span>{" "}
              This conversation is read-only.
            </p>
          </div>
        ) : (
          <SendMessage
            selectedChat={selectedUser}
            showScrollButton={showScrollButton}
            unreadCount={unreadCount}
            onScrollToBottom={() => {
              scrollListRef.current?.scrollToBottom();
              scrollListRef.current?.markVisibleUnreadAsRead();
            }}
          />
        )
      ) : null}
    </div>
  );
};

export default ChatWindow;
