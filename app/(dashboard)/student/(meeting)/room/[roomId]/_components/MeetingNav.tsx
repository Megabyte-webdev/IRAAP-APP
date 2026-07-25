"use client";

import { MessageSquare, Users } from "lucide-react";
import { motion } from "framer-motion";

// MeetingNav Component
interface MeetingNavProps {
  meetingId: string;
  meetingName: string;
  setActiveTab: (tab: "chat" | "participants") => void;
  activeTab: "chat" | "participants";
  onToggleSidebar?: () => void;
  showSidebar?: boolean;
  pendingRequestCount?: number;
}

const MeetingNav = ({
  meetingName,
  meetingId,
  setActiveTab,
  activeTab,
  onToggleSidebar,
  pendingRequestCount = 0,
}: MeetingNavProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className=" flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-secondary border-b border-[#2D2F33] shrink-0"
    >
      {/* Left: Meeting Name */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="font-medium text-sm truncate max-w-30 sm:max-w-xs"
      >
        <p className="font-semibold text-sm">{meetingName}</p>
        <p className="text-xs">{meetingId}</p>
      </motion.div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Mobile Sidebar Toggle - Chat */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onToggleSidebar?.();
            setActiveTab("chat");
          }}
          className="block md:hidden text-gray-400 hover:text-gray-200 p-2 rounded-lg relative"
        >
          <MessageSquare className="w-4 h-4" />
        </motion.button>

        {/* Mobile Sidebar Toggle - Participants with Badge */}
        <motion.div className="block md:hidden relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onToggleSidebar?.();
              setActiveTab("participants");
            }}
            className="text-gray-400 hover:text-gray-200 p-2 rounded-lg relative"
          >
            <Users className="w-4 h-4" />
          </motion.button>

          {/* Badge for pending requests (mobile) */}
          {pendingRequestCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {pendingRequestCount > 9 ? "9+" : pendingRequestCount}
            </motion.div>
          )}
        </motion.div>

        {/* Tabs - Hidden on mobile when sidebar toggle is shown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex gap-2 rounded-md overflow-hidden text-xs sm:text-sm md:w-62.5"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("chat")}
            className={`flex-1 flex items-center justify-center rounded-md gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 ${
              activeTab === "chat"
                ? "bg-tertiary text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Chat</span>
          </motion.button>

          <motion.div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("participants")}
              className={`flex-1 flex items-center justify-center rounded-md gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 ${
                activeTab === "participants"
                  ? "bg-tertiary text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Participants</span>
              {pendingRequestCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className=" bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {pendingRequestCount > 9 ? "9+" : pendingRequestCount}
                </motion.div>
              )}
            </motion.button>

            {/* Badge for pending requests (desktop) */}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MeetingNav;
