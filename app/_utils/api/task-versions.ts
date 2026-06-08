import { api } from "@/app/_lib/api-client";

export const taskVersionApi = {
  createVersion: (taskId: number, file: File) => {
    const form = new FormData();
    form.append("file", file);

    return api.post(`/tasks/${taskId}/versions`, form);
  },

  submitVersion: (versionId: number) =>
    api.post(`/versions/${versionId}/submit`),

  approveVersion: (versionId: number) =>
    api.post(`/versions/${versionId}/approve`),

  rejectVersion: (versionId: number) =>
    api.post(`/versions/${versionId}/reject`),

  recallVersion: (versionId: number) =>
    api.post(`/versions/${versionId}/recall`),
};
