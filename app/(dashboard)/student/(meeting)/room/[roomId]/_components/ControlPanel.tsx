"use client";

import { useState } from "react";
import {
  MessageCircle,
  Mic,
  MicOff,
  MonitorUp,
  MonitorStop,
  Phone,
  Users,
  Video,
  VideoOff,
  Smile,
} from "lucide-react";
import { useLocalParticipant, useMeeting } from "@afosecure/meetingsdk";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import RoundControlButton from "./RoundControlButton";

const ControlPanel = ({ toggleSidebar, setActiveTab, unreadCount }: any) => {
  const {
    localParticipant,
    toggleMic,
    toggleCam,
    leave,
    stopScreenShare,
    startScreenShare,
    presenterId,
  } = useMeeting();

  const router = useRouter();
  const { participant } = useLocalParticipant();
  const micOn = !!participant?.media?.micEnabled;
  const webcamOn = !!participant?.media?.camEnabled;

  const [isLeaving, setIsLeaving] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<
    { emoji: string; id: string; name: string }[]
  >([]);

  const EMOJIS = ["👍", "👏", "😂", "🔥", "❤️", "🎉"];

  const handleReceiveFlyingEmoji = (emoji: string, name: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setReactions((prev) => [...prev, { emoji, id, name }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  const sendReaction = (emoji: string) => {
    handleReceiveFlyingEmoji(emoji, "You");
    setShowReactions(false);
  };

  const isSharing = presenterId === localParticipant?.id;

  const handleToggleMic = () => toggleMic();
  const handleToggleCam = () => toggleCam();

  const handleLeave = async () => {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      leave();
    } catch (e) {
      console.error("Error leaving meeting:", e);
    } finally {
      router.push("/");
    }
  };

  const handleScreenShare = async () => {
    if (!localParticipant?.id) return;
    if (presenterId && presenterId !== localParticipant.id) return;
    try {
      if (isSharing) await stopScreenShare();
      else await startScreenShare();
    } catch (error) {
      console.error("Screen share error", error);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className=" w-full z-50 flex justify-center pb-safe"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex items-center justify-between md:justify-center gap-1.5 md:gap-3 bg-[#959596] rounded-full backdrop-blur-md w-full px-3 py-2.5 shadow-lg border-t border-white/10"
      >
        <div className="flex items-center justify-center gap-1.5 md:gap-3 w-full max-w-md">
          {/* Mic */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <RoundControlButton active={micOn} onClick={handleToggleMic}>
              {micOn ? (
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <MicOff className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </RoundControlButton>
          </motion.div>

          {/* Camera */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <RoundControlButton active={webcamOn} onClick={handleToggleCam}>
              {webcamOn ? (
                <Video className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <VideoOff className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </RoundControlButton>
          </motion.div>

          {/* Chat */}
          <motion.div whileTap={{ scale: 0.9 }} className="block lg:hidden">
            <RoundControlButton
              onClick={() => {
                toggleSidebar?.();
                setActiveTab("chat");
              }}
            >
              <div className="relative">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-[9px] font-bold leading-none text-white flex items-center justify-center border border-secondary">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            </RoundControlButton>
          </motion.div>

          {/* Screen Share (Hidden on small mobile viewports) */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={`hidden md:block ${
              presenterId ? "cursor-not-allowed opacity-50" : "opacity-100"
            }`}
          >
            <RoundControlButton
              active={isSharing}
              onClick={handleScreenShare}
              aria-label={
                isSharing ? "Stop screen sharing" : "Start screen sharing"
              }
              title={isSharing ? "Stop screen sharing" : "Start screen sharing"}
            >
              {isSharing ? (
                <MonitorStop className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              ) : (
                <MonitorUp className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </RoundControlButton>
          </motion.div>

          {/* Participants Toggle */}
          <motion.div whileTap={{ scale: 0.9 }} className="block lg:hidden">
            <RoundControlButton
              onClick={() => {
                toggleSidebar();
                setActiveTab("participants");
              }}
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
            </RoundControlButton>
          </motion.div>

          {/* Emoji Reactions Popover */}
          <motion.div whileTap={{ scale: 0.9 }} className="relative">
            <RoundControlButton onClick={() => setShowReactions((v) => !v)}>
              <Smile className="w-4 h-4 md:w-5 md:h-5" />
            </RoundControlButton>

            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 bg-primary/30 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 shadow-2xl z-50"
              >
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => sendReaction(emoji)}
                    className="text-lg md:text-xl hover:scale-125 active:scale-95 transition shrink-0 p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Leave Call Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLeave}
            disabled={isLeaving}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 ml-auto md:ml-2 ${
              isLeaving
                ? "bg-red-500/60 cursor-not-allowed"
                : "bg-red-600 active:bg-red-700"
            }`}
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Animations */}
      <AnimatePresence>
        {reactions.map(({ emoji, id, name }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.2, y: -140 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="fixed left-1/2 bottom-1/4 -translate-x-1/2 flex flex-col items-center pointer-events-none z-999"
          >
            <div className="text-4xl md:text-5xl">{emoji}</div>
            <div className="mt-1 text-white bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] shadow-lg">
              {name}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ControlPanel;
