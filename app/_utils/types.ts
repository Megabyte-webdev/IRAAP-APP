export interface Project {
  review: string;
  id: number;
  title: string;
  student: string;
  status: string;
  submissionYear: string;
  abstract: string;
  fileUrl: string;
  studentId: string;
  supervisorId: string;
  supervisor?: string;
  categoryId?: number;
  category: string;
  createdAt: string;
  keywords?: string[];
}

export interface Stats {
  projects: number | string;
  projectReviews: number | string;
  approved: number | string;
  revisions: number | string;
}

export interface ReviewTask {
  id: number;
  reviewId: number;
  projectId: number;
  verifiedBy: number;
  description: string;
  studentNote: string;
  verifiedAt: Date;
  completedAt: Date;
  status: "PENDING" | "SUBMITTED" | "COMPLETED" | "VERIFIED";

  studentComment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED";
  createdAt: Date;
}

export interface Review {
  id: string;
  comments: string;
  status: "APPROVED" | "REJECTED" | "REVISION_REQUESTED";
  tasks?: Task[];
  createdAt: string;
}

export interface StatusBtnProps {
  active: boolean;
  isCurrent: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  activeClass: string;
}

export interface ProjectReviewModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSaveReview: (review: string) => void;
  onStatusChange: (
    status: "APPROVED" | "REJECTED" | "REVISION_REQUESTED",
  ) => void;
  reviewLoading?: boolean;
  statusLoading?: boolean;
}

export type ProjectStatus = "APPROVED" | "REJECTED" | "REVISION_REQUESTED";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED";

export interface ProjectReviewsProps {
  reviews: any;
  historyLoading: boolean;
  updatingTaskId?: number;
}

export interface Student {
  id: number;
  fullName: string;
  email: string;
  supervisorName: string | null;
  supervisorId: number | null;
  projectStatus:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "REVISION_REQUESTED"
    | null;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface ChatUser {
  id: number;
  participant: User;
  lastMessage: any;
  unreadCount: number | null;
  updatedAt: string;
}

export type SectionCompletion = {
  details: boolean;
  upload: boolean;
  keywords: boolean;
};

export type ChatAction = "chat:send" | "call:schedule";

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  msgType: "TEXT" | "CALL_INVITE" | "FILE" | "IMAGE";
  metadata?: {
    scheduledAt?: string;
    duration?: number;
    meetingId?: string;
  };
  status: "SENT" | "DELIVERED" | "READ";
  readAt: string | null;
  createdAt: string;
  sender: { id: number; fullName: string; role: string };
  mediaType?: string;
  mediaUrls?: string[];
  replyTo?: any;
}
