"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useMeeting } from "@afosecure/meetingsdk";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal, X, Check, MessageSquare, Users } from "lucide-react";
import { RightPanelProps } from "@/app/_utils/types/meeting";
import { getAvatarColor, getInitials } from "@/app/_utils/formatters";

interface JoinRequest {
  requestId: string;
  name: string;
  userId: string;
  timestamp?: number;
}

interface RightPanelWithRequestsProps extends RightPanelProps {
  joinRequests?: JoinRequest[];
  onApproveRequest?: (requestId: string) => void;
  onRejectRequest?: (requestId: string) => void;
}

const RightPanel = ({
  activeTab = "chat",
  setActiveTab,
  toggleSidebar,
  showSidebar,
  onUnreadChange,
  isChatOpen,
  joinRequests = [],
  onApproveRequest,
  onRejectRequest,
}: RightPanelWithRequestsProps) => {
  const { localParticipant, participants, usePubSub } = useMeeting();
  const [message, setMessage] = useState("");
  const [lastSeenMessageId, setLastSeenMessageId] = useState<string | null>(
    null,
  );

  const [isDesktop, setIsDesktop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isChatVisible = isChatOpen && (isDesktop || showSidebar);

  // Use VideoSDK's PubSub for real-time chat
  const { publish, messages: sdkMessages } = usePubSub("SECURE_CHAT");

  // Convert VideoSDK messages to chat format
  const chatMessages = Array.from(sdkMessages?.values() ?? []);

  useEffect(() => {
    if (!localParticipant) return;

    if (isChatVisible) {
      if (chatMessages.length > 0) {
        setLastSeenMessageId(chatMessages[chatMessages.length - 1].id);
      }
      onUnreadChange(0);
      return;
    }

    let startIndex = -1;
    if (lastSeenMessageId) {
      startIndex = chatMessages.findIndex((m) => m.id === lastSeenMessageId);
    }

    const newMessages =
      startIndex === -1 ? chatMessages : chatMessages.slice(startIndex + 1);

    const unread = newMessages.filter(
      (m) => m.sender_id !== localParticipant.id,
    ).length;

    onUnreadChange(unread);
  }, [
    chatMessages,
    isChatVisible,
    lastSeenMessageId,
    localParticipant,
    onUnreadChange,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Combine Local + Remote participants safely
  const participantList = useMemo(() => {
    const remoteList = Array.from(participants?.values() || []);
    if (localParticipant) {
      return [{ ...localParticipant, isLocal: true }, ...remoteList];
    }
    return remoteList;
  }, [participants, localParticipant]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      publish({
        message,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 z-50 bg-secondary flex flex-col lg:relative w-full  lg:w-[320px] border-l border-[#2D2F33] shrink-0 ${
        showSidebar ? "block" : "hidden lg:flex"
      }`}
    >
      {/* Header & Tab Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[#2D2F33] bg-[#1E2023] px-3 py-2 shrink-0">
        <div className="flex items-center gap-1 bg-[#141517] p-1 rounded-lg flex-1 mr-2">
          <button
            onClick={() => setActiveTab?.("chat")}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
              activeTab === "chat"
                ? "bg-[#2D2F33] text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>

          <button
            onClick={() => setActiveTab?.("participants")}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
              activeTab === "participants"
                ? "bg-[#2D2F33] text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>People ({participantList.length})</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={toggleSidebar}
          className="block lg:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#2D2F33] transition-colors"
          title="Close sidebar"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <>
            <div className="p-3 sm:p-4 flex-1 space-y-4 overflow-y-auto">
              <AnimatePresence>
                {chatMessages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 text-sm py-8"
                  >
                    No messages yet. Start the conversation!
                  </motion.div>
                ) : (
                  chatMessages.map((msg: any, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-2 sm:gap-3 text-sm ${
                        msg.sender_id === localParticipant?.id
                          ? "flex-row-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
                        style={{
                          backgroundColor: getAvatarColor(msg.sender_name),
                        }}
                      >
                        {getInitials(msg.sender_name)}
                      </div>
                      <div
                        className={`min-w-0 flex-1 ${
                          msg.sender_id === localParticipant?.id
                            ? "text-right"
                            : ""
                        }`}
                      >
                        <p
                          className={`${
                            msg.sender_id === localParticipant?.id
                              ? "ml-auto"
                              : "ml-0"
                          } font-semibold text-xs sm:text-[13px] flex items-center gap-1 w-max`}
                        >
                          <span className="truncate max-w-[70%] w-max">
                            {msg.sender_id === localParticipant?.id
                              ? "You"
                              : msg.sender_name}
                          </span>
                          <span className="text-gray-400 text-[10px] sm:text-[11px]">
                            {formatTime(msg.timestamp)}
                          </span>
                        </p>
                        <motion.p
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className={`text-white-secondary text-xs sm:text-[13px] wrap-break-word p-2 rounded-lg ${
                            msg.sender_id === localParticipant?.id
                              ? "ml-4"
                              : "mr-4"
                          }`}
                        >
                          {msg.text}
                        </motion.p>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-3 border-t border-[#2D2F33] shrink-0"
            >
              <div className="bg-secondary-light rounded-lg flex items-center px-3 py-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent outline-none placeholder-white-secondary text-sm text-white"
                  placeholder="Type a message..."
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`ml-2 text-sm ${
                    message.trim()
                      ? "text-white-secondary hover:text-blue-300"
                      : "text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <SendHorizonal className="size-5" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}

        {/* PARTICIPANTS TAB */}
        {activeTab === "participants" && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 sm:p-4 overflow-y-auto max-h-full space-y-4">
              {/* JOIN REQUESTS SECTION */}
              {joinRequests.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#2a3a2a] border border-[#3a5a3a] rounded-lg p-3 space-y-2"
                >
                  <p className="text-xs font-semibold text-[#b3c29b]">
                    {joinRequests.length} pending{" "}
                    {joinRequests.length === 1 ? "request" : "requests"}
                  </p>

                  <AnimatePresence>
                    {joinRequests.map((req) => (
                      <motion.div
                        key={req.requestId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="bg-[#1a2a1a] p-2 rounded-lg flex items-center justify-between gap-2"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
                          style={{
                            backgroundColor: getAvatarColor(req.name),
                          }}
                        >
                          {getInitials(req.name)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate text-white">
                            {req.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            wants to join
                          </p>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onApproveRequest?.(req.requestId)}
                            className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"
                            title="Approve"
                          >
                            <Check className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onRejectRequest?.(req.requestId)}
                            className="bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-colors"
                            title="Reject"
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* PARTICIPANTS LIST */}
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400 mb-3 tracking-wider">
                  In Meeting ({participantList.length})
                </p>
                <div className="space-y-1 text-sm">
                  <AnimatePresence>
                    {participantList.length === 0 ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-400 text-xs py-4 text-center"
                      >
                        Waiting for participants...
                      </motion.p>
                    ) : (
                      participantList.map((participant, index) => (
                        <motion.div
                          key={participant.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#2D2F33] transition-colors"
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
                            style={{
                              backgroundColor: getAvatarColor(
                                participant.name || "Guest",
                              ),
                            }}
                          >
                            {getInitials(participant.name || "Guest")}
                          </div>
                          <span className="truncate text-xs sm:text-sm text-gray-200">
                            {participant.name || "Guest"}
                            {participant.id === localParticipant?.id &&
                              " (You)"}
                          </span>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RightPanel;
