import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { Project, Stats } from "../_utils/types";

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

  const getProjectReviews = (id: number) =>
    useQuery({
      queryKey: ["project-reviews", id],
      queryFn: async () => {
        const { data } = await api.get(`/reviews/${id}`);
        return data.reviews;
      },
      enabled: !!id,
    });
  const reviewProject = useMutation({
    mutationFn: async ({
      projectId,
      comments,
      rating,
      supervisorId,
    }: {
      projectId: number;
      comments: string;
      rating?: number;
      supervisorId: string;
    }) => {
      const { data } = await api.post("/reviews/generate", {
        projectId,
        comments,
        rating,
        supervisorId,
      });
      return data;
    },

    onSuccess: () => {
      // refresh projects & stats after review
      //   queryClient.invalidateQueries({ queryKey: ["supervisor-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["supervisor-stats"] });
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
        {
          status,
        },
      );
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervisor-projects"] });
      queryClient.invalidateQueries({ queryKey: ["supervisor-stats"] });
    },
  });

  return {
    getSupervisorProjects,
    getSupervisorStats,
    reviewProject,
    updateProjectStatus,
    getProjectReviews,
  };
};

export default useSupervisor;
