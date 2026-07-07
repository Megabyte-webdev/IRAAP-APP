import { Variants } from "framer-motion";
import {
  CalendarDays,
  Camera,
  Check,
  CheckCheck,
  File,
  FileText,
  GitBranch,
  Image,
  Video,
} from "lucide-react";

export const extractErrorMessage = (
  error:
    | {
        response: { data: any };
        message: string | string[];
      }
    | undefined,
) => {
  try {
    // 1. Dig into the response data (where FastAPI's detail lives)
    const resData = error?.response?.data;

    if (resData) {
      // Handle the specific structure: { detail: { message: "..." } }
      if (resData.detail?.message) {
        return resData.detail.message;
      }

      // Handle FastAPI Validation Errors: { detail: [{ loc: [...], msg: "..." }] }
      if (Array.isArray(resData.detail)) {
        return resData.detail
          .map((d: { loc: string | any[]; msg: string }) => {
            const field = Array.isArray(d.loc)
              ? d.loc[d.loc.length - 1]
              : d.loc || "";
            const formattedField = field
              .toString()
              .replace(/_/g, " ")
              .replace(/^\w/, (c: string) => c.toUpperCase());
            const cleanMsg = d.msg
              ?.replace("Field required", "is required")
              .trim();
            return formattedField ? `${formattedField} ${cleanMsg}` : cleanMsg;
          })
          .join(" | ");
      }

      // Handle simple string detail: { detail: "Error message" }
      if (typeof resData.detail === "string") {
        return resData.detail;
      }

      // Handle direct message or error keys: { message: "..." }
      if (resData.message && typeof resData.message === "string")
        return resData.message;
      if (resData.error && typeof resData.error === "string")
        return resData.error;
    }

    // 2. If no response data, check for standard Axios error messages
    if (error?.message) {
      if (error.message.includes("network error"))
        return "Network error. Please check your connection.";
      if (error.message.includes("timeout"))
        return "Request timed out. Please try again.";
      return error.message;
    }

    return "An unknown error occurred";
  } catch (err) {
    console.error("Error parsing message:", err);
    return "Something went wrong while processing the error.";
  }
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export const formStepVariants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
};

// Progress bar steps
export const steps = [
  { number: 1, title: "Account Created", desc: "Welcome to our platform" },
  { number: 2, title: "Store Setup", desc: "Store details & verification" },
  { number: 3, title: "Getting Started", desc: "Branding & first products" },
  { number: 4, title: "Complete", desc: "Ready to start selling" },
];

export const storedUserEmail = (email?: string) => {
  if (email) {
    localStorage.setItem("register_email", email);
  } else {
    return localStorage.getItem("register_email");
  }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const fadeIn = (direction = "up", delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay },
  },
});

export const statusStyles: any = {
  Processing: "bg-yellow-100 text-yellow-700",
  Ready_for_Shipment: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Completed: "bg-[#F0FDF4] text-[#38C066]",
};

export const getMessageLayout = (isSender: boolean) => ({
  container: isSender
    ? "flex flex-col gap-1 items-end ml-auto max-w-[70%]"
    : "flex flex-col gap-1 items-start max-w-[60%]",

  bubble: isSender ? "bg-primary text-white" : "bg-[#EFF3F4] text-black",

  time: isSender ? "text-white" : "text-black",
});

export const renderCheck = (status: string) => {
  if (status === "sent") return <Check size={12} />;
  if (status === "delivered") return <CheckCheck size={12} />;
  if (status === "read")
    return <CheckCheck size={12} className="text-black/80" />;
};

export const formatMessageDate = (dateString: string) => {
  const date = new Date(dateString);

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();

  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (dateString?: string) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Lagos",
  });
};

export const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

export const avatarColor = (id: string) =>
  AVATAR_COLORS[id?.charCodeAt(0) % AVATAR_COLORS.length] ?? AVATAR_COLORS[0];

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    pill: "bg-amber-50 text-amber-600 border-amber-200",
    dot: "bg-amber-400",
  },
  accepted: {
    label: "Accepted",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    pill: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-400",
  },
  expired: {
    label: "Expired",
    pill: "bg-slate-100 text-slate-500 border-slate-200",
    dot: "bg-slate-400",
  },
};

export const getInitials = (name?: string) => {
  if (!name) return "??";

  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
};

export const getTriggerMeta = (trigger: string, isCurrent: boolean) => {
  switch (trigger) {
    case "REVISION_SUBMISSION":
      return {
        color: "border-indigo-300 bg-indigo-50",
        dot: "bg-indigo-500",
        icon: <FileText size={10} className="text-indigo-500" />,
        label: "Revision submitted",
      };
    case "INITIAL_UPLOAD":
      return {
        color: "border-slate-300 bg-white",
        dot: "bg-slate-400",
        icon: <GitBranch size={10} className="text-slate-400" />,
        label: "Initial upload",
      };
    default:
      return {
        color: "border-slate-200 bg-white",
        dot: isCurrent ? "bg-emerald-500" : "bg-slate-300",
        icon: <FileText size={10} className="text-slate-400" />,
        label: trigger?.replace(/_/g, " ") ?? "Upload",
      };
  }
};

export const chatFeatures = [
  {
    type: "meeting",
    icon: <CalendarDays size={12} className="text-primary" />,
    label: "Schedule Meeting",
  },
  {
    type: "image" as const,
    icon: <Image size={12} className="text-[#007BFC]" />,
    label: "Add Photos",
  },
  {
    type: "video" as const,
    icon: <Video size={12} className="text-[#FF2E74]" />,
    label: "Add Videos",
  },
  {
    type: "file" as const,
    icon: <File size={12} className="text-[#333]" />,
    label: "Files",
  },
  {
    type: "camera" as const,
    icon: <Camera size={12} className="text-[#FF2E74]" />,
    label: "Camera",
  },
];
