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
}

export interface Stats {
  projects: Number;
  projectReviews: Number;
  approved: Number;
  revisions: Number;
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
  id: string;
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
