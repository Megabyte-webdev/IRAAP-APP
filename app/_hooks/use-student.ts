import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { extractErrorMessage } from "../_lib/utils";
import { onFailure, onSuccess } from "../_utils/Notification";
import { TaskStatus } from "../_utils/types";

const useStudent = () => {
  const queryClient = useQueryClient();
  const updateAllReviewTasksByStudent = useMutation({
    mutationFn: async ({
      reviewId,
      status,
      projectId,
    }: {
      reviewId: number;
      status: TaskStatus;
      projectId: number;
    }) => {
      // Hits the new bulk review round update endpoint
      const { data } = await api.patch(`/reviews/${reviewId}`, { status });
      return data;
    },
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        ["project-reviews", Number(variables.projectId)],
        (oldData: any) => {
          if (!Array.isArray(oldData?.data || oldData)) return oldData;

          // Account for standard envelope structures (handling both direct arrays or response.data nests)
          const isNested = Array.isArray(oldData.data);
          const targetArray = isNested ? oldData.data : oldData;

          const updatedArray = targetArray.map((review: any) => {
            // Only alter tasks if they belong to the targeted review round
            if (Number(review.id) !== Number(variables.reviewId)) {
              return review;
            }

            return {
              ...review,
              tasks: review.tasks.map((task: any) => {
                // Leave already VERIFIED tasks alone since the backend skips them
                if (task.status === "VERIFIED") return task;

                return {
                  ...task,
                  status: variables.status,
                  completedAt:
                    variables.status === "COMPLETED"
                      ? new Date().toISOString()
                      : task.completedAt,
                  updatedAt: new Date().toISOString(),
                };
              }),
            };
          });

          return isNested ? { ...oldData, data: updatedArray } : updatedArray;
        },
      );
    },
    onError: (err) => {
      onFailure({
        title: "Update Failed",
        message:
          extractErrorMessage(err) ||
          "Could not update review tasks status. Please try again.",
      });
    },
  });
  return {
    updateAllReviewTasksByStudent,
  };
};

export default useStudent;
