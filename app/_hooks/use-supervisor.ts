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
      tasks,
    }: {
      projectId: number;
      tasks: { title: string; description?: string }[];
    }) => {
      const { data } = await api.post("/reviews", {
        projectId,
        tasks,
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
    mutationFn: async ({ taskId }: { taskId: number }) => {
      const { data } = await api.patch(`/reviews/tasks/${taskId}/verify`);
      return data;
    },
    onSuccess: (_, { taskId, projectId }: any) => {
      queryClient.invalidateQueries({
        queryKey: ["project-reviews", projectId],
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
      queryClient.invalidateQueries({ queryKey: ["supervisor-projects"] });
      queryClient.invalidateQueries({ queryKey: ["supervisor-stats"] });
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });

  return {
    getSupervisorProjects,
    getSupervisorStats,
    createReviewWithTasks,
    verifyTaskBySupervisor,
    updateProjectStatus,
  };
};

export default useSupervisor;
