export type TaskVersionStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface TaskVersion {
  id: number;
  taskId: number;
  versionNumber: number;
  status: TaskVersionStatus;
  fileUrl?: string;
  submittedAt?: string;
  reviewedAt?: string;
}
