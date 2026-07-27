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
import { Meeting } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
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

export const getChapterState = (chapterTasks: any[], review: any) => {
  if (chapterTasks.every((t: any) => t.status === "VERIFIED")) {
    return {
      label: "Verified",
      style: "bg-green-50 text-green-700 border-green-200",
      urgent: false,
    };
  }

  if (
    review?.revisionSubmitted &&
    chapterTasks.every(
      (t: any) => t.status === "COMPLETED" || t.status === "VERIFIED",
    )
  ) {
    return {
      label: "Awaiting Review",
      style: "bg-indigo-50 text-indigo-700 border-indigo-200",
      urgent: false,
    };
  }

  if (chapterTasks.every((t: any) => t.status === "COMPLETED")) {
    return {
      label: "Ready to Submit",
      style: "bg-emerald-50 text-emerald-700 border-emerald-200",
      urgent: false,
    };
  }

  if (chapterTasks.some((t: any) => t.status === "IN_PROGRESS")) {
    return {
      label: "In Progress",
      style: "bg-amber-50 text-amber-700 border-amber-200",
      urgent: false,
    };
  }

  return {
    label: "Needs Attention",
    style: "bg-red-50 text-red-700 border-red-200",
    urgent: true,
  };
};

interface MeetingUrlParams {
  role: "STUDENT" | "SUPERVISOR";
  meeting: Partial<Meeting>;
  userName?: string;
}

export function getMeetingUrl({
  role,
  meeting,
  userName = "User",
}: MeetingUrlParams) {
  const rolePath = role.toLowerCase();
  const meetingId = meeting.meetingId;
  const params = new URLSearchParams({
    meetingId: meetingId ?? "",
    userName,
    hostName: meeting.creator?.fullName || "",
    meetingName: meeting.title ?? "",
  });

  return `/${rolePath}/waiting?${params.toString()}`;
}
