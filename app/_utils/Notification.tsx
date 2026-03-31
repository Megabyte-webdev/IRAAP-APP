import React from "react";
import { toast, ToastOptions } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { IoInformationCircle } from "react-icons/io5";
import { MdCancel, MdCheckCircle } from "react-icons/md";

type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  title: string;
  message?: string;
  variant: ToastVariant;
}

interface ToastData {
  title: string;
  message?: string;
}

const VARIANT_CONFIGS = {
  success: {
    icon: MdCheckCircle,
    iconColor: "text-emerald-600",
    bgColor: "from-emerald-100 to-emerald-50",
    borderColor: "border-emerald-200",
    shadowColor: "hover:shadow-emerald-400/20",
  },
  error: {
    icon: MdCancel,
    iconColor: "text-rose-600",
    bgColor: "from-rose-100 to-rose-50",
    borderColor: "border-rose-200",
    shadowColor: "hover:shadow-rose-400/20",
  },
  info: {
    icon: IoInformationCircle,
    iconColor: "text-blue-600",
    bgColor: "from-blue-100 to-blue-50",
    borderColor: "border-blue-200",
    shadowColor: "hover:shadow-blue-400/20",
  },
};

// --- Base Component ---
const CustomToast: React.FC<ToastProps> = ({ title, message, variant }) => {
  const config = VARIANT_CONFIGS[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      className={`flex items-start gap-4 p-4 w-full bg-linear-to-br ${config.bgColor} 
                 shadow-xl rounded-2xl border ${config.borderColor} ${config.shadowColor} 
                 transition-all duration-300`}
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="mt-0.5"
      >
        <Icon className={`${config.iconColor} text-2xl`} />
      </motion.div>

      <div className="flex flex-col space-y-1">
        <h4 className="text-slate-900 font-bold text-[13px] leading-tight tracking-tight">
          {title}
        </h4>
        {message && (
          <p className="text-slate-600 text-xs font-medium leading-relaxed">
            {message}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// --- Professional API ---
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  className: "!bg-transparent !shadow-none !p-0 w-80 max-w-[320px] mr-2 mt-2",
};

export const notify = {
  success: (data: ToastData) => {
    toast(
      <CustomToast
        title={data.title}
        message={data.message}
        variant="success"
      />,
      defaultOptions,
    );
  },
  error: (data: ToastData) => {
    toast(
      <CustomToast title={data.title} message={data.message} variant="error" />,
      defaultOptions,
    );
  },
  info: (data: ToastData) => {
    toast(
      <CustomToast title={data.title} message={data.message} variant="info" />,
      defaultOptions,
    );
  },
};

// Compatibility exports if you prefer the old naming
export const onSuccess = notify.success;
export const onFailure = notify.error;
export const onPrompt = notify.info;
