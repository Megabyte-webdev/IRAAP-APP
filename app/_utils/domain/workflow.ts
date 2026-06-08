import { TaskVersionStatus } from "./task-version";

export const canSubmit = (status: TaskVersionStatus) =>
  status === "DRAFT" || status === "REJECTED";

export const canRecall = (status: TaskVersionStatus) => status === "SUBMITTED";

export const canReview = (status: TaskVersionStatus) => status === "SUBMITTED";

export const isFinal = (status: TaskVersionStatus) => status === "APPROVED";
