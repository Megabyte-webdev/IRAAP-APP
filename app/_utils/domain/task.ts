import { TaskVersion } from "./task-version";

export interface Task {
  id: number;
  title: string;
  description?: string;
  createdAt: string;

  versions: TaskVersion[];
  currentVersionId?: number;
}
