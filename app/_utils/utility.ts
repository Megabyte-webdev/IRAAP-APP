import { clsx, type ClassValue } from "clsx";

import {
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  FileCode,
  File,
  BookOpen,
  FileUp,
  Tag,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-NG").format(n);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const avatarBg = (initials: string) => {
  const map: Record<string, string> = {
    A: "bg-violet-100 text-violet-700",
    B: "bg-sky-100 text-sky-700",
    C: "bg-emerald-100 text-emerald-700",
    D: "bg-rose-100 text-rose-700",
    E: "bg-amber-100 text-amber-700",
    F: "bg-fuchsia-100 text-fuchsia-700",
    G: "bg-teal-100 text-teal-700",
    H: "bg-orange-100 text-orange-700",
    I: "bg-indigo-100 text-indigo-700",
    J: "bg-red-100 text-red-700",
    K: "bg-cyan-100 text-cyan-700",
    S: "bg-yellow-100 text-yellow-700",
    T: "bg-lime-100 text-lime-700",
  };
  return map[initials[0]] ?? "bg-slate-100 text-slate-700";
};

export const statusConfig = {
  active: {
    label: "Active",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  suspended: {
    label: "Suspended",
    cls: "bg-orange-50 text-orange-700 border border-orange-200",
  },
  banned: {
    label: "Banned",
    cls: "bg-red-50 text-red-600 border border-red-200",
  },
  // vendor
  verified: {
    label: "Verified",
    cls: "bg-violet-50 text-violet-700 border border-violet-200",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-50 text-red-600 border border-red-200",
  },
  // store
  inactive: {
    label: "Inactive",
    cls: "bg-slate-100 text-slate-500 border border-slate-200",
  },
  // order
  delivered: {
    label: "Delivered",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  processing: {
    label: "Processing",
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-600 border border-red-200",
  },
  refunded: {
    label: "Refunded",
    cls: "bg-slate-100 text-slate-500 border border-slate-200",
  },
  shipped: {
    label: "Shipped",
    cls: "bg-sky-50 text-sky-700 border border-sky-200",
  },
};

export const buildOptimisticMessage = ({
  body,
  media_type,
  media_url,
  recipient_id,
  conversation_id,
  currentUser,
  ...rest
}: any) => {
  return {
    id: `temp-${Date.now()}`,
    body: body || "",
    media_type: media_type || null,
    media_url: media_url || null,

    sender_id: currentUser.id,
    recipient_id,
    conversation_id,

    ...rest,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    pending: true,
    uploading: !!media_url,
    synced: false,
  };
};

export const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return FileImage;
    case "mp4":
    case "mov":
      return FileVideo;
    case "mp3":
    case "wav":
      return FileAudio;
    case "js":
    case "ts":
    case "tsx":
    case "json":
      return FileCode;
    case "pdf":
    case "doc":
    case "docx":
      return FileText;
    default:
      return File;
  }
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const getRadius = (i: number, total: number) => {
  if (total === 1) return "rounded-[10px]";

  if (total === 2) {
    return i === 0 ? "rounded-l-[10px]" : "rounded-r-[10px]";
  }

  if (total === 3) {
    if (i === 0) return "rounded-tl-[10px]";
    if (i === 1) return "rounded-tr-[10px]";
    return "rounded-b-[10px] col-span-2";
  }

  // 4 or more
  if (i === 0) return "rounded-tl-[10px]";
  if (i === 1) return "rounded-tr-[10px]";
  if (i === 2) return "rounded-bl-[10px]";
  if (i === 3) return "rounded-br-[10px]";

  return "";
};

export const projectSubmissionSteps = [
  { icon: BookOpen, label: "Project details", key: "details" },
  { icon: FileUp, label: "Document upload", key: "upload" },
  { icon: Tag, label: "Keywords & research area", key: "keywords" },
];
