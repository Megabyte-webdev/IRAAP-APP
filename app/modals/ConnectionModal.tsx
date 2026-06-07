"use client";

import { motion, AnimatePresence } from "framer-motion";
import UserImage from "../../_components/UserImage";
import { useNotifications } from "@/app/context/NotificationContext";
import { useRouter } from "next/navigation";
import { MODAL_CLOSED } from "@/app/_utils/types/connection";

const ConnectionModal = () => {
  const { connectionModal, setConnectionModal } = useNotifications();
  const router = useRouter();
  const goToChat = () => {
    if (!connectionModal.userId) return;

    router.push(`/app/chat/${connectionModal.userId}`);
    setConnectionModal(MODAL_CLOSED);
  };

  const dismissModal = () => {
    setConnectionModal(MODAL_CLOSED);
  };
  return (
    <AnimatePresence>
      {connectionModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissModal}
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative w-full max-w-sm rounded-[28px] bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* subtle gradient glow */}
            <div className="absolute inset-0 bg-linear-to-b from-emerald-50/70 via-transparent to-transparent pointer-events-none" />

            <div className="relative px-6 pt-10 pb-7 text-center">
              {/* Avatar success ring */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mx-auto mb-6 relative w-24 h-24"
              >
                <motion.span
                  className="absolute inset-0 rounded-full bg-emerald-300/40"
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />

                <div className="relative h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <UserImage
                    user={{
                      id: connectionModal?.userId,
                      full_name: connectionModal?.full_name,
                      profile_pic: connectionModal?.profile_pic,
                    }}
                    size={50}
                  />
                </div>
              </motion.div>

              {/* Title */}
              <h2 className="text-[20px] font-semibold text-gray-900">
                Request sent
              </h2>

              {/* Context */}
              <p className="mt-2 text-[14px] text-gray-500 leading-relaxed">
                Your request to{" "}
                <span className="font-medium text-gray-800">
                  {connectionModal?.full_name}
                </span>{" "}
                has been sent. You can start chatting anytime.
              </p>

              {/* Divider */}
              <div className="my-6 mx-auto h-px w-14 bg-gray-200" />

              {/* Primary Action */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToChat}
                className="w-full rounded-2xl  py-3.5 text-black font-semibold shadow-md"
              >
                Send message
              </motion.button>

              {/* Secondary Action */}
              <motion.button
                whileHover={{ opacity: 0.7 }}
                whileTap={{ scale: 0.98 }}
                onClick={dismissModal}
                className="mt-3 w-full rounded-2xl py-3 text-sm font-medium text-gray-600"
              >
                Not now
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConnectionModal;
