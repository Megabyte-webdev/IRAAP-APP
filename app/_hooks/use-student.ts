import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../_lib/utils";

const useStudent = () => {
  const queryClient = useQueryClient();
  const updateTaskByStudent = useMutation({
    mutationFn: async ({
      taskId,
      status,
      projectId,
    }: {
      taskId: number;
      status: "IN_PROGRESS" | "COMPLETED";
      projectId: number;
    }) => {
      const { data } = await api.patch(`/reviews/tasks/${taskId}`, { status });
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
      toast.error(extractErrorMessage(err));
    },
  });
  return {
    updateTaskByStudent,
  };
};

export default useStudent;
