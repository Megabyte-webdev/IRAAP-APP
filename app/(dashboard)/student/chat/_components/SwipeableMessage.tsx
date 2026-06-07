"use client";

import { Reply } from "lucide-react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ReactNode, useRef } from "react";

const SWIPE_THRESHOLD = 48;

interface Props {
  children: ReactNode;
  isSender?: boolean;
  onReply?: () => void;
  className?: string;
}

export default function SwipeableMessage({
  children,
  isSender,
  onReply,
  className = "",
}: Props) {
  const controls = useAnimation();
  const triggeredRef = useRef(false);

  const x = useMotionValue(0);

  const iconOpacity = useTransform(
    x,
    isSender ? [0, -16, -SWIPE_THRESHOLD] : [0, 16, SWIPE_THRESHOLD],
    [1, 0.4, 0],
  );

  const iconScale = useTransform(
    x,
    isSender ? [10, 16, SWIPE_THRESHOLD] : [0, 16, SWIPE_THRESHOLD],
    [1.15, 0.85, 0.6],
  );

  const handleDrag = () => {
    const current = x.get();

    const overThreshold = isSender
      ? current < -SWIPE_THRESHOLD
      : current > SWIPE_THRESHOLD;

    if (overThreshold && !triggeredRef.current) {
      triggeredRef.current = true;
    }
  };

  const handleDragEnd = () => {
    const current = x.get();

    const triggered = isSender
      ? current < -SWIPE_THRESHOLD
      : current > SWIPE_THRESHOLD;

    if (triggered) onReply?.();

    triggeredRef.current = false;

    controls.start({
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    });
  };

  return (
    <div className={`relative w-fit group ${className}`}>
      {/* Reply icon (hover + swipe hybrid) */}
      <div
        onClick={onReply}
        className={`
          absolute top-1/2 -translate-y-1/2 z-0
          w-6 h-6 rounded-full bg-gray-100
          flex items-center justify-center
          cursor-pointer
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
          ${isSender ? "-left-10" : "-right-10"}
        `}
      >
        <motion.div
          style={{
            opacity: iconOpacity,
            scale: iconScale,
          }}
        >
          <Reply size={12} className="text-gray-500" />
        </motion.div>
      </div>

      {/* Swipeable content */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={
          isSender
            ? { left: -SWIPE_THRESHOLD * 1.4, right: 0 }
            : { left: 0, right: SWIPE_THRESHOLD * 1.4 }
        }
        dragElastic={0.25}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="cursor-grab relative z-5 touch-pan-y max-w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
