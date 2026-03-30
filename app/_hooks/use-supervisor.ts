import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { Project, Stats } from "../_utils/types";
import { extractErrorMessage } from "../_lib/utils";
import { onFailure, onSuccess } from "../_utils/Notification";

const useSupervisor = () => {
  const queryClient = useQueryClient();

  const getSupervisorStats = () =>
    useQuery<Stats>({
      queryKey: ["supervisor-stats"],
      queryFn: async () => {
        const { data } = await api.get("/supervisor/stats");
        return data?.stats;
      },
    });

  const getSupervisorProjects = () =>
    useQuery<Project[]>({
      queryKey: ["supervisor-projects"],
      queryFn: async () => {
        const { data } = await api.get("/supervisor/projects");
        return data?.projects;
      },
    });

  const createReviewWithTasks = useMutation({
    mutationFn: async ({
      projectId,
      summary,
      tasks,
    }: {
      projectId: number;
      summary: string;
      tasks: { title: string; description?: string }[];
    }) => {
      const { data } = await api.post("/reviews", {
        projectId,
        tasks,
        summary,
      });
      return data;
    },
    onSuccess: (_, { projectId }) => {
      onSuccess({
        title: "Review Published",
        message: "The feedback and tasks have been sent to the student.",
      });
      queryClient.invalidateQueries({
        queryKey: ["project-reviews", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["supervisor-stats"] });
      queryClient.invalidateQueries({ queryKey: ["supervisor-projects"] });
    },
    onError: (err) => {
      onFailure({
        title: "Review Failed",
        message:
          extractErrorMessage(err) || "Could not publish the review round.",
      });
    },
  });

  const verifyTaskBySupervisor = useMutation({
    mutationFn: async ({
      taskId,
      projectId,
    }: {
      taskId: number;
      projectId: number;
    }) => {
      const { data } = await api.patch(`/reviews/tasks/${taskId}/verify`);
      return data;
    },
    onSuccess: (_, { taskId, projectId }: any) => {
      queryClient.setQueryData(
        ["project-reviews", projectId],
        (oldData: any) => {
          if (!oldData) return [];

          // Map through the revision rounds and filter the task out of the correct round
          return oldData.map((review: any) => ({
            ...review,
            tasks: review.tasks.filter(
              (t: any) => Number(t.id) !== Number(taskId),
            ),
          }));
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["project-reviews", projectId],
      });
    },
    onError: (err) => {
      onFailure({
        title: "Verification Failed",
        message: extractErrorMessage(err) || "Could not verify this task.",
      });
    },
  });

  const updateProjectStatus = useMutation({
    mutationFn: async ({
      projectId,
      status,
    }: {
      projectId: number;
      status: "APPROVED" | "REJECTED" | "REVISION_REQUESTED";
    }) => {
      const { data } = await api.patch(
        `/supervisor/projects/${projectId}/status`,
        { status },
      );
      return data;
    },
    onSuccess: () => {
      onSuccess({
        title: "Status Updated",
        message: `Project has been marked as ${status.replace("_", " ")}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["supervisor-projects"] });
      queryClient.invalidateQueries({ queryKey: ["supervisor-stats"] });
    },
    onError: (err) => {
      onFailure({
        title: "Status Update Failed",
        message: extractErrorMessage(err),
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async ({
      taskId,
      projectId,
    }: {
      taskId: number;
      projectId: number;
    }) => {
      const { data } = await api.delete(`/reviews/tasks/${taskId}`);
      return data;
    },
    onSuccess: (_, { taskId, projectId }: any) => {
      onSuccess({
        title: "Task Deleted",
        message: "The task was successfully removed from the project.",
      });
      // Refresh the specific project board
      queryClient.setQueryData(
        ["project-reviews", projectId],
        (oldData: any) => {
          if (!oldData) return [];

          // Map through the revision rounds and filter the task out of the correct round
          return oldData.map((review: any) => ({
            ...review,
            tasks: review.tasks.filter(
              (t: any) => Number(t.id) !== Number(taskId),
            ),
          }));
        },
      );
    },
    onError: (err) =>
      onFailure({ title: "Delete Failed", message: extractErrorMessage(err) }),
  });

  const deleteReview = useMutation({
    mutationFn: async ({
      reviewId,
      projectId,
    }: {
      reviewId: number;
      projectId: number;
    }) => {
      const { data } = await api.delete(`/reviews/${reviewId}`);
      return data;
    },
    onSuccess: (_, { reviewId, projectId }: any) => {
      onSuccess({
        title: "Round Removed",
        message: "The revision round has been deleted.",
      });
      queryClient.setQueryData(
        ["project-reviews", projectId],
        (oldData: any) => {
          if (!oldData) return [];

          return oldData.filter(
            (review: any) => Number(review.id) !== Number(reviewId),
          );
        },
      );

      queryClient.invalidateQueries({ queryKey: ["supervisor-stats"] });
    },
    onError: (err) =>
      onFailure({ title: "Action Failed", message: extractErrorMessage(err) }),
  });

  return {
    getSupervisorProjects,
    getSupervisorStats,
    createReviewWithTasks,
    verifyTaskBySupervisor,
    updateProjectStatus,
    deleteTask,
    deleteReview,
  };
};

export default useSupervisor;
