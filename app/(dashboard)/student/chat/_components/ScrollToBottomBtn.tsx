import { motion, AnimatePresence } from "framer-motion";

const ScrollToBottomBtn = ({
  onScrollToBottom,
  isVisible,
  unreadCount,
}: {
  onScrollToBottom: () => void;
  isVisible: boolean;
  unreadCount?: number;
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={onScrollToBottom}
          aria-label="Scroll to bottom"
          className="cursor-pointer absolute -top-16 right-5 w-11 h-11 
                     bg-tertiary rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] 
                     border border-gray-300 flex items-center justify-center 
                     hover:bg-gray-50 active:scale-90 transition-colors z-50"
        >
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToBottomBtn;
