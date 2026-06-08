import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskVersionApi } from "../_utils/api/task-versions";

export const useTaskVersions = () => {
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["project"] });

  return {
    createVersion: useMutation({
      mutationFn: ({ taskId, file }: any) =>
        taskVersionApi.createVersion(taskId, file),
      onSuccess: invalidate,
    }),

    submitVersion: useMutation({
      mutationFn: taskVersionApi.submitVersion,
      onSuccess: invalidate,
    }),

    approveVersion: useMutation({
      mutationFn: taskVersionApi.approveVersion,
      onSuccess: invalidate,
    }),

    rejectVersion: useMutation({
      mutationFn: taskVersionApi.rejectVersion,
      onSuccess: invalidate,
    }),

    recallVersion: useMutation({
      mutationFn: taskVersionApi.recallVersion,
      onSuccess: invalidate,
    }),
  };
};
