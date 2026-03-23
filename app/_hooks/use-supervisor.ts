import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { Project, Stats, ReviewTask } from "../_utils/types";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../_lib/utils";

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
      queryClient.invalidateQueries({
        queryKey: ["project-reviews", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["supervisor-stats"] });
      queryClient.invalidateQueries({ queryKey: ["supervisor-projects"] });
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
      toast.error(extractErrorMessage(err));
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
      queryClient.invalidateQueries({ queryKey: ["supervisor-projects"] });
      queryClient.invalidateQueries({ queryKey: ["supervisor-stats"] });
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
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
      toast.success("Task removed successfully");
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
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
      toast.success("Revision round deleted");
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
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
