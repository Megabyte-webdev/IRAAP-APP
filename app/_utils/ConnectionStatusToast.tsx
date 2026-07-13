"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { websocket } from "../_services/websocket";
import { useAuth } from "../_context/AuthContext";

type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export const ConnectionStatusToast = () => {
  const { authDetails } = useAuth();
  const [state, setState] = useState<ConnectionState>("disconnected");
  // "connected" should auto-dismiss after a short delay
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (s: ConnectionState) => {
      setState(s);

      if (s === "connected") {
        // Show "Connected" briefly then hide
        setVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setVisible(false), 2000);
      } else {
        // Always show for non-connected states
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setVisible(true);
      }
    };

    websocket.onStateChange(handler);
    return () => {
      websocket.offStateChange(handler);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const map: Record<ConnectionState, { text: string; color: string }> = {
    connecting: { text: "Connecting…", color: "bg-brand-orange" },
    reconnecting: { text: "Reconnecting…", color: "bg-brand-orange" },
    connected: { text: "Connected", color: "bg-green-500" },
    disconnected: { text: "Disconnected", color: "bg-red-500" },
  };

  const s = map[state];

  return (
    <AnimatePresence>
      {authDetails?.user && visible && (
        <motion.div
          key={state}
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="
            fixed top-4 left-1/2 -translate-x-1/2
            z-9999
            px-3 py-1.5
            rounded-full
            bg-background text-foreground
            border border-lighter-ash/40 dark:border-white/10
            shadow-lg
            flex items-center gap-2
            text-xs font-medium
          "
        >
          <span className={`w-2 h-2 rounded-full ${s.color} animate-pulse`} />
          {s.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
