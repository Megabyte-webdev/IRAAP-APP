import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { extractErrorMessage } from "../_lib/utils";
import { onFailure, onSuccess } from "../_utils/Notification";

const useStudent = () => {
  const queryClient = useQueryClient();
  const updateTaskByStudent = useMutation({
    mutationFn: async ({
      taskId,
      status,
      projectId,
      file,
    }: {
      taskId: number;
      status: "IN_PROGRESS" | "COMPLETED";
      file: File;
      projectId: number;
    }) => {
      const form = new FormData();
      form.append("status", status);
      if (file) form.append("file", file);

      const { data } = await api.patch(`/reviews/tasks/${taskId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    },
    onSuccess: (response, variables) => {
      const updatedTask = response?.task || response;

      queryClient.setQueryData(
        ["project-reviews", Number(variables.projectId)],
        (oldData: any) => {
          if (!Array.isArray(oldData)) return oldData;

          return oldData.map((review: any) => ({
            ...review,
            tasks: review.tasks.map((task: any) =>
              Number(task.id) === Number(updatedTask.id)
                ? { ...task, ...updatedTask }
                : task,
            ),
          }));
        },
      );
    },
    onError: (err) => {
      onFailure({
        title: "Update Failed",
        message:
          extractErrorMessage(err) ||
          "Could not update task status. Please try again.",
      });
    },
  });
  return {
    updateTaskByStudent,
  };
};

export default useStudent;
